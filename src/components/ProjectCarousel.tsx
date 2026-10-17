"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight, Cpu, ArrowUpRight, ArrowRight, Workflow, BarChart3, Bot, Network } from "lucide-react";
import { AI_ECOSYSTEM_SERVICES, ServiceItem } from "@/data/deckContent";
import { AuditModal } from "./ActionModals";

/* ==========================================================================
   ROBOT GESTURE ENGINE — timeline
   --------------------------------------------------------------------------
   Robot image: /public/download.png  (1024 x 1536 artwork)
   The robot's existing arm pixels are cut into 3 pieces (upper arm, forearm,
   hand) and rotated around the shoulder / elbow / wrist joints, so the robot
   really "swipes" the card. Each key = [ms, shoulder°, elbow°, wrist°].
   ========================================================================== */
const FORWARD_KEYS: number[][] = [
  [0, 0, 0, 0], [110, -3, -5, 5], [365, 48, 66, -24], [480, 44, 59, -15],
  [690, 69, 18, 12], [890, 65, 22, 4], [1160, 26, 27, -7], [1470, 0, 0, 0],
];
const BACKWARD_KEYS: number[][] = [
  [0, 0, 0, 0], [110, -3, -4, 4], [365, 66, 20, 6], [480, 64, 22, 5],
  [690, 40, 75, -24], [890, 43, 65, -15], [1160, 23, 26, -8], [1470, 0, 0, 0],
];
const GESTURE_MS = 1470; // total hand gesture time
const CARD_COMMIT_MS = 500; // moment the hand "throws" the card
const GRIP_MS = 270; // moment the fingers lift the card

interface GestureJob {
  target: number;
  from: number;
  direction: number;
  started: number;
  committed: boolean;
  grip: Animation | null;
  animations: Animation[];
}

interface Engine {
  request: (n: number, direction?: number) => void;
  step: (delta: number) => void;
  robotNext: () => void;
  togglePause: () => void;
}

/* ==========================================================================
   SCOPED STYLES (keyframes + stage layout). Everything is prefixed `pc-`
   so nothing leaks into the rest of the site.
   ========================================================================== */
const SCENE_CSS = `
.pc-scene{--pc-dx:150px;--pc-ease:cubic-bezier(.22,1,.36,1);--pc-line:rgba(9,28,9,.10);--pc-green:#091c09}
.pc-sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* ---------- Robot stage ---------- */
.pc-bg{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:visible}
.pc-robot-path{position:absolute;top:80px;right:2%;height:710px;aspect-ratio:2/3;animation:pc-robot-travel 28s ease-in-out infinite;will-change:transform}
.pc-robot-parallax{width:100%;height:100%;transform:perspective(1200px) translate3d(var(--pointer-x,0px),var(--pointer-y,0px),0) rotateY(var(--pointer-ry,0deg));transition:transform .6s var(--pc-ease)}
.pc-robot-float{height:100%;animation:pc-robot-hover 6s ease-in-out infinite}
.pc-robot-figure{height:100%;position:relative;animation:pc-robot-lean 8s ease-in-out infinite;transform-origin:50% 75%}
.pc-robot-rig{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 26px 22px rgba(9,28,9,.13));user-select:none}
.pc-robot-shadow{position:absolute;bottom:4%;left:22%;width:58%;height:4%;border-radius:50%;background:rgba(9,28,9,.12);filter:blur(13px);animation:pc-shadow-pulse 6s ease-in-out infinite;z-index:-1}
.pc-robot-trigger{position:absolute;z-index:2;left:13%;top:5%;width:75%;height:85%;padding:0;border:0;border-radius:45%;background:transparent;color:var(--pc-green);pointer-events:auto;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.pc-robot-trigger:focus-visible{outline:2px solid rgba(9,28,9,.6);outline-offset:8px}
.pc-robot-cue{position:absolute;top:39%;right:-8%;display:flex;align-items:center;gap:7px;padding:8px 11px;white-space:nowrap;border:1px solid rgba(9,28,9,.14);border-radius:99px;background:rgba(255,255,255,.94);box-shadow:0 6px 20px -8px rgba(9,28,9,.16);font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;transition:transform .25s var(--pc-ease),border-color .25s}
.pc-robot-cue svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.pc-robot-trigger:hover .pc-robot-cue,.pc-robot-trigger:focus-visible .pc-robot-cue{transform:translateY(-3px);border-color:rgba(9,28,9,.4)}

/* ---------- Gesture thread (hand -> card) ---------- */
.pc-gesture-field{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;overflow:visible;opacity:0}
.pc-gesture-thread{fill:none;stroke:rgba(9,28,9,.24);stroke-width:1;vector-effect:non-scaling-stroke}
.pc-gesture-pulse{fill:none;stroke:rgba(9,28,9,.7);stroke-width:1.5;stroke-linecap:round;stroke-dasharray:20 600;vector-effect:non-scaling-stroke}
.pc-gesture-contact{fill:#fff;stroke:rgba(9,28,9,.65);stroke-width:1;vector-effect:non-scaling-stroke}
.pc-gesture-halo{fill:none;stroke:rgba(9,28,9,.25);stroke-width:1;vector-effect:non-scaling-stroke}

/* ---------- Card stack ---------- */
.pc-stack{position:relative;z-index:4;height:500px;max-width:1000px;touch-action:pan-y;border-radius:24px}
.pc-card{position:absolute;top:12px;left:46%;width:min(350px,calc(100vw - 44px));height:430px;margin-left:calc(min(350px,calc(100vw - 44px))/-2);transition:transform .65s var(--pc-ease),opacity .65s var(--pc-ease);will-change:transform}
.pc-card[data-pos="-1"]{transform:translateX(-120%) rotate(-5deg) scale(.9);opacity:0;pointer-events:none}
.pc-card[data-pos="0"]{transform:none;opacity:1;z-index:5}
.pc-card[data-pos="1"]{transform:translateX(var(--pc-dx)) rotate(5deg) scale(.94);opacity:.68;z-index:4;pointer-events:none}
.pc-card[data-pos="2"]{transform:translateX(calc(var(--pc-dx)*1.75)) rotate(9deg) scale(.87);opacity:.35;z-index:3;pointer-events:none}
.pc-card[data-pos="3"]{transform:translateX(calc(var(--pc-dx)*2.3)) rotate(11deg) scale(.8);opacity:0;z-index:2;pointer-events:none}
.pc-card[data-pos="0"] .pc-card-surface{box-shadow:0 28px 55px -20px rgba(9,28,9,.18);border-color:rgba(9,28,9,.14)}
.pc-scene[data-gesture="true"] .pc-card{transition:none}
.pc-scene[data-gesture="true"] .pc-robot-path,
.pc-scene[data-gesture="true"] .pc-robot-float,
.pc-scene[data-gesture="true"] .pc-robot-figure,
.pc-scene[data-gesture="true"] .pc-robot-shadow{animation-play-state:paused}
.pc-scene[data-motion-paused="true"] *{animation-play-state:paused!important}
.pc-scene[data-motion-paused="true"] .pc-robot-parallax{transform:none}
.pc-scene[data-motion-paused="true"] .pc-card{transition:none}
.pc-inq{transition:transform .25s var(--pc-ease)}
.pc-inq:hover{transform:translateY(-2px)}

/* ---------- Intro (plays once) ---------- */
.pc-rise{animation:pc-rise .9s var(--pc-ease) both}
.pc-rise-2{animation:pc-rise .9s .12s var(--pc-ease) both}
.pc-robot-enter{animation:pc-robot-enter 1.2s .1s var(--pc-ease) both}

@keyframes pc-robot-travel{0%,100%{transform:translate3d(0,0,0)}24%{transform:translate3d(-48%,2%,0)}50%{transform:translate3d(-17%,7%,0)}76%{transform:translate3d(-65%,1%,0)}}
@keyframes pc-robot-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes pc-robot-lean{0%,100%{transform:rotate(-2deg) scale(1)}50%{transform:rotate(2deg) scale(1.02)}}
@keyframes pc-shadow-pulse{50%{transform:scaleX(.82);opacity:.6}}
@keyframes pc-orb-drift{to{transform:translate(-40px,30px) scale(1.1)}}
@keyframes pc-rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes pc-robot-enter{from{opacity:0;transform:translateY(40px) scale(.96)}to{opacity:1;transform:none}}
@keyframes pc-robot-travel-mobile{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-7%,2%,0)}}

@media (max-width:1000px) and (min-width:701px){
  .pc-robot-path{height:610px;right:-5%;top:120px}
  .pc-top{max-width:54%}
  .pc-card{left:42%}
}
@media (max-width:700px){
  .pc-scene{--pc-dx:86px}
  .pc-robot-path{top:63px;right:calc(50% - 118px);height:340px;animation-name:pc-robot-travel-mobile}
  .pc-top{margin-top:322px;text-align:center;margin-left:auto;margin-right:auto;max-width:100%!important}
  .pc-top p{margin-left:auto;margin-right:auto}
  .pc-stack{height:490px;max-width:none}
  .pc-card{left:50%;height:425px}
  .pc-robot-cue{font-size:9px;gap:5px;padding:6px 8px;right:-13%}
  .pc-robot-cue svg{width:11px;height:11px}
  .pc-gesture-field{z-index:2}
}
@media (prefers-reduced-motion:reduce){
  .pc-scene *,.pc-scene *::before,.pc-scene *::after{animation:none!important;transition:none!important}
  .pc-robot-parallax{transform:none!important}
  .pc-gesture-field{display:none}
}
`;

export const ProjectCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false); // robot is mid-gesture
  const [isPaused, setIsPaused] = useState(false); // user paused motion
  const [reducedMotion, setReducedMotion] = useState(false);

  const services = AI_ECOSYSTEM_SERVICES;
  const totalSlots = services.length;

  const sceneRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const shoulderRef = useRef<SVGGElement>(null);
  const elbowRef = useRef<SVGGElement>(null);
  const wristRef = useRef<SVGGElement>(null);
  const palmRef = useRef<SVGCircleElement>(null);
  const fieldRef = useRef<SVGSVGElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGPathElement>(null);
  const contactRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const activeIndex = Math.min(currentIndex, Math.max(0, totalSlots - 1));

  /* ------------------------------------------------------------------------
     ENGINE: robot arm rig + card hand-off timeline (imperative on purpose —
     it runs at 60fps with requestAnimationFrame + Web Animations API, so it
     never triggers React re-renders except for the final card index).
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const scene = sceneRef.current;
    const stack = stackRef.current;
    const parallax = parallaxRef.current;
    const shoulder = shoulderRef.current;
    const elbow = elbowRef.current;
    const wrist = wristRef.current;
    const palm = palmRef.current;
    const field = fieldRef.current;
    const thread = threadRef.current;
    const pulse = pulseRef.current;
    const contact = contactRef.current;
    const halo = haloRef.current;
    const cards = cardRefs.current.filter((c): c is HTMLElement => !!c);
    if (!scene || !stack || !parallax || !shoulder || !elbow || !wrist || !palm || !field || !thread || !pulse || !contact || !halo || cards.length === 0) {
      return;
    }

    const total = cards.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer:fine) and (min-width:701px)");

    let i = 0;
    let tx: GestureJob | null = null;
    let queued: number | null = null;
    let manualPause = false;
    let inView = true;
    let pointerFrame = 0;
    let gestureFrame = 0;

    const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));
    const motionAllowed = () => !manualPause && !reduce.matches && !document.hidden && inView;
    const logicalIndex = () => queued ?? tx?.target ?? i;

    // `sync` is used while the hand is throwing a card: we need the DOM to be
    // updated immediately so we can read the new computed card positions.
    const render = (n: number, sync = false) => {
      i = clamp(n);
      const apply = () => setCurrentIndex(i);
      if (sync) flushSync(apply);
      else apply();
    };

    const pose = (s = 0, e = 0, w = 0) => {
      shoulder.setAttribute("transform", `rotate(${s.toFixed(3)} 357 658)`);
      elbow.setAttribute("transform", `rotate(${e.toFixed(3)} 254 794)`);
      wrist.setAttribute("transform", `rotate(${w.toFixed(3)} 195 918)`);
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);
    const sample = (keys: number[][], ms: number) => {
      let n = 0;
      while (n < keys.length - 2 && ms > keys[n + 1][0]) n++;
      const a = keys[n];
      const b = keys[n + 1];
      const t = smooth(Math.max(0, Math.min(1, (ms - a[0]) / (b[0] - a[0]))));
      pose(a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t);
    };

    // Thread from the robot's palm to the card being picked up.
    const drawThread = (active: HTMLElement, ms: number) => {
      const m = palm.getScreenCTM();
      if (!m) return;
      const r = scene.getBoundingClientRect();
      const c = active.getBoundingClientRect();
      const p = new DOMPoint(170, 984).matrixTransform(m);
      const x = p.x - r.left;
      const y = p.y - r.top;
      const endX = c.right - r.left - 28;
      const endY = c.top - r.top + 25;
      const alpha = Math.min(1, Math.max(0, (ms - 220) / 140)) * Math.min(1, Math.max(0, (780 - ms) / 200));
      field.style.opacity = String(alpha * 0.85);
      field.setAttribute("viewBox", `0 0 ${scene.clientWidth} ${scene.clientHeight}`);
      const bend = Math.min(85, Math.abs(endX - x) * 0.24 + 25);
      const d = `M ${x} ${y} C ${x - 45} ${y - bend}, ${endX + 36} ${endY - 34}, ${endX} ${endY}`;
      thread.setAttribute("d", d);
      pulse.setAttribute("d", d);
      pulse.style.strokeDashoffset = String(70 - (ms - 220) * 0.42);
      contact.setAttribute("cx", String(x));
      contact.setAttribute("cy", String(y));
      halo.setAttribute("cx", String(x));
      halo.setAttribute("cy", String(y));
      halo.setAttribute("r", String(8 + Math.sin(Math.max(0, ms - 220) / 560 * Math.PI) * 5));
    };

    const animateCards = (job: GestureJob) => {
      if (job.committed) return;
      job.committed = true;
      const snap = () => cards.map((c) => {
        const cs = getComputedStyle(c);
        return { transform: cs.transform, opacity: cs.opacity };
      });
      const from = snap();
      job.grip?.cancel();
      const old = cards[i];
      const focused = document.activeElement;
      if (old.contains(focused)) stack.focus({ preventScroll: true });
      render(job.target, true);
      const to = snap();
      cards.forEach((c, k) => {
        let frames: Keyframe[] = [from[k], to[k]];
        if (k === i) {
          const sign = job.direction;
          const nearby = Math.abs(job.target - job.from) === 1;
          frames = [
            { transform: nearby ? from[k].transform : `translateX(${sign * 120}px) translateY(5px) rotate(${sign * 7}deg) scale(.93)`, opacity: 1, offset: 0 },
            { transform: `translateX(${-sign * 2}px) translateY(-1px) rotate(${-sign * 0.3}deg) scale(1)`, opacity: 1, offset: 0.82 },
            { transform: to[k].transform, opacity: 1, offset: 1 },
          ];
        }
        job.animations.push(c.animate(frames, { duration: k === i ? 710 : 650, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
      });
      // Arriving card stays opaque above the departing one (no text bleed-through).
      old.style.zIndex = "4";
    };

    const clean = (job: GestureJob | null) => {
      cancelAnimationFrame(gestureFrame);
      gestureFrame = 0;
      job?.grip?.cancel();
      job?.animations.forEach((a) => a.cancel());
      cards.forEach((c) => c.style.removeProperty("z-index"));
      field.style.opacity = "0";
      pose();
      scene.dataset.gesture = "false";
      scene.dataset.busy = "false";
      stack.setAttribute("aria-busy", "false");
      setIsBusy(false);
    };

    const settle = () => {
      if (!tx) return;
      const target = queued ?? tx.target;
      clean(tx);
      tx = null;
      queued = null;
      // Suppress transitions when a preference / resize / visibility change interrupts.
      scene.dataset.gesture = "true";
      render(target, true);
      void stack.offsetWidth;
      scene.dataset.gesture = "false";
    };

    let request: (n: number, direction?: number) => void;

    const finish = (job: GestureJob) => {
      if (tx !== job) return;
      if (!job.committed) render(job.target);
      const nextTarget = queued;
      queued = null;
      clean(job);
      tx = null;
      if (nextTarget !== null && nextTarget !== i) request(nextTarget, nextTarget > i ? 1 : -1);
    };

    request = (n, direction) => {
      n = clamp(n);
      if (tx) {
        queued = n;
        return;
      }
      if (n === i) return;
      if (!motionAllowed() || typeof cards[0].animate !== "function") {
        render(n);
        return;
      }
      cancelAnimationFrame(pointerFrame);
      const job: GestureJob = {
        target: n,
        from: i,
        direction: direction ?? (n > i ? 1 : -1),
        started: performance.now(),
        committed: false,
        grip: null,
        animations: [],
      };
      tx = job;
      scene.dataset.gesture = "true";
      scene.dataset.busy = "true";
      stack.setAttribute("aria-busy", "true");
      setIsBusy(true);
      const tick = (now: number) => {
        if (tx !== job) return;
        const ms = now - job.started;
        sample(job.direction > 0 ? FORWARD_KEYS : BACKWARD_KEYS, ms);
        if (ms >= GRIP_MS && !job.grip && !job.committed) {
          job.grip = cards[job.from].animate(
            [
              { transform: "translateY(0) rotate(0)" },
              { transform: `translateY(-7px) rotate(${-job.direction * 1.1}deg)` },
            ],
            { duration: 230, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
          );
        }
        if (ms >= CARD_COMMIT_MS) animateCards(job);
        drawThread(cards[job.from], ms);
        if (ms >= GESTURE_MS) {
          finish(job);
          return;
        }
        gestureFrame = requestAnimationFrame(tick);
      };
      gestureFrame = requestAnimationFrame(tick);
    };

    const step = (delta: number) => request(logicalIndex() + delta, delta);
    const robotNext = () => request((logicalIndex() + 1) % total, 1);

    const resetPointer = () => {
      ["--pointer-x", "--pointer-y", "--pointer-ry"].forEach((k) => parallax.style.removeProperty(k));
    };

    const syncMotion = () => {
      const paused = !motionAllowed();
      scene.dataset.motionPaused = String(paused);
      setReducedMotion(reduce.matches);
      if (paused) {
        cancelAnimationFrame(pointerFrame);
        settle();
        resetPointer();
      }
    };

    const togglePause = () => {
      manualPause = !manualPause;
      setIsPaused(manualPause);
      syncMotion();
    };

    const onResize = () => settle();
    const onPointerMove = (e: PointerEvent) => {
      if (tx || !motionAllowed() || !fine.matches || e.pointerType === "touch") return;
      cancelAnimationFrame(pointerFrame);
      const { clientX, clientY } = e;
      pointerFrame = requestAnimationFrame(() => {
        const r = scene.getBoundingClientRect();
        const x = (clientX - r.left) / r.width - 0.5;
        const y = (clientY - r.top) / r.height - 0.5;
        parallax.style.setProperty("--pointer-x", `${x * 20}px`);
        parallax.style.setProperty("--pointer-y", `${y * 12}px`);
        parallax.style.setProperty("--pointer-ry", `${x * 6}deg`);
      });
    };
    const onPointerLeave = () => {
      cancelAnimationFrame(pointerFrame);
      if (!tx) resetPointer();
    };

    window.addEventListener("resize", onResize, { passive: true });
    reduce.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    fine.addEventListener("change", resetPointer);
    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", onPointerLeave);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        syncMotion();
      }, { threshold: 0.03 });
      io.observe(scene);
    }

    scene.dataset.busy = "false";
    scene.dataset.gesture = "false";
    syncMotion();
    engineRef.current = { request, step, robotNext, togglePause };

    return () => {
      cancelAnimationFrame(gestureFrame);
      cancelAnimationFrame(pointerFrame);
      tx?.grip?.cancel();
      tx?.animations.forEach((a) => a.cancel());
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      fine.removeEventListener("change", resetPointer);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      io?.disconnect();
      engineRef.current = null;
    };
  }, [totalSlots]);

  /* ---------------------------- UI handlers ---------------------------- */
  const handlePrev = useCallback(() => engineRef.current?.step(-1), []);
  const handleNext = useCallback(() => engineRef.current?.step(1), []);
  const handleRobot = useCallback(() => engineRef.current?.robotNext(), []);
  const goTo = useCallback((n: number) => engineRef.current?.request(n), []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      goTo(e.key === "Home" ? 0 : totalSlots - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !e.changedTouches.length) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
  };

  // Render authored SVG artwork for each service type in Clean Editorial Theme (Image 1)
  const renderServiceArtwork = (item: ServiceItem) => {
    switch (item.iconType) {
      case "applications":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            {/* Isometric layered plates graphic from Image 1 */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
              <svg viewBox="0 0 48 48" className="w-9 h-9 stroke-[#091c09] fill-none stroke-[1.6]" aria-hidden="true">
                <path d="M24 10 L40 18 L24 26 L8 18 Z" />
                <path d="M8 23 L24 31 L40 23" />
                <path d="M8 28 L24 36 L40 28" />
                <circle cx="24" cy="18" r="2.5" fill="#091c09" />
              </svg>
            </div>
            <div className="text-[11px] font-mono font-medium text-[rgba(9,28,9,0.65)]">
              Purpose-built • Connected • Useful
            </div>
          </div>
        );
      case "agents":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
              <Bot className="w-8 h-8 text-[#091c09]" />
            </div>
            {/* Interactive node status */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-[rgba(9,28,9,0.70)]">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <span>Qualify • Assist • Execute</span>
            </div>
          </div>
        );
      case "automation":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
              <Workflow className="w-8 h-8 text-[#091c09]" />
            </div>
            {/* Workflow trigger subline */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
              <span>Trigger • Route • Complete</span>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8 text-[#091c09]" />
            </div>
            {/* Data intelligence subline */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
              <span>Collect • Model • Predict</span>
            </div>
          </div>
        );
      case "systems":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
              <Network className="w-8 h-8 text-[#091c09]" />
            </div>
            {/* Embedded integration subline */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
              <span>Connect • Sync • Scale</span>
            </div>
          </div>
        );
      case "custom":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
              <Cpu className="w-8 h-8 text-[#091c09]" />
            </div>
            {/* Custom AI subline */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
              <span>Assess • Prioritise • Plan</span>
            </div>
          </div>
        );
    }
  };

  const nextTitle = services[(activeIndex + 1) % totalSlots]?.title ?? "next service";

  return (
    <section
      ref={sceneRef}
      id="services"
      className="pc-scene relative w-full pt-16 sm:pt-20 md:pt-24 pb-14 sm:pb-20 md:pb-24 scroll-mt-24 bg-white text-[#091c09] select-none overflow-hidden border-t border-[rgba(9,28,9,0.08)]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(9, 28, 9, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(9, 28, 9, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
      aria-label="Our AI Ecosystem Services Carousel"
    >
      <style>{SCENE_CSS}</style>

      {/*
        ========================================================================
        SUBTLE LABS ANIMATED SHAPES (Preserved for tests & faint clean aura)
        ========================================================================
      */}
      <div
        aria-hidden="true"
        className="absolute -top-16 sm:-top-24 md:-top-32 -left-16 sm:-left-24 md:-left-36 w-[320px] sm:w-[480px] md:w-[640px] lg:w-[760px] h-[320px] sm:h-[480px] md:h-[640px] lg:h-[760px] pointer-events-none -z-0 opacity-10 blur-3xl"
      >
        {/* <div
          className="w-full h-full rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] animate-labs-blue"
          style={{ transformOrigin: "48% 52%" }}
        /> */}
      </div>

      {/* <div
        aria-hidden="true"
        className="absolute -top-24 sm:-top-32 md:-top-40 -right-12 sm:-right-20 md:-right-32 w-[300px] sm:w-[440px] md:w-[600px] lg:w-[720px] h-[280px] sm:h-[420px] md:h-[560px] lg:h-[660px] pointer-events-none -z-0 opacity-10 blur-3xl"
      > 
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-[#00E676] via-[#10B981] to-[#047857] animate-labs-green"
        style={{ transformOrigin: "52% 48%" }}
      />
    </div>
*/}
      {/* Subtle Ambient Radial Orb — now drifts slowly */}
      <div
        aria-hidden="true"
        className="absolute right-[5%] top-[10%] w-[560px] h-[560px] rounded-full bg-radial from-[rgba(9,28,9,0.06)] via-[rgba(9,28,9,0.02)] to-transparent blur-3xl pointer-events-none -z-0"
        style={{ animation: "pc-orb-drift 18s ease-in-out infinite alternate" }}
      />

      {/*
        ========================================================================
        ROBOT — /public/download.png
        Wanders across the stage, floats, leans, follows the cursor (parallax)
        and swipes the cards with its real articulated arm.
        ========================================================================
      */}
      <div className="pc-bg" aria-hidden={false}>
        <div className="pc-robot-path">
          <div className="pc-robot-parallax" ref={parallaxRef}>
            <div className="pc-robot-float">
              <div className="pc-robot-figure pc-robot-enter">
                <svg className="pc-robot-rig" viewBox="0 0 1024 1536" aria-hidden="true" focusable="false">
                  <defs>
                    <image id="pc-robot-pixels" href="/download.png" width="1024" height="1536" />
                    {/* Arm silhouette — only the existing arm pixels are articulated. */}
                    <path
                      id="pc-arm-outline"
                      d="M 195 575 L 365 585 L 382 613 L 365 676 L 350 730 L 337 774 L 322 805 L 323 869 L 283 932 L 256 962 L 258 1097 L 86 1097 L 79 965 L 134 885 L 141 804 Z"
                    />
                    <clipPath id="pc-arm-silhouette"><use href="#pc-arm-outline" /></clipPath>
                    <mask id="pc-body-without-arm" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536" style={{ maskType: "luminance" }}>
                      <rect width="1024" height="1536" fill="white" />
                      <use href="#pc-arm-outline" fill="black" />
                    </mask>
                    <clipPath id="pc-upper-arm-cut"><path d="M -100 -100 H 1200 V 1176 L -100 656 Z" /></clipPath>
                    <clipPath id="pc-forearm-cut"><path d="M -100 652 L 1200 1172 V 1415 L -100 765 Z" /></clipPath>
                    <clipPath id="pc-hand-cut"><path d="M -100 760 L 1200 1410 V 1700 H -100 Z" /></clipPath>
                    <linearGradient id="pc-joint-metal" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#101719" />
                      <stop offset=".42" stopColor="#3d4445" />
                      <stop offset=".65" stopColor="#111719" />
                      <stop offset="1" stopColor="#080b0c" />
                    </linearGradient>
                  </defs>

                  {/* Body without the arm */}
                  <use href="#pc-robot-pixels" mask="url(#pc-body-without-arm)" />

                  {/* Arm chain: shoulder -> elbow -> wrist */}
                  <g ref={shoulderRef} transform="rotate(0 357 658)">
                    <ellipse cx="357" cy="658" rx="17" ry="36" transform="rotate(22 357 658)" fill="url(#pc-joint-metal)" />
                    <g clipPath="url(#pc-arm-silhouette)"><use href="#pc-robot-pixels" clipPath="url(#pc-upper-arm-cut)" /></g>
                    <g ref={elbowRef} transform="rotate(0 254 794)">
                      <ellipse cx="254" cy="794" rx="40" ry="19" transform="rotate(23 254 794)" fill="url(#pc-joint-metal)" />
                      <g clipPath="url(#pc-arm-silhouette)"><use href="#pc-robot-pixels" clipPath="url(#pc-forearm-cut)" /></g>
                      <g ref={wristRef} transform="rotate(0 195 918)">
                        <ellipse cx="195" cy="918" rx="28" ry="18" transform="rotate(27 195 918)" fill="url(#pc-joint-metal)" />
                        <g clipPath="url(#pc-arm-silhouette)"><use href="#pc-robot-pixels" clipPath="url(#pc-hand-cut)" /></g>
                        <circle ref={palmRef} cx="170" cy="984" r="1" opacity="0" />
                      </g>
                    </g>
                  </g>
                </svg>

                {/* Interactive "Tap to swap" pill — whole robot is the click target */}
                <button
                  type="button"
                  onClick={handleRobot}
                  className="pc-robot-trigger"
                  aria-label={`Ask the robot to show ${nextTitle}`}
                  aria-controls="pc-stack"
                  aria-describedby="pc-robot-help"
                >
                  <span className="pc-robot-cue">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                    <span>{isBusy ? "Swapping…" : "Tap to swap"}</span>
                  </span>
                </button>
                <span className="pc-robot-shadow" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gesture thread: palm -> card */}
      <svg ref={fieldRef} className="pc-gesture-field" aria-hidden="true" focusable="false">
        <path ref={threadRef} className="pc-gesture-thread" />
        <path ref={pulseRef} className="pc-gesture-pulse" />
        <circle ref={haloRef} className="pc-gesture-halo" r="10" />
        <circle ref={contactRef} className="pc-gesture-contact" r="3" />
      </svg>
      <span className="pc-sr-only" id="pc-robot-help">
        Click or tap the robot to see its hand swipe to the next card. You can also use the arrow buttons, keyboard or swipe the cards.
      </span>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10 pointer-events-none">
        <div className="relative">
          {/* Heading Text Column */}
          <div className="pc-top pc-rise relative z-20 max-w-xs sm:max-w-sm md:max-w-[380px] lg:max-w-xl mb-6 sm:mb-8 lg:mb-10 md:min-h-[200px] flex flex-col justify-center">
            {/* Pill Eyebrow Tag matching Image 1 */}
            <div className="inline-flex self-start max-[700px]:self-center items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[rgba(9,28,9,0.04)] border border-[rgba(9,28,9,0.09)] text-[10px] sm:text-xs font-mono font-bold tracking-[0.14em] text-[#091c09] mb-2.5 sm:mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#091c09]" />
              <span>OUR AI ECOSYSTEM</span>
            </div>
            <h2
              className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#091c09] tracking-tight leading-[1.08]"
              style={{ textShadow: "0 0 20px #fff, 0 0 6px #fff" }}
            >
              AI, built around <br className="hidden sm:inline" />your business.
            </h2>
            <p
              className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium max-w-[36ch]"
              style={{ textShadow: "0 0 12px #fff, 0 0 4px #fff" }}
            >
              We identify where intelligence can create actual business value.
            </p>
          </div>

          {/*
            ========================================================================
            CAROUSEL STAGE (cards are positioned by data-pos; the robot's hand
            moves them with the Web Animations API)
            ========================================================================
          */}
          <div
            ref={stackRef}
            id="pc-stack"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => { touchStartRef.current = null; }}
            role="region"
            aria-roledescription="carousel"
            aria-label="AI Ecosystem Service Carousel"
            className="pc-stack pc-rise-2 pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091c09]/20"
          >
            {services.map((item, index) => {
              const offset = index - activeIndex;
              const pos = Math.max(-1, Math.min(3, offset));
              const isCenter = offset === 0;

              return (
                <article
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                    if (el) (el as HTMLElement & { inert: boolean }).inert = !isCenter;
                  }}
                  data-pos={pos}
                  role="group"
                  aria-label={`${item.title}, service ${index + 1} of ${totalSlots}`}
                  aria-hidden={!isCenter}
                  className="pc-card"
                >
                  {/* Clean White Editorial Card Surface matching Image 1 */}
                  <div className="pc-card-surface w-full h-full p-4 sm:p-5 md:p-6 flex flex-col select-none relative overflow-hidden rounded-[28px] bg-white border border-[rgba(9,28,9,0.10)] shadow-[0_12px_32px_-12px_rgba(9,28,9,0.08)]">
                    {/* Inset Neutral Media Region with authored illustration */}
                    <div className="w-full h-[190px] flex-none rounded-[20px] bg-[rgba(9,28,9,0.03)] border border-[rgba(9,28,9,0.08)] flex flex-col items-center justify-center relative overflow-hidden">
                      {renderServiceArtwork(item)}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[rgba(9,28,9,0.12)] text-[10px] sm:text-[11px] font-mono font-bold text-[#091c09] shadow-2xs">
                          {item.category}
                        </span>
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#091c09] text-white text-[10px] sm:text-[11px] font-mono font-bold shadow-xs">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content Area: Left-aligned with clear hierarchy */}
                    <div className="pt-3 sm:pt-4 flex flex-col justify-between flex-grow relative z-10">
                      <div>
                        <h3 className="font-urbanist font-extrabold text-lg sm:text-xl md:text-2xl text-[#091c09] tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="font-urbanist font-medium text-xs sm:text-sm text-[rgba(9,28,9,0.70)] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Link Area */}
                      <div className="pt-3 flex items-center justify-between border-t border-[rgba(9,28,9,0.10)] mt-auto">
                        <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[rgba(9,28,9,0.60)]">
                          Enterprise Service
                        </span>
                        <button
                          type="button"
                          tabIndex={isCenter ? 0 : -1}
                          aria-label={`Inquire about ${item.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                          }}
                          className="pc-inq inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs font-urbanist font-bold shadow-sm bg-[#091c09] hover:bg-[#091c09]/90 cursor-pointer"
                        >
                          Inquire <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/*
            ========================================================================
            CIRCULAR CONTROLS & ITEM COUNTER (Image 1)
            ========================================================================
          */}
          <div className="pointer-events-auto mt-4 sm:mt-5 max-w-[1000px] flex items-center justify-center gap-3 sm:gap-4 flex-wrap relative z-20">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous service"
              aria-controls="pc-stack"
              className="w-11 h-11 rounded-full bg-white hover:bg-[#F7F8F7] active:bg-[#ECEEEC] border border-[rgba(9,28,9,0.14)] text-[#091c09] flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#091c09]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[rgba(9,28,9,0.14)] shadow-2xs" role="group" aria-label="Choose a service">
              {services.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${item.title}`}
                  aria-current={i === activeIndex}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex
                    ? "w-6 bg-[#091c09]"
                    : "w-2 bg-[rgba(9,28,9,0.22)] hover:bg-[rgba(9,28,9,0.45)]"
                    }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === totalSlots - 1}
              aria-label="Next service"
              aria-controls="pc-stack"
              className="w-11 h-11 rounded-full bg-[#091c09] hover:bg-[#091c09]/90 border border-[#091c09] text-white flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#091c09]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter Badge with Pulse Indicator matching Image 1 */}
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[rgba(9,28,9,0.14)] text-[11px] font-mono font-bold text-[#091c09] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              <span>0{activeIndex + 1} / 0{totalSlots}</span>
            </div>
          </div>

          {/* Footer row: robot hint + motion toggle */}
          <div className="pointer-events-auto relative z-20 mt-6 sm:mt-8 pt-5 border-t border-[rgba(9,28,9,0.10)] flex items-center justify-between gap-4 text-[10px] font-mono font-medium text-[rgba(9,28,9,0.65)]">
            <button
              type="button"
              onClick={handleRobot}
              aria-controls="pc-stack"
              className="inline-flex items-center gap-2 hover:underline underline-offset-4 cursor-pointer text-left text-[#091c09]"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Let the robot swap the cards ↗</span>
            </button>
            <button
              type="button"
              onClick={() => engineRef.current?.togglePause()}
              disabled={reducedMotion}
              aria-pressed={isPaused || reducedMotion}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[rgba(9,28,9,0.14)] text-[#091c09] cursor-pointer disabled:cursor-default"
            >
              {reducedMotion ? "Reduced motion" : isPaused ? "▶  Resume motion" : "Ⅱ  Pause motion"}
            </button>
          </div>
        </div>
      </div>

      <span className="pc-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {services[activeIndex]?.title}, service {activeIndex + 1} of {totalSlots}
      </span>

      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section >
  );
};
// "use client";

// import React, { useState, useRef, useCallback } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, Cpu, ArrowUpRight, ArrowRight, Workflow, BarChart3, Bot, Network } from "lucide-react";
// import { AI_ECOSYSTEM_SERVICES, ServiceItem } from "@/data/deckContent";
// import { AuditModal } from "./ActionModals";

// export const ProjectCarousel: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const touchStartRef = useRef<{ x: number; y: number } | null>(null);

//   const services = AI_ECOSYSTEM_SERVICES;
//   const totalSlots = services.length;

//   const handlePrev = useCallback(() => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
//   }, []);

//   const handleNext = useCallback(() => {
//     setCurrentIndex((prev) => (prev < totalSlots - 1 ? prev + 1 : 0));
//   }, [totalSlots]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "ArrowLeft") {
//       e.preventDefault();
//       handlePrev();
//     } else if (e.key === "ArrowRight") {
//       e.preventDefault();
//       handleNext();
//     }
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     const touch = e.touches[0];
//     touchStartRef.current = { x: touch.clientX, y: touch.clientY };
//   };

//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (!touchStartRef.current) return;
//     const touch = e.changedTouches[0];
//     const deltaX = touch.clientX - touchStartRef.current.x;
//     const deltaY = touch.clientY - touchStartRef.current.y;
//     touchStartRef.current = null;

//     if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
//       if (deltaX > 0) {
//         handlePrev();
//       } else {
//         handleNext();
//       }
//     }
//   };

//   const activeIndex = Math.min(currentIndex, Math.max(0, totalSlots - 1));

//   // Render authored SVG artwork for each service type in Clean Editorial Theme (Image 1)
//   const renderServiceArtwork = (item: ServiceItem) => {
//     switch (item.iconType) {
//       case "applications":
//         return (
//           <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
//             {/* Isometric layered plates graphic from Image 1 */}
//             <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
//               <svg viewBox="0 0 48 48" className="w-9 h-9 stroke-[#091c09] fill-none stroke-[1.6]" aria-hidden="true">
//                 <path d="M24 10 L40 18 L24 26 L8 18 Z" />
//                 <path d="M8 23 L24 31 L40 23" />
//                 <path d="M8 28 L24 36 L40 28" />
//                 <circle cx="24" cy="18" r="2.5" fill="#091c09" />
//               </svg>
//             </div>
//             <div className="text-[11px] font-mono font-medium text-[rgba(9,28,9,0.65)]">
//               Purpose-built • Connected • Useful
//             </div>
//           </div>
//         );
//       case "agents":
//         return (
//           <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
//               <Bot className="w-8 h-8 text-[#091c09]" />
//             </div>
//             {/* Interactive node status */}
//             <div className="flex items-center gap-2 text-[11px] font-mono text-[rgba(9,28,9,0.70)]">
//               <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
//               <span>Qualify • Assist • Execute</span>
//             </div>
//           </div>
//         );
//       case "automation":
//         return (
//           <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
//               <Workflow className="w-8 h-8 text-[#091c09]" />
//             </div>
//             {/* Workflow trigger subline */}
//             <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
//               <span>Trigger • Route • Complete</span>
//             </div>
//           </div>
//         );
//       case "analytics":
//         return (
//           <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
//               <BarChart3 className="w-8 h-8 text-[#091c09]" />
//             </div>
//             {/* Data intelligence subline */}
//             <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
//               <span>Collect • Model • Predict</span>
//             </div>
//           </div>
//         );
//       case "systems":
//         return (
//           <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
//               <Network className="w-8 h-8 text-[#091c09]" />
//             </div>
//             {/* Embedded integration subline */}
//             <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
//               <span>Connect • Sync • Scale</span>
//             </div>
//           </div>
//         );
//       case "custom":
//         return (
//           <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] shadow-xs flex items-center justify-center mb-3">
//               <Cpu className="w-8 h-8 text-[#091c09]" />
//             </div>
//             {/* Custom AI subline */}
//             <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(9,28,9,0.65)]">
//               <span>Assess • Prioritise • Plan</span>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <section
//       id="services"
//       className="relative w-full pt-16 sm:pt-20 md:pt-24 pb-14 sm:pb-20 md:pb-24 scroll-mt-24 bg-white text-[#091c09] select-none overflow-hidden border-t border-[rgba(9,28,9,0.08)]"
//       style={{
//         backgroundImage: `
//           linear-gradient(rgba(9, 28, 9, 0.035) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(9, 28, 9, 0.035) 1px, transparent 1px)
//         `,
//         backgroundSize: "60px 60px",
//       }}
//       aria-label="Our AI Ecosystem Services Carousel"
//     >
//       {/* 
//         ========================================================================
//         SUBTLE LABS ANIMATED SHAPES (Preserved for tests & faint clean aura)
//         ========================================================================
//       */}
//       <div
//         aria-hidden="true"
//         className="absolute -top-16 sm:-top-24 md:-top-32 -left-16 sm:-left-24 md:-left-36 w-[320px] sm:w-[480px] md:w-[640px] lg:w-[760px] h-[320px] sm:h-[480px] md:h-[640px] lg:h-[760px] pointer-events-none -z-0 opacity-10 blur-3xl"
//       >
//         <div
//           className="w-full h-full rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] animate-labs-blue"
//           style={{ transformOrigin: "48% 52%" }}
//         />
//       </div>

//       <div
//         aria-hidden="true"
//         className="absolute -top-24 sm:-top-32 md:-top-40 -right-12 sm:-right-20 md:-right-32 w-[300px] sm:w-[440px] md:w-[600px] lg:w-[720px] h-[280px] sm:h-[420px] md:h-[560px] lg:h-[660px] pointer-events-none -z-0 opacity-10 blur-3xl"
//       >
//         <div
//           className="w-full h-full rounded-full bg-gradient-to-br from-[#00E676] via-[#10B981] to-[#047857] animate-labs-green"
//           style={{ transformOrigin: "52% 48%" }}
//         />
//       </div>

//       {/* Subtle Ambient Radial Orb matching Image 1 */}
//       <div
//         aria-hidden="true"
//         className="absolute right-[5%] top-[10%] w-[560px] h-[560px] rounded-full bg-radial from-[rgba(9,28,9,0.06)] via-[rgba(9,28,9,0.02)] to-transparent blur-3xl pointer-events-none -z-0"
//       />

//       <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">

//         {/* Section Container with Layered Composition */}
//         <div className="relative">

//           {/* Heading Text Column */}
//           <div className="max-w-xs sm:max-w-sm md:max-w-[380px] lg:max-w-xl mb-6 sm:mb-8 lg:mb-12 relative z-20">
//             {/* Pill Eyebrow Tag matching Image 1 */}
//             <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[rgba(9,28,9,0.04)] border border-[rgba(9,28,9,0.09)] text-[10px] sm:text-xs font-mono font-bold tracking-[0.14em] text-[#091c09] mb-2.5 sm:mb-3">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#091c09]" />
//               <span>OUR AI ECOSYSTEM</span>
//             </div>
//             <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#091c09] tracking-tight leading-[1.08]">
//               AI, built around <br className="hidden sm:inline" />your business.
//             </h2>
//             <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium max-w-[36ch]">
//               We identify where intelligence can create actual business value.
//             </p>
//           </div>

//           {/* 
//             ========================================================================
//             PROMINENT 3D FLOATING ROBOT (Image 1 Composition)
//             Standing tall on the right side behind the cards with dynamic ground shadow
//             ========================================================================
//           */}
//           <div
//             className="sm:absolute sm:right-[2%] md:right-[4%] lg:right-[8%] sm:top-[-10px] md:top-[-20px] lg:top-[-35px] z-10 mx-auto mb-6 sm:mb-0 flex flex-col items-center select-none"
//             aria-label="PropheC AI Autonomous Intelligence Robot"
//           >
//             <div className="relative animate-robot-float flex flex-col items-center">
//               {/* Interactive "Tap to swap" Pill Button */}
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 aria-label="Ask the robot to show the next AI service"
//                 className="absolute top-[38%] left-1 sm:left-2 md:left-4 lg:-left-16 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[rgba(9,28,9,0.14)] text-[10px] sm:text-[11px] font-mono font-bold text-[#091c09] shadow-[0_6px_20px_-8px_rgba(9,28,9,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(9,28,9,0.35)] cursor-pointer"
//               >
//                 <ArrowRight className="w-3 h-3 text-[#091c09]" />
//                 <span>Tap to swap</span>
//               </button>

//               <Image
//                 src="/download.png"
//                 alt="PropheC AI Autonomous Intelligence Robot"
//                 width={500}
//                 height={750}
//                 className="w-48 sm:w-64 md:w-80 lg:w-[410px] xl:w-[450px] h-auto object-contain drop-shadow-[0_26px_24px_rgba(9,28,9,0.13)] select-none"
//                 priority
//               />
//             </div>

//             {/* Dynamic Ground Shadow */}
//             <div
//               aria-hidden="true"
//               className="w-32 sm:w-48 md:w-60 lg:w-72 h-2.5 sm:h-3.5 rounded-full bg-[#091c09]/14 blur-[10px] sm:blur-[14px] animate-robot-shadow -mt-3 sm:-mt-6"
//             />
//           </div>

//           {/* 
//             ========================================================================
//             CAROUSEL STAGE CONTAINER (Layered editorial cards stack)
//             ========================================================================
//           */}
//           <div
//             ref={containerRef}
//             tabIndex={0}
//             onKeyDown={handleKeyDown}
//             onTouchStart={handleTouchStart}
//             onTouchEnd={handleTouchEnd}
//             role="region"
//             aria-label="AI Ecosystem Service Carousel"
//             className="relative w-full h-[470px] sm:h-[510px] md:h-[530px] flex items-center justify-center sm:justify-start sm:pl-8 md:pl-20 lg:pl-32 xl:pl-44 focus:outline-none focus:ring-2 focus:ring-[#091c09]/20 rounded-3xl z-20"
//           >
//             <div className="relative w-full max-w-[320px] sm:max-w-[340px] md:max-w-[360px] h-[440px] sm:h-[470px]">
//               {services.map((item, index) => {
//                 const offset = index - activeIndex;
//                 const isCenter = offset === 0;

//                 // Fanned spatial layout matching Image 1
//                 let translateX = 0;
//                 let rotateDeg = 0;
//                 let scale = 1;
//                 let zIndex = 10;
//                 let opacity = 1;
//                 let isVisible = true;

//                 if (offset === 0) {
//                   translateX = 0;
//                   rotateDeg = 0;
//                   scale = 1;
//                   zIndex = 30;
//                   opacity = 1;
//                 } else if (offset === 1) {
//                   translateX = 135;
//                   rotateDeg = 5;
//                   scale = 0.94;
//                   zIndex = 20;
//                   opacity = 0.68;
//                 } else if (offset === 2) {
//                   translateX = 245;
//                   rotateDeg = 9;
//                   scale = 0.88;
//                   zIndex = 15;
//                   opacity = 0.35;
//                 } else if (offset === 3) {
//                   translateX = 330;
//                   rotateDeg = 11;
//                   scale = 0.82;
//                   zIndex = 10;
//                   opacity = 0;
//                   isVisible = false;
//                 } else if (offset === -1) {
//                   translateX = -280;
//                   rotateDeg = -5;
//                   scale = 0.92;
//                   zIndex = 10;
//                   opacity = 0;
//                   isVisible = false;
//                 } else {
//                   translateX = offset > 0 ? 380 : -380;
//                   rotateDeg = offset > 0 ? 12 : -12;
//                   scale = 0.8;
//                   zIndex = 5;
//                   opacity = 0;
//                   isVisible = false;
//                 }

//                 return (
//                   /* Nested Wrapper 1: Positional Transform */
//                   <div
//                     key={item.id}
//                     className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
//                     style={{
//                       transform: `translateX(${translateX}px)`,
//                       zIndex,
//                       pointerEvents: isVisible && (isCenter || offset === 1) ? "auto" : "none",
//                     }}
//                   >
//                     {/* Nested Wrapper 2: Rotation & Scale Transform */}
//                     <div
//                       onClick={() => {
//                         if (!isCenter) setCurrentIndex(index);
//                       }}
//                       className="w-full h-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer"
//                       style={{
//                         transform: `rotate(${rotateDeg}deg) scale(${scale})`,
//                         opacity,
//                       }}
//                     >
//                       {/* Nested Wrapper 3: Clean White Editorial Card Surface matching Image 1 */}
//                       <article className={`w-full h-full p-4 sm:p-5 md:p-6 flex flex-col justify-between select-none relative overflow-hidden rounded-[28px] bg-white transition-all duration-300 ${isCenter
//                         ? "border border-[rgba(9,28,9,0.14)] shadow-[0_24px_50px_-16px_rgba(9,28,9,0.16)] hover:shadow-[0_30px_60px_-16px_rgba(9,28,9,0.22)]"
//                         : "border border-[rgba(9,28,9,0.10)] shadow-[0_12px_32px_-12px_rgba(9,28,9,0.08)]"
//                         }`}>

//                         {/* Inset Neutral Media Region with authored illustration */}
//                         <div className="w-full aspect-[4/3] rounded-[20px] bg-[rgba(9,28,9,0.03)] border border-[rgba(9,28,9,0.08)] flex flex-col items-center justify-center relative overflow-hidden group/media">
//                           {renderServiceArtwork(item)}

//                           {/* Top Badges */}
//                           <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-none">
//                             <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[rgba(9,28,9,0.12)] text-[10px] sm:text-[11px] font-mono font-bold text-[#091c09] shadow-2xs">
//                               {item.category}
//                             </span>
//                             <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#091c09] text-white text-[10px] sm:text-[11px] font-mono font-bold shadow-xs">
//                               {item.badge}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Content Area: Left-aligned with clear hierarchy */}
//                         <div className="pt-3 sm:pt-4 flex flex-col justify-between flex-grow relative z-10">
//                           <div>
//                             <h3 className="font-urbanist font-extrabold text-lg sm:text-xl md:text-2xl text-[#091c09] tracking-tight leading-snug">
//                               {item.title}
//                             </h3>
//                             <p className="font-urbanist font-medium text-xs sm:text-sm text-[rgba(9,28,9,0.70)] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
//                               {item.description}
//                             </p>
//                           </div>

//                           {/* Action Link Area */}
//                           <div className="pt-3 flex items-center justify-between border-t border-[rgba(9,28,9,0.10)] mt-auto">
//                             <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[rgba(9,28,9,0.60)]">
//                               Enterprise Service
//                             </span>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setIsModalOpen(true);
//                               }}
//                               className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs font-urbanist font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer ${isCenter ? "bg-[#091c09] hover:bg-[#091c09]/90" : "bg-[#4B5E4B] hover:bg-[#091c09]"
//                                 }`}
//                             >
//                               Inquire <ArrowUpRight className="w-3.5 h-3.5 text-white" />
//                             </button>
//                           </div>
//                         </div>

//                       </article>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* 
//             ========================================================================
//             CIRCULAR CONTROLS & ITEM COUNTER (Image 1)
//             ========================================================================
//           */}
//           <div className="mt-6 sm:mt-8 flex items-center justify-center sm:justify-start sm:pl-8 md:pl-20 lg:pl-32 xl:pl-44 gap-3 sm:gap-4 flex-wrap relative z-20">
//             <button
//               onClick={handlePrev}
//               disabled={currentIndex === 0}
//               aria-label="Previous service"
//               className="w-11 h-11 rounded-full bg-white hover:bg-[#F7F8F7] active:bg-[#ECEEEC] border border-[rgba(9,28,9,0.14)] text-[#091c09] flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#091c09]"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             {/* Dots Indicator */}
//             <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[rgba(9,28,9,0.14)] shadow-2xs">
//               {services.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentIndex(i)}
//                   aria-label={`Go to service ${i + 1}`}
//                   className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex
//                     ? "w-6 bg-[#091c09]"
//                     : "w-2 bg-[rgba(9,28,9,0.22)] hover:bg-[rgba(9,28,9,0.45)]"
//                     }`}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={handleNext}
//               disabled={currentIndex === totalSlots - 1}
//               aria-label="Next service"
//               className="w-11 h-11 rounded-full bg-[#091c09] hover:bg-[#091c09]/90 border border-[#091c09] text-white flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#091c09]"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>

//             {/* Counter Badge with Pulse Indicator matching Image 1 */}
//             <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white border border-[rgba(9,28,9,0.14)] text-[11px] font-mono font-bold text-[#091c09] shadow-2xs">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
//               <span>0{activeIndex + 1} / 0{totalSlots}</span>
//             </div>
//           </div>

//         </div>

//       </div>

//       <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </section>
//   );
// };

