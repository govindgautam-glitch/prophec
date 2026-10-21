"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";
import { RotateCcw, Shuffle } from "lucide-react";
import { AmbientBackgroundDecor } from "./AmbientBackgroundDecor";

/* ==========================================================================
   PROPHEC ROBOT PLAYGROUND
   --------------------------------------------------------------------------
   Six little robot icons live inside a Matter.js world. Each one is drawn
   with Canvas paths (no images, no watermarks) and has a small personality:

   • eyes follow the pointer (or glance around on their own) and blink
   • squash & stretch on every impact, stretch while flying
   • antennas lag behind the body like real springs
   • faces react: wide-eyed when grabbed, happy when tapped, squinting on hard hits
   • soft floor shadows that fade as a robot goes up
   • drag with a spring (they swing from the grab point), throw, tap-to-bounce
   • keyboard: Enter = next robot, arrows = nudge, Space = shuffle, R = reset
   ========================================================================== */

const INK = "#091c09";
const PAPER = "#ffffff";
const YELLOW = "#FDC836";

type Mood = "idle" | "wide" | "happy" | "squint";

interface Face {
  lx: number; // -1..1 look direction (local space)
  ly: number;
  blink: number; // 0 open .. 1 closed
  mood: Mood;
  ant: number; // antenna spring angle (radians)
  t: number; // seconds, for ambient motion
}

interface BotDef {
  label: string;
  kind: "rect" | "circle";
  w: number; // physics width (diameter for circles)
  h: number;
  r: number; // chamfer radius
  x: number; // start x as a fraction of the stage width
  draw: (ctx: CanvasRenderingContext2D, f: Face) => void;
}

interface Bot {
  def: BotDef;
  body: Matter.Body;
  lx: number; ly: number; // current look
  tx: number; ty: number; // wander target
  nextWander: number;
  blinkP: number; // blink progress 0..1, -1 = not blinking
  nextBlink: number;
  mood: Mood;
  moodUntil: number;
  sq: number; sqVel: number; sqAxis: number; // impact squash spring
  ant: number; antVel: number; // antenna spring
  hover: number;
  prevVx: number; prevVy: number;
  phase: number;
}

/* ------------------------------ drawing kit ------------------------------ */

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const k = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}

function dotEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, f: Face, color: string, move: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  if (f.mood === "happy") {
    ctx.lineWidth = r * 0.55;
    ctx.beginPath();
    ctx.arc(x, y + r * 0.55, r * 0.95, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();
  } else if (f.mood === "squint") {
    ctx.lineWidth = r * 0.5;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.9, y);
    ctx.lineTo(x + r * 0.9, y);
    ctx.stroke();
  } else {
    const k = f.mood === "wide" ? 1.25 : 1;
    ctx.beginPath();
    ctx.ellipse(x + f.lx * move, y + f.ly * move, r * k, Math.max(0.6, r * k * (1 - f.blink * 0.92)), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function ringEye(ctx: CanvasRenderingContext2D, x: number, y: number, R: number, f: Face) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineCap = "round";
  if (f.mood === "happy" || f.mood === "squint") {
    ctx.restore();
    dotEye(ctx, x, y, R * 0.7, f, INK, 0);
    return;
  }
  const k = f.mood === "wide" ? 1.12 : 1;
  ctx.scale(k, k * (1 - f.blink * 0.88));
  ctx.lineWidth = R * 0.46;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(f.lx * R * 0.32, f.ly * R * 0.32, R * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function smile(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, f: Face, color: string, lw: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  if (f.mood === "wide") {
    ctx.beginPath();
    ctx.ellipse(x, y + w * 0.12, w * 0.13, w * 0.19, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const depth = f.mood === "happy" ? 0.66 : f.mood === "squint" ? 0.04 : 0.38;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.quadraticCurveTo(x, y + w * depth, x + w / 2, y);
    ctx.stroke();
  }
  ctx.restore();
}

function antenna(
  ctx: CanvasRenderingContext2D,
  bx: number, by: number, len: number, angle: number, ballR: number,
  lw: number, opts: { ballFill?: string; ballStroke?: boolean } = {}
) {
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(angle);
  ctx.strokeStyle = INK;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -len);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -len, ballR, 0, Math.PI * 2);
  ctx.fillStyle = opts.ballFill ?? INK;
  ctx.fill();
  if (opts.ballStroke) {
    ctx.lineWidth = lw;
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------------------------- bots ---------------------------------- */

const BOTS: BotDef[] = [
  {
    // 1 — solid speech-bubble bot with a white visor
    label: "Bubble bot",
    kind: "rect", w: 168, h: 150, r: 52, x: 0.12,
    draw(ctx, f) {
      ctx.fillStyle = YELLOW;
      ctx.beginPath(); ctx.arc(-88, -14, 21, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(88, -14, 21, 0, Math.PI * 2); ctx.fill();
      rr(ctx, -84, -75, 168, 128, 54); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-72, 38); ctx.lineTo(-74, 75); ctx.lineTo(-18, 48); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PAPER;
      rr(ctx, -60, -48, 120, 66, 33); ctx.fill();
      dotEye(ctx, -27, -15, 11, f, INK, 7);
      dotEye(ctx, 27, -15, 11, f, INK, 7);
    },
  },
  {
    // 2 — outlined ring bot with twin antennas
    label: "Ring bot",
    kind: "rect", w: 170, h: 118, r: 50, x: 0.27,
    draw(ctx, f) {
      antenna(ctx, -44, -52, 38, -0.45 + f.ant, 9, 7);
      antenna(ctx, 44, -52, 38, 0.45 + f.ant, 9, 7);
      ctx.fillStyle = INK;
      rr(ctx, -96, -22, 24, 46, 11); ctx.fill();
      rr(ctx, 72, -22, 24, 46, 11); ctx.fill();
      ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 11;
      rr(ctx, -79.5, -53.5, 159, 107, 50); ctx.fill(); ctx.stroke();
      ringEye(ctx, -38, -2, 22, f);
      ringEye(ctx, 38, -2, 22, f);
    },
  },
  {
    // 3 — chat bubble bot with a smile
    label: "Chat bot",
    kind: "rect", w: 150, h: 132, r: 30, x: 0.42,
    draw(ctx, f) {
      antenna(ctx, 0, -56, 24, f.ant, 8, 8);
      ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(-70, -12, 17, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(70, -12, 17, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
      ctx.fillStyle = INK; ctx.lineWidth = 10; ctx.lineJoin = "round";
      rr(ctx, -70, -56, 140, 98, 30); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.moveTo(-52, 36); ctx.lineTo(-66, 65); ctx.lineTo(-14, 42); ctx.lineTo(-14, 36); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-52, 40); ctx.lineTo(-66, 65); ctx.lineTo(-14, 41); ctx.stroke();
      dotEye(ctx, -27, -22, 9.5, f, PAPER, 5);
      dotEye(ctx, 27, -22, 9.5, f, PAPER, 5);
      smile(ctx, 0, -2, 46, f, PAPER, 8);
    },
  },
  {
    // 4 — headset bot (black), rolls like a ball
    label: "Headset bot",
    kind: "circle", w: 168, h: 168, r: 0, x: 0.58,
    draw(ctx, f) {
      ctx.save();
      ctx.translate(0, 2);
      antenna(ctx, 0, -38, 40, f.ant, 8, 7);
      ctx.fillStyle = INK; ctx.strokeStyle = INK;
      ctx.beginPath(); ctx.arc(-66, 6, 25, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(66, 6, 25, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = YELLOW;
      ctx.beginPath(); ctx.ellipse(0, 6, 58, 46, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.lineWidth = 7; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(0, 6, 76, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(66, 30); ctx.quadraticCurveTo(62, 72, 16, 70); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(6, 70, 15, 9, 0, 0, Math.PI * 2); ctx.fill();
      dotEye(ctx, -24, -4, 8.5, f, INK, 5);
      dotEye(ctx, 24, -4, 8.5, f, INK, 5);
      smile(ctx, 0, 14, 36, f, INK, 7);
      ctx.restore();
    },
  },

  {
    // 6 — friendly bot with brand-green details
    label: "Friendly bot",
    kind: "rect", w: 160, h: 124, r: 54, x: 0.9,
    draw(ctx, f) {
      antenna(ctx, 0, -58, 24, f.ant, 11, 6, { ballFill: YELLOW, ballStroke: true });
      ctx.fillStyle = YELLOW; ctx.strokeStyle = INK; ctx.lineWidth = 6;
      rr(ctx, -91, -22, 24, 46, 10); ctx.fill(); ctx.stroke();
      rr(ctx, 67, -22, 24, 46, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = PAPER; ctx.lineWidth = 8;
      rr(ctx, -76, -58, 152, 116, 54); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      rr(ctx, -54, -30, 108, 62, 31); ctx.fill();
      dotEye(ctx, -27, -8, 11, f, YELLOW, 6);
      dotEye(ctx, 27, -8, 11, f, YELLOW, 6);
      smile(ctx, 0, 12, 20, f, YELLOW, 5);
      ctx.strokeStyle = YELLOW; ctx.lineWidth = 7; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(28, -46); ctx.quadraticCurveTo(52, -42, 60, -22); ctx.stroke();
    },
  },
];

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export const InteractiveShapeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const apiRef = useRef<{ shuffle: () => void; reset: () => void } | null>(null);

  const resetShapes = useCallback(() => apiRef.current?.reset(), []);
  const shuffleShapes = useCallback(() => apiRef.current?.shuffle(), []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { Engine, Bodies, Body, Composite, Constraint, Query, Events } = Matter;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canMove = () => !reduceMq.matches;

    const engine = Engine.create({ gravity: { x: 0, y: 0.8 } });
    const world = engine.world;
    const opts = { restitution: 0.5, friction: 0.2, frictionAir: 0.008, density: 0.002 };

    let width = 0;
    let height = 0;
    let floorY = 0;
    let S = 1;
    let dpr = 1;
    let bots: Bot[] = [];
    let selected = 0;
    let focused = false;
    let inView = true;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let pointer: { x: number; y: number } | null = null;
    let hoveredIdx = -1;
    let drag: { bot: Bot; c: Matter.Constraint; start: { x: number; y: number }; t: number; moved: boolean } | null = null;
    let touchId: number | null = null;

    const say = (m: string) => { if (statusRef.current) statusRef.current.textContent = m; };

    /* ---------------------------- world building ---------------------------- */
    const build = () => {
      Composite.clear(world, false);
      drag = null;
      S = clamp(width / 620, 0.8, 2.0);
      floorY = height - 34;
      engine.gravity.y = canMove() ? 0.8 : 0;
      const now = performance.now();
      const mobile = width < 600;

      bots = BOTS.map((def, k) => {
        // Drop in from above, staggered. Reduced motion: start already at rest.
        const cols = mobile ? 3 : 6;
        const fx = mobile ? 0.2 + (k % cols) * 0.3 : def.x;
        const hh = def.kind === "circle" ? def.w : def.h;
        const x = width * fx;
        const y = canMove()
          ? -70 - k * 72 * S - (mobile && k >= 3 ? 150 : 0)
          : floorY - (hh * S) / 2 - (mobile && k >= 3 ? 0 : 0);
        const body = def.kind === "circle"
          ? Bodies.circle(x, y, (def.w / 2) * S, opts)
          : Bodies.rectangle(x, y, def.w * S, def.h * S, { ...opts, chamfer: { radius: def.r * S } });
        Body.setAngle(body, canMove() ? (Math.random() - 0.5) * 0.5 : 0);
        return {
          def, body,
          lx: 0, ly: 0, tx: 0, ty: 0, nextWander: now + 800 + Math.random() * 1500,
          blinkP: -1, nextBlink: now + 1200 + Math.random() * 3000,
          mood: "idle" as Mood, moodUntil: 0,
          sq: 0, sqVel: 0, sqAxis: Math.PI / 2,
          ant: 0, antVel: 0, hover: 0,
          prevVx: 0, prevVy: 0, phase: Math.random() * 6.28,
        };
      });

      const wall = { isStatic: true, friction: 0.1, restitution: 0.2 };
      const inset = 16 * S; // keeps ears and antennas inside the card
      const walls = [
        Bodies.rectangle(width / 2, floorY + 40, width + 400, 80, wall),
        Bodies.rectangle(-40 + inset, height / 2 - 400, 80, height * 3 + 800, wall),
        Bodies.rectangle(width + 40 - inset, height / 2 - 400, 80, height * 3 + 800, wall),
        Bodies.rectangle(width / 2, -900, width + 400, 80, wall),
      ];
      Composite.add(world, [...bots.map((b) => b.body), ...walls]);
      selected = 0;
      schedule();
    };

    const fit = () => {
      const r = container.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (w === width && h === height) return;
      width = w;
      height = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      build();
    };

    /* --------------------------- collisions → squash --------------------------- */
    Events.on(engine, "collisionStart", (e: Matter.IEventCollision<Matter.Engine>) => {
      for (const pair of e.pairs) {
        const n = pair.collision.normal;
        const rel = Math.abs((pair.bodyA.velocity.x - pair.bodyB.velocity.x) * n.x + (pair.bodyA.velocity.y - pair.bodyB.velocity.y) * n.y);
        if (rel < 2.5) continue;
        const kick = Math.min(0.3, rel * 0.022);
        for (const b of bots) {
          if (b.body === pair.bodyA || b.body === pair.bodyB) {
            b.sqAxis = Math.atan2(n.y, n.x);
            b.sqVel += kick * 17;
            if (kick > 0.2) { b.mood = "squint"; b.moodUntil = performance.now() + 380; }
          }
        }
      }
    });

    /* -------------------------------- animation -------------------------------- */
    const animate = (dt: number, now: number) => {
      for (const b of bots) {
        const { body } = b;
        const vx = body.velocity.x;
        const vy = body.velocity.y;
        const speed = Math.hypot(vx, vy);

        // mood
        if (b.moodUntil !== Infinity && b.moodUntil && now > b.moodUntil) { b.mood = "idle"; b.moodUntil = 0; }
        if (!drag || drag.bot !== b) { if (b.mood === "idle" && speed > 14) { b.mood = "wide"; b.moodUntil = now + 260; } }

        // blink
        if (b.blinkP < 0 && now > b.nextBlink && canMove()) b.blinkP = 0;
        if (b.blinkP >= 0) {
          b.blinkP += dt / 0.17;
          if (b.blinkP >= 1) {
            b.blinkP = -1;
            b.nextBlink = now + (Math.random() < 0.2 ? 160 : 1800 + Math.random() * 3600);
          }
        }

        // look: pointer when it is near, otherwise a slow wander
        const ca = Math.cos(-body.angle);
        const sa = Math.sin(-body.angle);
        let gx = b.tx;
        let gy = b.ty;
        if (pointer && !(touchId !== null)) {
          const dx = pointer.x - body.position.x;
          const dy = pointer.y - body.position.y;
          const lx = dx * ca - dy * sa;
          const ly = dx * sa + dy * ca;
          gx = clamp(lx / 220, -1, 1);
          gy = clamp(ly / 220, -1, 1);
        } else if (now > b.nextWander) {
          b.tx = (Math.random() - 0.5) * 1.5;
          b.ty = (Math.random() - 0.3) * 0.9;
          b.nextWander = now + 1400 + Math.random() * 2600;
        }
        const follow = 1 - Math.exp(-dt * 11);
        b.lx += (gx - b.lx) * follow;
        b.ly += (gy - b.ly) * follow;

        // impact squash spring
        b.sqVel += (-230 * b.sq - 15 * b.sqVel) * dt;
        b.sq += b.sqVel * dt;
        b.sq = clamp(b.sq, -0.3, 0.34);

        // antenna lag: driven by acceleration in the body's own frame
        const ax = clamp((vx - b.prevVx) / Math.max(dt * 60, 0.5), -6, 6);
        const ay = clamp((vy - b.prevVy) / Math.max(dt * 60, 0.5), -6, 6);
        const localAx = ax * ca - ay * sa;
        b.prevVx = vx;
        b.prevVy = vy;
        b.antVel += (-localAx * 5.5 - body.angularVelocity * 9 - 150 * b.ant - 6 * b.antVel) * dt;
        b.ant = clamp(b.ant + b.antVel * dt, -0.85, 0.85);

        // hover lift
        const target = hoveredIdx >= 0 && bots[hoveredIdx] === b && !drag ? 1 : 0;
        b.hover += (target - b.hover) * (1 - Math.exp(-dt * 14));
      }
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // floor hairline
      ctx.strokeStyle = "rgba(9,28,9,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(24, floorY + 10.5);
      ctx.lineTo(width - 24, floorY + 10.5);
      ctx.stroke();

      // shadows first
      for (const b of bots) {
        const { body } = b;
        const h = Math.max(0, floorY - body.bounds.max.y);
        const fall = Math.max(0, 1 - h / 280);
        const w = (body.bounds.max.x - body.bounds.min.x) * (0.42 - 0.2 * (1 - fall));
        ctx.fillStyle = `rgba(9,28,9,${0.1 * fall})`;
        ctx.beginPath();
        ctx.ellipse(body.position.x, floorY + 6, w, 7 * S * (0.6 + 0.4 * fall), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(9,28,9,${0.08 * fall})`;
        ctx.beginPath();
        ctx.ellipse(body.position.x, floorY + 6, w * 0.65, 4 * S * (0.6 + 0.4 * fall), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const order = [...bots].sort((a, b) => Number(drag?.bot === a) - Number(drag?.bot === b));
      const t = now / 1000;
      for (const b of order) {
        const { body } = b;
        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        // impact squash (along the collision normal)
        const axis = b.sqAxis - body.angle;
        ctx.rotate(axis);
        ctx.scale(1 - b.sq, 1 + b.sq * 0.6);
        ctx.rotate(-axis);

        // stretch along travel direction when moving fast
        const st = Math.min(0.1, Math.max(0, speed - 5) * 0.008);
        if (st > 0.002) {
          const va = Math.atan2(body.velocity.y, body.velocity.x) - body.angle;
          ctx.rotate(va);
          ctx.scale(1 + st, 1 - st * 0.6);
          ctx.rotate(-va);
        }

        // breathing while resting + hover lift
        const resting = speed < 0.25 && canMove();
        const breathe = resting ? 1 + 0.012 * Math.sin(t * 2.2 + b.phase) : 1;
        const lift = 1 + 0.05 * b.hover;
        ctx.scale(S * lift, S * lift * breathe);

        const face: Face = { lx: b.lx, ly: b.ly, blink: b.blinkP < 0 ? 0 : Math.sin(b.blinkP * Math.PI), mood: b.mood, ant: b.ant, t };
        b.def.draw(ctx, face);
        ctx.restore();
      }

      // keyboard focus ring
      if (focused && bots[selected]) {
        const { body, def } = bots[selected];
        const rad = Math.max(def.w, def.h) * S * 0.5 + 12;
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    // Self-righting (like a weeble): when a robot is resting on the floor it
    // gently turns its face back up, so a tumble never leaves it upside down.
    const rightBots = () => {
      for (const b of bots) {
        if (drag?.bot === b) continue;
        const { body } = b;
        const onFloor = body.bounds.max.y > floorY - 4;
        const slow = Math.hypot(body.velocity.x, body.velocity.y) < (b.def.kind === "circle" ? 1.6 : 2.5);
        if (!onFloor || !slow) continue;
        const a = ((((body.angle + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
        const gain = b.def.kind === "circle" ? 0.003 : 0.008;
        Body.setAngularVelocity(body, body.angularVelocity * 0.96 - a * gain);
      }
    };

    const frame = (time: number) => {
      raf = 0;
      if (!inView || document.hidden) return;
      const dtMs = Math.min(50, last ? time - last : 16.667);
      last = time;
      if (canMove()) {
        acc += dtMs;
        while (acc >= 1000 / 60) {
          rightBots();
          Engine.update(engine, 1000 / 60);
          acc -= 1000 / 60;
        }
      }
      animate(dtMs / 1000, time);
      draw(time);
      // keep running while animating; reduced motion only redraws on demand
      if (canMove()) raf = requestAnimationFrame(frame);
    };
    function schedule() {
      last = 0;
      if (!raf && inView && !document.hidden) raf = requestAnimationFrame(frame);
    }

    /* ---------------------------------- input ---------------------------------- */
    const hit = (p: { x: number; y: number }) => {
      const hits = Query.point(bots.map((b) => b.body), p);
      if (!hits.length) return -1;
      let best = -1;
      let bd = Infinity;
      for (const h of hits) {
        const i = bots.findIndex((b) => b.body === h);
        const d = Math.hypot(h.position.x - p.x, h.position.y - p.y);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    };

    const toLocal = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const grab = (p: { x: number; y: number }) => {
      const i = hit(p);
      if (i < 0) return false;
      const bot = bots[i];
      const body = bot.body;
      const c = Constraint.create({
        pointA: { x: p.x, y: p.y },
        bodyB: body,
        pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
        stiffness: 0.2,
        damping: 0.12,
        length: 0,
      });
      Composite.add(world, c);
      drag = { bot, c, start: p, t: performance.now(), moved: false };
      bot.mood = "wide";
      bot.moodUntil = Infinity;
      selected = i;
      canvas.style.cursor = "grabbing";
      say(`${BOTS[i].label} picked up.`);
      schedule();
      return true;
    };

    const moveDrag = (p: { x: number; y: number }) => {
      if (!drag) return;
      if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) > 8) drag.moved = true;
      drag.c.pointA = { x: clamp(p.x, 4, width - 4), y: clamp(p.y, -40, floorY) };
      if (!canMove()) draw(performance.now());
    };

    const release = () => {
      if (!drag) return;
      const { bot, c, moved, t } = drag;
      Composite.remove(world, c);
      const v = bot.body.velocity;
      const sp = Math.hypot(v.x, v.y);
      if (sp > 26) Body.setVelocity(bot.body, { x: (v.x / sp) * 26, y: (v.y / sp) * 26 });
      const now = performance.now();
      if (!moved && now - t < 350) {
        // tap: a friendly hop
        if (canMove()) {
          Body.setVelocity(bot.body, { x: (Math.random() - 0.5) * 6 * S, y: -(9 + Math.random() * 3) * S });
          Body.setAngularVelocity(bot.body, (Math.random() - 0.5) * 0.12);
        }
        bot.mood = "happy";
        bot.moodUntil = now + 1000;
        say(`${BOTS[bots.indexOf(bot)].label} hops.`);
      } else {
        bot.mood = "idle";
        bot.moodUntil = now + 450;
      }
      drag = null;
      canvas.style.cursor = hoveredIdx >= 0 ? "grab" : "default";
      schedule();
      if (!canMove()) draw(now);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = toLocal(e.clientX, e.clientY);
      if (!grab(p)) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      canvas.focus({ preventScroll: true });
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = toLocal(e.clientX, e.clientY);
      pointer = p;
      if (drag) { moveDrag(p); return; }
      hoveredIdx = hit(p);
      canvas.style.cursor = hoveredIdx >= 0 ? "grab" : "default";
      if (!canMove()) draw(performance.now());
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      release();
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    const onPointerLeave = () => { pointer = null; if (!drag) { hoveredIdx = -1; canvas.style.cursor = "default"; } };

    // Touch: only block page scrolling when a robot is actually grabbed.
    const findTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) if (e.touches[i].identifier === touchId) return e.touches[i];
      return null;
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || drag) return;
      const t = e.touches[0];
      if (grab(toLocal(t.clientX, t.clientY))) {
        touchId = t.identifier;
        e.preventDefault();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchId === null) return;
      const t = findTouch(e);
      if (!t) return;
      e.preventDefault();
      moveDrag(toLocal(t.clientX, t.clientY));
    };
    const onTouchEnd = () => {
      if (touchId === null) return;
      touchId = null;
      release();
    };

    const onKey = (e: KeyboardEvent) => {
      const b = bots[selected];
      if (!b) return;
      if (e.key === "Enter") {
        e.preventDefault();
        selected = (selected + 1) % bots.length;
        say(`${BOTS[selected].label} selected. Use arrow keys to move it.`);
      } else if (e.key === " ") {
        e.preventDefault();
        shuffle();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        build();
        say("Robots reset.");
      } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const dx = e.key === "ArrowLeft" ? -22 : e.key === "ArrowRight" ? 22 : 0;
        const dy = e.key === "ArrowUp" ? -22 : e.key === "ArrowDown" ? 22 : 0;
        const hx = (b.body.bounds.max.x - b.body.bounds.min.x) / 2;
        const hy = (b.body.bounds.max.y - b.body.bounds.min.y) / 2;
        Body.setPosition(b.body, {
          x: clamp(b.body.position.x + dx, hx, width - hx),
          y: clamp(b.body.position.y + dy, hy, floorY - hy),
        });
        Body.setVelocity(b.body, { x: 0, y: 0 });
        b.mood = "happy";
        b.moodUntil = performance.now() + 500;
      }
      schedule();
      if (!canMove()) draw(performance.now());
    };

    function shuffle() {
      if (!canMove()) {
        build();
        bots.forEach((b, k) => {
          Body.setPosition(b.body, { x: width * (0.16 + 0.14 * k), y: height * (0.3 + 0.09 * (k % 3)) });
          Body.setAngle(b.body, (k - 2) * 0.14);
        });
        draw(performance.now());
      } else {
        bots.forEach((b, k) => {
          Body.setVelocity(b.body, { x: (k % 2 ? 1 : -1) * (3 + Math.random() * 3) * S, y: -(8 + Math.random() * 5) * S });
          Body.setAngularVelocity(b.body, (Math.random() - 0.5) * 0.14);
          b.mood = "wide";
          b.moodUntil = performance.now() + 700;
        });
        schedule();
      }
      say("Robots shuffled. Drag one or use the keyboard to explore.");
    }

    apiRef.current = {
      shuffle,
      reset: () => { build(); say("Robots reset."); },
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);
    canvas.addEventListener("keydown", onKey);
    const onFocus = () => { focused = canvas.matches(":focus-visible"); if (!canMove()) draw(performance.now()); };
    const onBlur = () => { focused = false; if (!canMove()) draw(performance.now()); };
    canvas.addEventListener("focus", onFocus);
    canvas.addEventListener("blur", onBlur);

    const ro = "ResizeObserver" in window ? new ResizeObserver(fit) : null;
    ro?.observe(container);
    if (!ro) window.addEventListener("resize", fit);

    const io = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.05 });
    io.observe(container);

    const onVis = () => schedule();
    document.addEventListener("visibilitychange", onVis);
    const onReduce = () => build();
    reduceMq.addEventListener("change", onReduce);

    fit();
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      apiRef.current = null;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
      canvas.removeEventListener("keydown", onKey);
      canvas.removeEventListener("focus", onFocus);
      canvas.removeEventListener("blur", onBlur);
      ro?.disconnect();
      window.removeEventListener("resize", fit);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduceMq.removeEventListener("change", onReduce);
      Events.off(engine, "collisionStart");
      Composite.clear(world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <section
      id="playground"
      className="relative w-full py-14 sm:py-20 md:py-28 bg-white text-[#091c09] border-t border-[rgba(9,28,9,0.10)] select-none overflow-hidden"
      aria-label="Interactive Robot Playground"
    >
      <AmbientBackgroundDecor variant="alternate" />
      <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 z-10">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div>
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight">
              Play with the geometry of PropheC.
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 font-medium max-w-xl">
              Tap, nudge, or drag the robots to explore physical impulses and settling dynamics.
            </p>
          </div>

          {/* Clean Controls: Shuffle & Reset */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={shuffleShapes}
              aria-label="Shuffle all robots"
              className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#091c09]"
              title="Shuffle robots"
            >
              <Shuffle className="w-4 h-4 text-[#091c09]" />
            </button>
            <button
              type="button"
              onClick={resetShapes}
              aria-label="Reset robots to default arrangement"
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[rgba(9,28,9,0.06)] border border-[rgba(9,28,9,0.12)] text-xs font-urbanist font-bold text-[#091c09] flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#091c09]" />
              Reset Arrangement
            </button>
          </div>
        </div>

        {/* Physics Arena */}
        <div
          ref={containerRef}
          className="relative w-full h-[560px] sm:h-[600px] md:h-[660px] rounded-2xl sm:rounded-[32px] border border-[rgba(9,28,9,0.12)] overflow-hidden shadow-xs"
          style={{ backgroundColor: "#f4efe9" }}
        >
          {/* Editorial headline sits behind the robots, so they can tumble over it */}
          <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-start pt-10 sm:pt-14 md:pt-16 px-4 sm:px-6 text-center pointer-events-none z-0">
            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="font-space-grotesk font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#091c09] tracking-tight leading-tight select-none">
                Engineering Intelligence for Enterprise
              </h3>
              <p className="font-urbanist text-xs sm:text-sm text-[rgba(9,28,9,0.70)] font-medium max-w-md mx-auto">
                Deterministic state machines, agent execution, and human oversight.
              </p>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            tabIndex={0}
            className="absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-[#091c09]/30 rounded-[inherit]"
            style={{ touchAction: "pan-y", cursor: "default" }}
            aria-label="Interactive robot playground. Drag the robots, or use arrow keys to move the selected one. Enter selects the next robot. Space shuffles and R resets."
          />

          {/* Caption */}
          {/* <div className="absolute left-5 right-5 bottom-3 flex justify-between gap-4 pointer-events-none z-20 text-[8px] sm:text-[9px] font-mono tracking-[0.07em] text-[rgba(9,28,9,0.48)]">
            <span>DRAG. RELEASE. REIMAGINE.</span>
            <span className="hidden sm:inline">06 ROBOTS / ENDLESS POSSIBILITIES</span>
          </div> */}
        </div>

        <span ref={statusRef} className="sr-only" role="status" aria-live="polite" />
      </div>
    </section>
  );
};



// "use client";

// import React, { useEffect, useRef, useCallback } from "react";
// import Matter from "matter-js";
// import { RotateCcw, Shuffle } from "lucide-react";

// interface ShapeItem {
//   body: Matter.Body;
//   color: string;
//   strokeColor: string;
//   type: "circle" | "rect";
//   width?: number;
//   height?: number;
//   radius?: number;
//   initialPos: { x: number; y: number };
// }

// export const InteractiveShapeScene: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const engineRef = useRef<Matter.Engine | null>(null);
//   const runnerRef = useRef<number | null>(null);
//   const bodiesRef = useRef<ShapeItem[]>([]);
//   const isVisibleRef = useRef<boolean>(true);
//   const dragActiveRef = useRef<boolean>(false);
//   const dragBodyRef = useRef<Matter.Body | null>(null);
//   const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

//   // Reset shapes to elegant resting composition
//   const resetShapes = useCallback(() => {
//     if (!containerRef.current) return;
//     const width = containerRef.current.clientWidth;
//     const height = 520;
//     const isMobile = width < 768;

//     const basePositions = isMobile
//       ? [
//         { x: width * 0.30, y: height * 0.40 },
//         { x: width * 0.70, y: height * 0.45 },
//         { x: width * 0.50, y: height * 0.75 },
//         { x: width * 0.25, y: height * 0.80 },
//         { x: width * 0.75, y: height * 0.82 },
//       ]
//       : [
//         { x: width * 0.20, y: height * 0.55 },
//         { x: width * 0.42, y: height * 0.48 },
//         { x: width * 0.65, y: height * 0.62 },
//         { x: width * 0.85, y: height * 0.50 },
//         { x: width * 0.32, y: height * 0.82 },
//       ];

//     bodiesRef.current.forEach((item, idx) => {
//       const pos = basePositions[idx] || item.initialPos;
//       Matter.Body.setPosition(item.body, { x: pos.x, y: pos.y });
//       Matter.Body.setVelocity(item.body, { x: 0, y: 0 });
//       Matter.Body.setAngularVelocity(item.body, 0);
//       Matter.Body.setAngle(item.body, 0);
//     });
//   }, []);

//   // Shuffle shapes with random impulses
//   const shuffleShapes = useCallback(() => {
//     if (!engineRef.current) return;
//     for (const { body } of bodiesRef.current) {
//       Matter.Sleeping.set(body, false);
//       const lateral = (Math.random() - 0.5) * 0.12;
//       const upward = -0.16 - Math.random() * 0.08;
//       Matter.Body.applyForce(body, body.position, { x: lateral, y: upward });
//       Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
//     }
//   }, []);

//   useEffect(() => {
//     if (!containerRef.current || !canvasRef.current) return;

//     const container = containerRef.current;
//     const canvas = canvasRef.current;
//     const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     let width = container.clientWidth;
//     const height = 520;
//     const dpr = Math.min(window.devicePixelRatio || 1, 2);

//     canvas.width = width * dpr;
//     canvas.height = height * dpr;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     ctx.scale(dpr, dpr);

//     // Matter Physics Engine with sleeping enabled for performance
//     const engine = Matter.Engine.create({
//       enableSleeping: true,
//       gravity: {
//         x: 0,
//         y: prefersReducedMotion ? 0 : 0.68,
//       },
//     });
//     engineRef.current = engine;

//     // Rigid Wall Boundaries (extended so shapes stay safely enclosed)
//     const wallOptions = { isStatic: true, friction: 0.1, restitution: 0.7 };
//     const ground = Matter.Bodies.rectangle(width / 2, height + 40, width * 2, 80, wallOptions);
//     const ceiling = Matter.Bodies.rectangle(width / 2, -40, width * 2, 80, wallOptions);
//     const leftWall = Matter.Bodies.rectangle(-40, height / 2, 80, height * 2, wallOptions);
//     const rightWall = Matter.Bodies.rectangle(width + 40, height / 2, 80, height * 2, wallOptions);

//     const isMobile = width < 768;

//     // 5 Large Substantial Geometric Bodies (Desktop: 180-280px diameters, Mobile: 100-160px)
//     const rScale = isMobile ? 0.6 : 1.0;

//     const basePositions = isMobile
//       ? [
//         { x: width * 0.28, y: height * 0.35 },
//         { x: width * 0.72, y: height * 0.40 },
//         { x: width * 0.50, y: height * 0.70 },
//         { x: width * 0.24, y: height * 0.80 },
//         { x: width * 0.76, y: height * 0.82 },
//       ]
//       : [
//         { x: width * 0.20, y: height * 0.50 },
//         { x: width * 0.44, y: height * 0.42 },
//         { x: width * 0.68, y: height * 0.58 },
//         { x: width * 0.86, y: height * 0.45 },
//         { x: width * 0.32, y: height * 0.80 },
//       ];

//     // Body 1: Large Deep Green Circle (~220px desktop)
//     const b1Radius = 110 * rScale;
//     const body1 = Matter.Bodies.circle(basePositions[0].x, basePositions[0].y, b1Radius, {
//       restitution: 0.75,
//       frictionAir: 0.02,
//       density: 0.002,
//     });

//     // Body 2: Large Pure White Rounded Rectangle (~240x180px desktop)
//     const b2W = 240 * rScale;
//     const b2H = 170 * rScale;
//     const body2 = Matter.Bodies.rectangle(basePositions[1].x, basePositions[1].y, b2W, b2H, {
//       restitution: 0.72,
//       frictionAir: 0.02,
//       chamfer: { radius: 36 * rScale },
//       density: 0.002,
//     });

//     // Body 3: Large Deep Green Circle (~230px desktop)
//     const b3Radius = 115 * rScale;
//     const body3 = Matter.Bodies.circle(basePositions[2].x, basePositions[2].y, b3Radius, {
//       restitution: 0.74,
//       frictionAir: 0.02,
//       density: 0.002,
//     });

//     // Body 4: Large Pure White Pill / Capsule (~250x140px desktop)
//     const b4W = 250 * rScale;
//     const b4H = 140 * rScale;
//     const body4 = Matter.Bodies.rectangle(basePositions[3].x, basePositions[3].y, b4W, b4H, {
//       restitution: 0.70,
//       frictionAir: 0.02,
//       chamfer: { radius: 46 * rScale },
//       density: 0.002,
//     });

//     // Body 5: Deep Green Accent Circle (~160px desktop)
//     const b5Radius = 80 * rScale;
//     const body5 = Matter.Bodies.circle(basePositions[4].x, basePositions[4].y, b5Radius, {
//       restitution: 0.78,
//       frictionAir: 0.02,
//       density: 0.002,
//     });

//     // 5 bodies alternating Deep Green (#091c09) and Pure White (#ffffff) with high-contrast borders
//     const shapeItems: ShapeItem[] = [
//       { body: body1, color: "#091c09", strokeColor: "rgba(255, 255, 255, 0.40)", type: "circle", radius: b1Radius, initialPos: basePositions[0] },
//       { body: body2, color: "#ffffff", strokeColor: "#091c09", type: "rect", width: b2W, height: b2H, initialPos: basePositions[1] },
//       { body: body3, color: "#091c09", strokeColor: "rgba(255, 255, 255, 0.40)", type: "circle", radius: b3Radius, initialPos: basePositions[2] },
//       { body: body4, color: "#ffffff", strokeColor: "#091c09", type: "rect", width: b4W, height: b4H, initialPos: basePositions[3] },
//       { body: body5, color: "#091c09", strokeColor: "rgba(255, 255, 255, 0.40)", type: "circle", radius: b5Radius, initialPos: basePositions[4] },
//     ];

//     bodiesRef.current = shapeItems;

//     Matter.Composite.add(engine.world, [
//       ground,
//       ceiling,
//       leftWall,
//       rightWall,
//       body1,
//       body2,
//       body3,
//       body4,
//       body5,
//     ]);

//     // Render loop
//     let lastTime = performance.now();
//     const render = () => {
//       if (!isVisibleRef.current) {
//         runnerRef.current = requestAnimationFrame(render);
//         return;
//       }

//       const now = performance.now();
//       const delta = Math.min(now - lastTime, 40);
//       lastTime = now;

//       if (!prefersReducedMotion) {
//         Matter.Engine.update(engine, delta);
//       }

//       ctx.clearRect(0, 0, width, height);

//       // Draw bodies with clean edges & subtle elevation
//       for (const item of shapeItems) {
//         const { body, color, strokeColor, type } = item;
//         const { x, y } = body.position;
//         const angle = body.angle;

//         ctx.save();
//         ctx.translate(x, y);
//         ctx.rotate(angle);

//         ctx.fillStyle = color;
//         ctx.shadowColor = "rgba(9, 28, 9, 0.12)";
//         ctx.shadowBlur = 16;
//         ctx.shadowOffsetY = 6;

//         if (type === "circle" && item.radius) {
//           ctx.beginPath();
//           ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
//           ctx.fill();

//           ctx.strokeStyle = strokeColor;
//           ctx.lineWidth = 2;
//           ctx.stroke();
//         } else if (type === "rect" && item.width && item.height) {
//           const w = item.width;
//           const h = item.height;
//           const r = Math.min(36 * rScale, Math.min(w, h) / 2);

//           ctx.beginPath();
//           ctx.roundRect(-w / 2, -h / 2, w, h, r);
//           ctx.fill();

//           ctx.strokeStyle = strokeColor;
//           ctx.lineWidth = 2;
//           ctx.stroke();
//         }

//         ctx.restore();
//       }

//       runnerRef.current = requestAnimationFrame(render);
//     };

//     runnerRef.current = requestAnimationFrame(render);

//     // Bounded Touch / Drag & Tap Mechanics
//     const getPointerPos = (e: MouseEvent | TouchEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       const clientX = "touches" in e ? (e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX) : e.clientX;
//       const clientY = "touches" in e ? (e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY) : e.clientY;
//       return {
//         x: clientX - rect.left,
//         y: clientY - rect.top,
//       };
//     };

//     const handlePointerDown = (e: MouseEvent | TouchEvent) => {
//       const pos = getPointerPos(e);
//       let hitBody: Matter.Body | null = null;

//       for (const { body } of shapeItems) {
//         if (Matter.Bounds.contains(body.bounds, pos)) {
//           hitBody = body;
//           break;
//         }
//       }

//       if (hitBody) {
//         dragActiveRef.current = true;
//         dragBodyRef.current = hitBody;
//         dragStartPosRef.current = pos;
//         Matter.Sleeping.set(hitBody, false);
//       }
//     };

//     const handlePointerMove = (e: MouseEvent | TouchEvent) => {
//       if (!dragActiveRef.current || !dragBodyRef.current) return;
//       const pos = getPointerPos(e);
//       const target = dragBodyRef.current;

//       const deltaX = (pos.x - target.position.x) * 0.18;
//       const deltaY = (pos.y - target.position.y) * 0.18;

//       Matter.Body.setVelocity(target, { x: deltaX, y: deltaY });
//     };

//     const handlePointerUp = (e: MouseEvent | TouchEvent) => {
//       if (dragActiveRef.current && dragBodyRef.current) {
//         const pos = getPointerPos(e);
//         const dist = Math.hypot(pos.x - dragStartPosRef.current.x, pos.y - dragStartPosRef.current.y);

//         // If it was a quick tap, deliver a friendly physical impulse
//         if (dist < 10) {
//           const lateral = (Math.random() - 0.5) * 0.10;
//           const upward = -0.16;
//           Matter.Body.applyForce(dragBodyRef.current, dragBodyRef.current.position, { x: lateral, y: upward });
//           Matter.Body.setAngularVelocity(dragBodyRef.current, (Math.random() - 0.5) * 0.12);
//         }
//       }

//       dragActiveRef.current = false;
//       dragBodyRef.current = null;
//     };

//     canvas.addEventListener("mousedown", handlePointerDown);
//     window.addEventListener("mousemove", handlePointerMove);
//     window.addEventListener("mouseup", handlePointerUp);

//     // Passive touch listeners so vertical scrolling outside direct touches remains silky smooth
//     canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
//     window.addEventListener("touchmove", handlePointerMove, { passive: true });
//     window.addEventListener("touchend", handlePointerUp, { passive: true });

//     // IntersectionObserver to pause loop when offscreen
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           isVisibleRef.current = entry.isIntersecting;
//         });
//       },
//       { threshold: 0.1 }
//     );
//     observer.observe(container);

//     // Visibility change handler (pauses when browser tab is inactive)
//     const handleVisibility = () => {
//       isVisibleRef.current = !document.hidden;
//     };
//     document.addEventListener("visibilitychange", handleVisibility);

//     // Resize Handler
//     const handleResize = () => {
//       if (!containerRef.current || !canvasRef.current) return;
//       width = containerRef.current.clientWidth;
//       canvas.width = width * dpr;
//       canvas.style.width = `${width}px`;
//       ctx.scale(dpr, dpr);

//       // Re-align boundaries
//       Matter.Body.setPosition(ground, { x: width / 2, y: height + 40 });
//       Matter.Body.setPosition(ceiling, { x: width / 2, y: -40 });
//       Matter.Body.setPosition(rightWall, { x: width + 40, y: height / 2 });
//     };
//     window.addEventListener("resize", handleResize);

//     return () => {
//       if (runnerRef.current) cancelAnimationFrame(runnerRef.current);
//       observer.disconnect();
//       document.removeEventListener("visibilitychange", handleVisibility);
//       window.removeEventListener("resize", handleResize);
//       canvas.removeEventListener("mousedown", handlePointerDown);
//       window.removeEventListener("mousemove", handlePointerMove);
//       window.removeEventListener("mouseup", handlePointerUp);
//       canvas.removeEventListener("touchstart", handlePointerDown);
//       window.removeEventListener("touchmove", handlePointerMove);
//       window.removeEventListener("touchend", handlePointerUp);
//       Matter.World.clear(engine.world, false);
//       Matter.Engine.clear(engine);
//     };
//   }, []);

//   return (
//     <section
//       id="playground"
//       className="relative w-full py-14 sm:py-20 md:py-28 bg-white text-[#091c09] border-t border-[rgba(9,28,9,0.10)] select-none overflow-hidden"
//       aria-label="Interactive Geometric Shapes Arena"
//     >
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

//         {/* Header Block */}
//         <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
//           <div>
//             <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight">
//               Play with the geometry of PropheC.
//             </h2>
//             <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 font-medium max-w-xl">
//               Tap, nudge, or drag shapes to explore physical impulses and settling dynamics.
//             </p>
//           </div>

//           {/* Clean Controls: Shuffle & Reset */}
//           <div className="flex items-center gap-2.5 sm:gap-3">
//             <button
//               onClick={shuffleShapes}
//               aria-label="Shuffle all geometric shapes"
//               className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#091c09]"
//               title="Shuffle shapes"
//             >
//               <Shuffle className="w-4 h-4 text-[#091c09]" />
//             </button>
//             <button
//               onClick={resetShapes}
//               aria-label="Reset shapes to default arrangement"
//               className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[rgba(9,28,9,0.06)] border border-[rgba(9,28,9,0.12)] text-xs font-urbanist font-bold text-[#091c09] flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
//             >
//               <RotateCcw className="w-3.5 h-3.5 text-[#091c09]" />
//               Reset Arrangement
//             </button>
//           </div>
//         </div>

//         {/* Clean Physics Arena */}
//         <div
//           ref={containerRef}
//           className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] rounded-2xl sm:rounded-[32px] bg-white border border-[rgba(9,28,9,0.12)] overflow-hidden shadow-xs"
//           style={{ touchAction: "pan-y" }}
//         >
//           <canvas
//             ref={canvasRef}
//             className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
//             title="Drag or tap any shape"
//           />

//           {/* Centered Editorial Overlay */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center pointer-events-none z-20">
//             <div className="max-w-xl mx-auto space-y-2">
//               <h3 className="font-space-grotesk font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#091c09] tracking-tight leading-tight select-none">
//                 Engineering Intelligence for Enterprise
//               </h3>
//               <p className="font-urbanist text-xs sm:text-sm text-[rgba(9,28,9,0.70)] font-medium max-w-md mx-auto">
//                 Deterministic state machines, agent execution, and human oversight.
//               </p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };
