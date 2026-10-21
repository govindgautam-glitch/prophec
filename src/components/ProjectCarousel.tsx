"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import { flushSync } from "react-dom";
import { AuditModal } from "./ActionModals";
import { AmbientBackgroundDecor } from "./AmbientBackgroundDecor";

/* Robot artwork lives in /public. The arm is cut out of this image and rotated
   at the shoulder / elbow / wrist, so it must be the 1024 x 1536 robot render. */
const ROBOT_SRC = "/download.png";

/* ==========================================================================
   SERVICES DATA (Image 1 Parity: 01 / 04 structure)
   ========================================================================== */
export interface ServiceItemV2 {
  id: string;
  badge: string;
  num: string;
  title: string;
  description: string;
  category: string;
  icon: "sparkle" | "agent" | "flow" | "analytics" | "systems" | "custom";
}

export const SERVICES_V2: ServiceItemV2[] = [
  {
    id: "service-1",
    badge: "01 / 06",
    num: "01",
    title: "AI Applications",
    description:
      "Custom AI-powered products designed around specific business needs and user experiences.",
    category: "Applications",
    icon: "sparkle",
  },
  {
    id: "service-2",
    badge: "02 / 06",
    num: "02",
    title: "AI Agents",
    description:
      "Intelligent agents that can interact, respond, qualify, assist, and execute tasks.",
    category: "Agents",
    icon: "agent",
  },
  {
    id: "service-3",
    badge: "03 / 06",
    num: "03",
    title: "AI Automation",
    description:
      "AI automation services that automate repetitive workflows and operational processes, reducing manual effort through intelligent process automation.",
    category: "Automation",
    icon: "flow",
  },
  {
    id: "service-4",
    badge: "04 / 06",
    num: "04",
    title: "AI-Powered Analytics",
    description:
      "Turning business data into actionable intelligence that supports better decisions.",
    category: "Analytics",
    icon: "analytics",
  },
  {
    id: "service-5",
    badge: "05 / 06",
    num: "05",
    title: "Intelligent Systems",
    description:
      "Embedding AI into existing products, platforms, and workflows to make them more capable.",
    category: "Systems",
    icon: "systems",
  },
  {
    id: "service-6",
    badge: "06 / 06",
    num: "06",
    title: "Custom AI Solutions",
    description:
      "Purpose-built custom AI systems designed to address unique business challenges.",
    category: "Solutions",
    icon: "custom",
  },
];
/* ==========================================================================
   WATCH VIDEO MODAL
   ========================================================================== */
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit: () => void;
}

const WatchVideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onOpenAudit }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091c09]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#091c09] border border-white/20 p-6 md:p-8 shadow-2xl text-white overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#02D15D]/20 border border-[#02D15D]/40 flex items-center justify-center text-[#02D15D] text-xs font-bold font-mono">
              ▶
            </span>
            <div>
              <h3 id="video-modal-title" className="text-lg md:text-xl font-bold font-urbanist text-white">
                PropheC AI Platform Tour
              </h3>
              <p className="text-xs text-white/60">
                Custom AI Applications • Autonomous Agents • Workflow Automation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video rounded-xl bg-black/60 border border-white/10 overflow-hidden flex flex-col items-center justify-center text-center p-6 group">
          <div className="absolute inset-0 bg-radial from-[#02D15D]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Animated decorative grid / wave */}
          <div className="w-20 h-20 rounded-full bg-[#02D15D]/20 border border-[#02D15D]/50 flex items-center justify-center text-[#02D15D] mb-4 shadow-[0_0_30px_rgba(2,209,93,0.3)] animate-pulse">
            <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <h4 className="text-base md:text-lg font-bold text-white font-urbanist mb-1.5">
            Production-Grade AI Built Around Your Operations
          </h4>
          <p className="text-xs md:text-sm text-white/70 max-w-md mb-5 leading-relaxed">
            See how PropheC designs, deploys, and orchestrates multi-agent systems and custom intelligence layers that generate measurable enterprise ROI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="px-5 py-2.5 rounded-full bg-[#02D15D] text-[#091c09] font-bold text-xs hover:bg-[#52D370] transition-colors shadow-lg cursor-pointer"
            >
              Book 1-on-1 Architecture Walkthrough →
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
/* ==========================================================================
   ROBOT ARM RIG — pose + timeline
   Each key = [ms, shoulder°, elbow°, wrist°]. The robot idles in a "presenting"
   pose (hand raised toward the card), then on every swap it anticipates,
   throws the card with a swipe, follows through and eases back to REST.
   ========================================================================== */
const REST: [number, number, number] = [44, 62, -20];
const FORWARD_KEYS: number[][] = [
  [0, ...REST], [170, 34, 74, -30], [420, 69, 18, 12],
  [640, 64, 24, 4], [980, 46, 40, -10], [1300, ...REST],
];
const BACKWARD_KEYS: number[][] = [
  [0, ...REST], [170, 56, 52, -12], [420, 38, 80, -28],
  [640, 42, 70, -24], [980, 46, 64, -20], [1300, ...REST],
];
const GRIP_MS = 150; // fingers lift the card
const COMMIT_MS = 430; // the throw: cards swap here
const GESTURE_MS = 1300; // total gesture time
const AUTOPLAY_MS = 8000; // idle time before the robot swaps by itself

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
  sync: () => void;
}

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);
const AgentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 8V4M9 13v1M15 13v1" />
  </svg>
);
const FlowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v18h18M18 9l-5 5-4-4-3 3" />
  </svg>
);
const SystemsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const CustomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const ServiceIcon: React.FC<{ icon: ServiceItemV2["icon"] }> = ({ icon }) => {
  switch (icon) {
    case "sparkle":
      return <SparkleIcon />;
    case "agent":
      return <AgentIcon />;
    case "flow":
      return <FlowIcon />;
    case "analytics":
      return <AnalyticsIcon />;
    case "systems":
      return <SystemsIcon />;
    case "custom":
      return <CustomIcon />;
    default:
      return <SparkleIcon />;
  }
};

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

/* ==========================================================================
   PROJECT CAROUSEL COMPONENT
   ========================================================================== */
export const ProjectCarousel: React.FC<{ id?: string }> = ({ id = "services" }) => {
  const uid = `pc-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const stackId = `${uid}-stack`;
  const headingId = `${uid}-heading`;
  const helpId = `${uid}-help`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ghostIndex, setGhostIndex] = useState<number | null>(null); // card that is leaving
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMotionPaused] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const services = SERVICES_V2;
  const totalSlots = services.length;
  const activeIndex = Math.min(currentIndex, totalSlots - 1);
  const activeService = services[activeIndex];

  const sceneRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGSVGElement>(null);
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
  const pausedRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  /* ------------------------------------------------------------------------
     ENGINE — robot arm rig, card hand-off, idle motion, autoplay.
     Imperative on purpose: it runs on requestAnimationFrame + the Web
     Animations API, so only the final card index goes through React state.
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const scene = sceneRef.current;
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
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
    if (!scene || !wrapper || !card || !parallax || !shoulder || !elbow || !wrist || !palm || !field || !thread || !pulse || !contact || !halo) return;

    const total = SERVICES_V2.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer:fine) and (min-width:1024px)");

    let i = 0;
    let tx: GestureJob | null = null;
    let queued: number | null = null;
    let inView = true;
    let hovering = false;
    let raf = 0;
    let pointerFrame = 0;
    let lastInteract = performance.now();
    const t0 = performance.now();

    const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));
    const motionAllowed = () => !pausedRef.current && !reduce.matches && !document.hidden && inView;
    const logicalIndex = () => queued ?? tx?.target ?? i;

    const render = (n: number, sync = false) => {
      i = clamp(n);
      const apply = () => setCurrentIndex(i);
      if (sync) flushSync(apply);
      else apply();
    };

    const pose = (s: number, e: number, w: number) => {
      shoulder.setAttribute("transform", `rotate(${s.toFixed(3)} 357 658)`);
      elbow.setAttribute("transform", `rotate(${e.toFixed(3)} 254 794)`);
      wrist.setAttribute("transform", `rotate(${w.toFixed(3)} 195 918)`);
    };
    const rest = () => pose(REST[0], REST[1], REST[2]);

    const smooth = (t: number) => t * t * (3 - 2 * t);
    const sample = (keys: number[][], ms: number) => {
      let n = 0;
      while (n < keys.length - 2 && ms > keys[n + 1][0]) n++;
      const a = keys[n];
      const b = keys[n + 1];
      const t = smooth(Math.max(0, Math.min(1, (ms - a[0]) / (b[0] - a[0]))));
      pose(a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t);
    };

    // Idle: the hand hovers with a slow breathing motion. On load it waves hello.
    const idlePose = (now: number) => {
      const t = now / 1000;
      const wt = (now - t0) / 1000;
      const hello = wt < 4 ? 15 * Math.exp(-wt / 1.25) * Math.sin(wt * 8.5) : 0;
      pose(
        REST[0] + 1.3 * Math.sin(t * 1.1),
        REST[1] + 2.2 * Math.sin(t * 0.9 + 1),
        REST[2] + 3 * Math.sin(t * 1.6) + hello
      );
    };

    // Thread from the robot's palm to the card being handed over.
    const drawThread = (target: HTMLElement, ms: number) => {
      const m = palm.getScreenCTM();
      if (!m) return;
      const r = scene.getBoundingClientRect();
      const c = target.getBoundingClientRect();
      const p = new DOMPoint(170, 984).matrixTransform(m);
      const x = p.x - r.left;
      const y = p.y - r.top;
      const endX = c.right - r.left - 28;
      const endY = c.top - r.top + 25;
      const alpha = Math.min(1, Math.max(0, (ms - 90) / 120)) * Math.min(1, Math.max(0, (700 - ms) / 200));
      field.style.opacity = String(alpha * 0.9);
      field.setAttribute("viewBox", `0 0 ${scene.clientWidth} ${scene.clientHeight}`);
      const bend = Math.min(85, Math.abs(endX - x) * 0.24 + 25);
      const d = `M ${x} ${y} C ${x + 45} ${y - bend}, ${endX - 36} ${endY - 34}, ${endX} ${endY}`;
      thread.setAttribute("d", d);
      pulse.setAttribute("d", d);
      pulse.style.strokeDashoffset = String(70 - (ms - 90) * 0.5);
      contact.setAttribute("cx", String(x));
      contact.setAttribute("cy", String(y));
      halo.setAttribute("cx", String(x));
      halo.setAttribute("cy", String(y));
      halo.setAttribute("r", String(8 + Math.sin(Math.max(0, ms - 90) / 560 * Math.PI) * 5));
    };

    const animateCards = (job: GestureJob) => {
      if (job.committed) return;
      job.committed = true;
      job.grip?.cancel();
      const old = i;
      const sign = job.direction;
      const focused = document.activeElement;
      if (card.contains(focused)) wrapper.focus({ preventScroll: true });
      // The previous card becomes a ghost on top of the stage while the new one flies in.
      flushSync(() => {
        setGhostIndex(old);
        setCurrentIndex(job.target);
      });
      i = job.target;
      const ghost = ghostRef.current;
      if (ghost) {
        job.animations.push(
          ghost.animate(
            [
              { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
              { transform: `translate(${-sign * 84}px, 10px) rotate(${-sign * 7}deg) scale(.93)`, opacity: 0 },
            ],
            { duration: 600, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" }
          )
        );
      }
      job.animations.push(
        card.animate(
          [
            { transform: `translate(${sign * 70}px, 12px) rotate(${sign * 5}deg) scale(.94)`, opacity: 0, offset: 0 },
            { transform: `translate(${-sign * 2}px, -1px) rotate(${-sign * 0.3}deg) scale(1.006)`, opacity: 1, offset: 0.78 },
            { transform: "none", opacity: 1, offset: 1 },
          ],
          { duration: 760, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }
        )
      );
    };

    const clean = (job: GestureJob | null) => {
      job?.grip?.cancel();
      job?.animations.forEach((a) => a.cancel());
      setGhostIndex(null);
      field.style.opacity = "0";
      rest();
      scene.dataset.gesture = "false";
      scene.dataset.busy = "false";
      wrapper.setAttribute("aria-busy", "false");
      setIsSwapping(false);
    };

    const settle = () => {
      if (!tx) return;
      const target = queued ?? tx.target;
      clean(tx);
      tx = null;
      queued = null;
      render(target);
    };

    function request(n: number, direction?: number, auto = false) {
      if (!scene || !card || !wrapper) return;
      n = clamp(n);
      if (!auto) lastInteract = performance.now();
      if (tx) {
        queued = n;
        return;
      }
      if (n === i) return;
      if (!motionAllowed() || typeof card.animate !== "function") {
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
      wrapper.setAttribute("aria-busy", "true");
      setIsSwapping(true);
      ensureLoop();
    }

    const finish = (job: GestureJob) => {
      if (tx !== job) return;
      if (!job.committed) render(job.target);
      const nextTarget = queued;
      queued = null;
      clean(job);
      tx = null;
      if (nextTarget !== null && nextTarget !== i) request(nextTarget, nextTarget > i ? 1 : -1);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!motionAllowed()) return;
      if (tx) {
        const job = tx;
        const ms = now - job.started;
        sample(job.direction > 0 ? FORWARD_KEYS : BACKWARD_KEYS, ms);
        if (ms >= GRIP_MS && !job.grip && !job.committed) {
          job.grip = card.animate(
            [
              { transform: "translateY(0) rotate(0)" },
              { transform: `translateY(-8px) rotate(${-job.direction * 0.9}deg)` },
            ],
            { duration: 260, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
          );
        }
        if (ms >= COMMIT_MS) animateCards(job);
        drawThread(card, ms);
        if (ms >= GESTURE_MS) finish(job);
      } else {
        idlePose(now);
      }
      raf = requestAnimationFrame(loop);
    };
    const ensureLoop = () => {
      if (!raf && motionAllowed()) raf = requestAnimationFrame(loop);
    };

    const step = (delta: number) => request(logicalIndex() + delta, delta);
    const robotNext = () => request((logicalIndex() + 1) % total, 1);

    const resetPointer = () => {
      ["--pointer-x", "--pointer-y", "--pointer-ry"].forEach((k) => parallax.style.removeProperty(k));
    };

    const sync = () => {
      const allowed = motionAllowed();
      setReducedMotion(reduce.matches);
      scene.dataset.offscreen = String(!inView);
      const orbit = orbitRef.current;
      if (orbit) {
        if (allowed) {
          orbit.unpauseAnimations();
        } else {
          orbit.pauseAnimations();
        }
      }
      if (allowed) ensureLoop();
      else {
        cancelAnimationFrame(pointerFrame);
        cancelAnimationFrame(raf);
        raf = 0;
        settle();
        resetPointer();
        rest();
      }
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
        parallax.style.setProperty("--pointer-x", `${x * 18}px`);
        parallax.style.setProperty("--pointer-y", `${y * 10}px`);
        parallax.style.setProperty("--pointer-ry", `${x * 5}deg`);
      });
    };
    const onEnter = () => { hovering = true; };
    const onLeave = () => {
      hovering = false;
      cancelAnimationFrame(pointerFrame);
      if (!tx) resetPointer();
    };

    // Autoplay: the robot swaps by itself after a quiet moment, never while the
    // visitor is hovering/focused, the section is off-screen or motion is paused.
    const auto = window.setInterval(() => {
      if (!motionAllowed() || hovering || tx) return;
      if (performance.now() - lastInteract < AUTOPLAY_MS) return;
      lastInteract = performance.now();
      request((i + 1) % total, 1, true);
    }, 1000);

    window.addEventListener("resize", onResize, { passive: true });
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    fine.addEventListener("change", resetPointer);
    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerenter", onEnter);
    scene.addEventListener("pointerleave", onLeave);
    scene.addEventListener("focusin", onEnter);
    scene.addEventListener("focusout", onLeave);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.03 });
      io.observe(scene);
    }

    scene.dataset.busy = "false";
    scene.dataset.gesture = "false";
    rest();
    sync();
    engineRef.current = { request, step, robotNext, sync };

    return () => {
      window.clearInterval(auto);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pointerFrame);
      tx?.grip?.cancel();
      tx?.animations.forEach((a) => a.cancel());
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      fine.removeEventListener("change", resetPointer);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerenter", onEnter);
      scene.removeEventListener("pointerleave", onLeave);
      scene.removeEventListener("focusin", onEnter);
      scene.removeEventListener("focusout", onLeave);
      io?.disconnect();
      engineRef.current = null;
    };
  }, []);

  // Manual pause (the "Motion" pill) — React owns the state, the engine reads the ref.
  useEffect(() => {
    pausedRef.current = isMotionPaused;
    engineRef.current?.sync();
  }, [isMotionPaused]);

  /* ---------------------------- UI handlers ---------------------------- */
  const goTo = useCallback((index: number) => engineRef.current?.request(index), []);
  const handlePrev = useCallback(() => engineRef.current?.step(-1), []);
  const handleNext = useCallback(() => engineRef.current?.robotNext(), []);
  const handleRobotClick = useCallback(() => engineRef.current?.robotNext(), []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      engineRef.current?.step(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(totalSlots - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touchRef.current = null;
      return;
    }
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx > 0) handlePrev();
      else engineRef.current?.step(1);
    }
  };

  const paused = isMotionPaused || reducedMotion;
  const nextTitle = services[(activeIndex + 1) % totalSlots].title;

  const renderCard = (service: ServiceItemV2, index: number, ghost: boolean) => (
    <article
      key={ghost ? "ghost" : "active"}
      ref={ghost ? ghostRef : cardRef}
      className={`pc-card${ghost ? " pc-card-ghost" : ""}`}
      data-pos={ghost ? "-1" : "0"}
      data-service-id={service.id}
      role="group"
      aria-hidden={ghost ? true : undefined}
      aria-label={`${service.title}, service ${index + 1} of ${totalSlots}`}
    >
      <div className="pc-card-top">
        <div className="pc-tile"><ServiceIcon icon={service.icon} /></div>
        <span className="pc-num">{service.badge}</span>
      </div>
      <h3>{service.title}</h3>
      <p className="pc-card-desc">{service.description}</p>
      <div className="pc-foot">
        <span className="pc-sr-only">Enterprise Service</span>
        <button
          type="button"
          className="pc-inq"
          tabIndex={ghost ? -1 : 0}
          aria-label={`Inquire about ${service.title}`}
          onClick={() => setIsModalOpen(true)}
        >
          <span>Inquire</span>
          <ArrowIcon />
        </button>
      </div>
    </article>
  );

  return (
    <>
      <section
        ref={sceneRef}
        id={id}
        className="pc-scene"
        data-pc="project-services"
        data-motion-paused={paused ? "true" : "false"}
        aria-labelledby={headingId}
      >
        {/* Ambient background decoration matching the site's visual tone */}
        <div className="pc-atmosphere" aria-hidden="true">
          <AmbientBackgroundDecor variant="subtle" />
          <div className="pc-grid" />
          <div className="pc-glow" />
          <div className="pc-glow-2" />
        </div>

        {/* Hand -> card thread, drawn while the robot swaps */}
        <svg ref={fieldRef} className="pc-gesture-field" aria-hidden="true" focusable="false">
          <path ref={threadRef} className="pc-gesture-thread" />
          <path ref={pulseRef} className="pc-gesture-pulse" />
          <circle ref={haloRef} className="pc-gesture-halo" r="10" />
          <circle ref={contactRef} className="pc-gesture-contact" r="3" />
        </svg>

        <div className="pc-wrap">
          {/* ---------------------------- HEADLINE ---------------------------- */}
          <div className="pc-head">
            <span className="pc-eyebrow-pill pc-in" style={{ "--d": 60 } as React.CSSProperties}>OUR AI ECOSYSTEM</span>
            <h2 id={headingId} className="pc-in" style={{ "--d": 140 } as React.CSSProperties}>
              <span className="pc-ai">AI,</span> built around <br />
              your business.
            </h2>
          </div>

          {/* ------------------------ COPY + CTAs ------------------------ */}
          <div className="pc-copy">
            <p className="pc-sub pc-in" style={{ "--d": 240 } as React.CSSProperties}>
              We identify where intelligence can create actual business value; then build it into the products, processes, and systems that matter.
            </p>
            {/* <div className="pc-ctas pc-in" style={{ "--d": 340 } as React.CSSProperties}>
              <a
                href="#services"
                className="pc-cta-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
              >
                <span>Explore Our Services</span>
                <ArrowIcon />
              </a>
              <button type="button" className="pc-cta-video" onClick={() => setIsVideoModalOpen(true)}>
                <span className="pc-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </span>
                <span>Watch Video</span>
              </button>
            </div> */}
          </div>

          {/* ------------------- GLASS SERVICE CARD + CONTROLS ------------------- */}
          <div className="pc-cardzone pc-in" style={{ "--d": 440 } as React.CSSProperties}>
            <div
              ref={wrapperRef}
              id={stackId}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => { touchRef.current = null; }}
              className="pc-card-wrapper"
              role="region"
              aria-roledescription="carousel"
              aria-label="AI Ecosystem Service Carousel"
            >
              {renderCard(activeService, activeIndex, false)}
              {ghostIndex !== null && renderCard(services[ghostIndex], ghostIndex, true)}

              {/* Floating circular next arrow on the card's right edge */}
              <button type="button" className="pc-card-next" onClick={handleNext} aria-label="Slide to next">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </button>
            </div>

            {/* < • • • • >   + ● Motion */}
            <div className="pc-controls">
              <div className="pc-pager">
                <button type="button" className="pc-nav" onClick={handlePrev} disabled={activeIndex === 0} aria-label="Previous service" aria-controls={stackId}>
                  ‹
                </button>
                <div className="pc-dots" role="group" aria-label="Choose a service">
                  {services.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => goTo(index)}
                      aria-label={`Go to ${item.title}`}
                      aria-current={index === activeIndex}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="pc-nav"
                  onClick={() => engineRef.current?.step(1)}
                  disabled={activeIndex === totalSlots - 1}
                  aria-label="Next service"
                  aria-controls={stackId}
                >
                  ›
                </button>
              </div>

              {/* <button
                type="button"
                className="pc-motion"
                onClick={() => setIsMotionPaused((prev) => !prev)}
                aria-pressed={!paused}
                disabled={reducedMotion}
              >
                <span className="pc-motion-dot" aria-hidden="true" />
                <span>{paused ? "Resume motion" : "Motion"}</span>
              </button> */}

              {/* Hidden counter for automated testing and screen readers */}
              <div className="pc-count pc-sr-only">
                <span>{String(activeIndex + 1).padStart(2, "0")} / {String(totalSlots).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          {/* ------------------------- ROBOT + ORBITS ------------------------- */}
          <div className="pc-robot-zone">
            <div className="pc-robot-stage" onClick={handleRobotClick}>
              {/* Orbital rings + satellites (nodes travel along the rings) */}
              <svg ref={orbitRef} className="pc-orbital-system" viewBox="0 0 670 840" fill="none" aria-hidden="true">
                <g transform="rotate(-18 335 400)">
                  <path id="pc-ring-a" d="M 35 400 a 300 150 0 1 0 600 0 a 300 150 0 1 0 -600 0" stroke="#52D370" strokeWidth="1.2" strokeOpacity=".55" />
                  <g>
                    <circle r="4.5" fill="#52D370" />
                    <circle r="11" fill="#52D370" opacity=".22" />
                    <animateMotion dur="26s" repeatCount="indefinite"><mpath href="#pc-ring-a" /></animateMotion>
                  </g>
                </g>
                <g transform="rotate(22 335 400)">
                  <path id="pc-ring-b" d="M 80 400 a 255 118 0 1 0 510 0 a 255 118 0 1 0 -510 0" stroke="#52D370" strokeWidth="1.2" strokeOpacity=".38" />
                  <g>
                    <circle r="4" fill="#52D370" />
                    <circle r="10" fill="#52D370" opacity=".22" />
                    <animateMotion dur="19s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href="#pc-ring-b" /></animateMotion>
                  </g>
                </g>
                <g>
                  <circle cx="598" cy="276" r="3.5" fill="#52D370" opacity=".85" />
                  <circle cx="598" cy="276" r="9" fill="#52D370" opacity=".2">
                    <animate attributeName="r" values="7;12;7" dur="3.4s" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>

              <div className="pc-robot-path">
                <div className="pc-robot-parallax" ref={parallaxRef}>
                  <div className="pc-robot-float">
                    <div className="pc-robot-figure pc-robot-enter">
                      <svg className="pc-robot-rig" viewBox="0 0 1024 1536" role="img" aria-label="PropheC AI Assistant Robot" focusable="false">
                        <defs>
                          <image id="pc-robot-pixels" href={ROBOT_SRC} width="1024" height="1536" />
                          {/* Only the existing arm pixels are articulated. */}
                          <path id="pc-arm-outline" d="M 195 575 L 365 585 L 382 613 L 365 676 L 350 730 L 337 774 L 322 805 L 323 869 L 283 932 L 256 962 L 258 1097 L 86 1097 L 79 965 L 134 885 L 141 804 Z" />
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

                        <use href="#pc-robot-pixels" mask="url(#pc-body-without-arm)" />

                        {/* shoulder -> elbow -> wrist */}
                        <g ref={shoulderRef} transform={`rotate(${REST[0]} 357 658)`}>
                          <ellipse cx="357" cy="658" rx="17" ry="36" transform="rotate(22 357 658)" fill="url(#pc-joint-metal)" />
                          <g clipPath="url(#pc-arm-silhouette)"><use href="#pc-robot-pixels" clipPath="url(#pc-upper-arm-cut)" /></g>
                          <g ref={elbowRef} transform={`rotate(${REST[1]} 254 794)`}>
                            <ellipse cx="254" cy="794" rx="40" ry="19" transform="rotate(23 254 794)" fill="url(#pc-joint-metal)" />
                            <g clipPath="url(#pc-arm-silhouette)"><use href="#pc-robot-pixels" clipPath="url(#pc-forearm-cut)" /></g>
                            <g ref={wristRef} transform={`rotate(${REST[2]} 195 918)`}>
                              <ellipse cx="195" cy="918" rx="28" ry="18" transform="rotate(27 195 918)" fill="url(#pc-joint-metal)" />
                              <g clipPath="url(#pc-arm-silhouette)"><use href="#pc-robot-pixels" clipPath="url(#pc-hand-cut)" /></g>
                              <circle ref={palmRef} cx="170" cy="984" r="1" opacity="0" />
                            </g>
                          </g>
                        </g>
                      </svg>

                      {/* Whole robot is the click target */}
                      <button
                        type="button"
                        className="pc-robot-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRobotClick();
                        }}
                        aria-label={`Ask the robot to show ${nextTitle}`}
                        aria-controls={stackId}
                        aria-describedby={helpId}
                      >
                        <span className="pc-robot-cue">
                          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                          <span>{isSwapping ? "Swapping…" : "Tap to swap"}</span>
                        </span>
                      </button>
                      <span className="pc-robot-shadow" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------- BOTTOM METADATA ROW ------------------- */}
        {/* <div className="pc-meta">
          <span><i aria-hidden="true" />Trusted by forward-thinking businesses</span>
          <span>{activeService.badge}<i aria-hidden="true" /></span>
        </div> */}

        {/* All services, for screen readers (the visible card shows one at a time) */}
        <ol className="pc-sr-only" aria-label="All services">
          {services.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ol>

        {/* Screen reader announcements */}
        <span className="pc-sr-only" id={helpId}>
          Click or tap the robot to see its hand swipe to the next card. You can also use the arrow buttons, keyboard or dots.
        </span>
        <span className="pc-sr-only" role="status" aria-live="polite" aria-atomic="true">
          {activeService.title}, service {activeIndex + 1} of {totalSlots}
        </span>
      </section>

      {/* Modals */}
      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <WatchVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onOpenAudit={() => setIsModalOpen(true)}
      />
    </>
  );
};