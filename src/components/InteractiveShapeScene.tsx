"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";
import { Sparkles, RotateCcw, Shuffle } from "lucide-react";

interface ShapeItem {
  body: Matter.Body;
  color: string;
  strokeColor: string;
  type: "circle" | "rect";
  width?: number;
  height?: number;
  radius?: number;
  initialPos: { x: number; y: number };
}

export const InteractiveShapeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<number | null>(null);
  const bodiesRef = useRef<ShapeItem[]>([]);
  const isVisibleRef = useRef<boolean>(true);
  const dragActiveRef = useRef<boolean>(false);
  const dragBodyRef = useRef<Matter.Body | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset shapes to elegant resting composition
  const resetShapes = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = 520;
    const isMobile = width < 768;

    const basePositions = isMobile
      ? [
        { x: width * 0.30, y: height * 0.40 },
        { x: width * 0.70, y: height * 0.45 },
        { x: width * 0.50, y: height * 0.75 },
        { x: width * 0.25, y: height * 0.80 },
        { x: width * 0.75, y: height * 0.82 },
      ]
      : [
        { x: width * 0.20, y: height * 0.55 },
        { x: width * 0.42, y: height * 0.48 },
        { x: width * 0.65, y: height * 0.62 },
        { x: width * 0.85, y: height * 0.50 },
        { x: width * 0.32, y: height * 0.82 },
      ];

    bodiesRef.current.forEach((item, idx) => {
      const pos = basePositions[idx] || item.initialPos;
      Matter.Body.setPosition(item.body, { x: pos.x, y: pos.y });
      Matter.Body.setVelocity(item.body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(item.body, 0);
      Matter.Body.setAngle(item.body, 0);
    });
  }, []);

  // Shuffle shapes with random impulses
  const shuffleShapes = useCallback(() => {
    if (!engineRef.current) return;
    for (const { body } of bodiesRef.current) {
      Matter.Sleeping.set(body, false);
      const lateral = (Math.random() - 0.5) * 0.12;
      const upward = -0.16 - Math.random() * 0.08;
      Matter.Body.applyForce(body, body.position, { x: lateral, y: upward });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = container.clientWidth;
    const height = 520;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Matter Physics Engine with sleeping enabled for performance
    const engine = Matter.Engine.create({
      enableSleeping: true,
      gravity: {
        x: 0,
        y: prefersReducedMotion ? 0 : 0.68,
      },
    });
    engineRef.current = engine;

    // Rigid Wall Boundaries (extended so shapes stay safely enclosed)
    const wallOptions = { isStatic: true, friction: 0.1, restitution: 0.7 };
    const ground = Matter.Bodies.rectangle(width / 2, height + 40, width * 2, 80, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -40, width * 2, 80, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-40, height / 2, 80, height * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 40, height / 2, 80, height * 2, wallOptions);

    const isMobile = width < 768;

    // 5 Large Substantial Geometric Bodies (Desktop: 180-280px diameters, Mobile: 100-160px)
    const rScale = isMobile ? 0.6 : 1.0;

    const basePositions = isMobile
      ? [
        { x: width * 0.28, y: height * 0.35 },
        { x: width * 0.72, y: height * 0.40 },
        { x: width * 0.50, y: height * 0.70 },
        { x: width * 0.24, y: height * 0.80 },
        { x: width * 0.76, y: height * 0.82 },
      ]
      : [
        { x: width * 0.20, y: height * 0.50 },
        { x: width * 0.44, y: height * 0.42 },
        { x: width * 0.68, y: height * 0.58 },
        { x: width * 0.86, y: height * 0.45 },
        { x: width * 0.32, y: height * 0.80 },
      ];

    // Body 1: Large Deep Green Circle (~220px desktop)
    const b1Radius = 110 * rScale;
    const body1 = Matter.Bodies.circle(basePositions[0].x, basePositions[0].y, b1Radius, {
      restitution: 0.75,
      frictionAir: 0.02,
      density: 0.002,
    });

    // Body 2: Large Pure White Rounded Rectangle (~240x180px desktop)
    const b2W = 240 * rScale;
    const b2H = 170 * rScale;
    const body2 = Matter.Bodies.rectangle(basePositions[1].x, basePositions[1].y, b2W, b2H, {
      restitution: 0.72,
      frictionAir: 0.02,
      chamfer: { radius: 36 * rScale },
      density: 0.002,
    });

    // Body 3: Large Deep Green Circle (~230px desktop)
    const b3Radius = 115 * rScale;
    const body3 = Matter.Bodies.circle(basePositions[2].x, basePositions[2].y, b3Radius, {
      restitution: 0.74,
      frictionAir: 0.02,
      density: 0.002,
    });

    // Body 4: Large Pure White Pill / Capsule (~250x140px desktop)
    const b4W = 250 * rScale;
    const b4H = 140 * rScale;
    const body4 = Matter.Bodies.rectangle(basePositions[3].x, basePositions[3].y, b4W, b4H, {
      restitution: 0.70,
      frictionAir: 0.02,
      chamfer: { radius: 46 * rScale },
      density: 0.002,
    });

    // Body 5: Deep Green Accent Circle (~160px desktop)
    const b5Radius = 80 * rScale;
    const body5 = Matter.Bodies.circle(basePositions[4].x, basePositions[4].y, b5Radius, {
      restitution: 0.78,
      frictionAir: 0.02,
      density: 0.002,
    });

    // 5 bodies alternating Deep Green (#091c09) and Pure White (#ffffff) with high-contrast borders
    const shapeItems: ShapeItem[] = [
      { body: body1, color: "#091c09", strokeColor: "rgba(255, 255, 255, 0.40)", type: "circle", radius: b1Radius, initialPos: basePositions[0] },
      { body: body2, color: "#ffffff", strokeColor: "#091c09", type: "rect", width: b2W, height: b2H, initialPos: basePositions[1] },
      { body: body3, color: "#091c09", strokeColor: "rgba(255, 255, 255, 0.40)", type: "circle", radius: b3Radius, initialPos: basePositions[2] },
      { body: body4, color: "#ffffff", strokeColor: "#091c09", type: "rect", width: b4W, height: b4H, initialPos: basePositions[3] },
      { body: body5, color: "#091c09", strokeColor: "rgba(255, 255, 255, 0.40)", type: "circle", radius: b5Radius, initialPos: basePositions[4] },
    ];

    bodiesRef.current = shapeItems;

    Matter.Composite.add(engine.world, [
      ground,
      ceiling,
      leftWall,
      rightWall,
      body1,
      body2,
      body3,
      body4,
      body5,
    ]);

    // Render loop
    let lastTime = performance.now();
    const render = () => {
      if (!isVisibleRef.current) {
        runnerRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const delta = Math.min(now - lastTime, 40);
      lastTime = now;

      if (!prefersReducedMotion) {
        Matter.Engine.update(engine, delta);
      }

      ctx.clearRect(0, 0, width, height);

      // Draw bodies with clean edges & subtle elevation
      for (const item of shapeItems) {
        const { body, color, strokeColor, type } = item;
        const { x, y } = body.position;
        const angle = body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(9, 28, 9, 0.12)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;

        if (type === "circle" && item.radius) {
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (type === "rect" && item.width && item.height) {
          const w = item.width;
          const h = item.height;
          const r = Math.min(36 * rScale, Math.min(w, h) / 2);

          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, r);
          ctx.fill();

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      }

      runnerRef.current = requestAnimationFrame(render);
    };

    runnerRef.current = requestAnimationFrame(render);

    // Bounded Touch / Drag & Tap Mechanics
    const getPointerPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? e.changedTouches[0]?.clientY) : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const pos = getPointerPos(e);
      let hitBody: Matter.Body | null = null;

      for (const { body } of shapeItems) {
        if (Matter.Bounds.contains(body.bounds, pos)) {
          hitBody = body;
          break;
        }
      }

      if (hitBody) {
        dragActiveRef.current = true;
        dragBodyRef.current = hitBody;
        dragStartPosRef.current = pos;
        Matter.Sleeping.set(hitBody, false);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!dragActiveRef.current || !dragBodyRef.current) return;
      const pos = getPointerPos(e);
      const target = dragBodyRef.current;

      const deltaX = (pos.x - target.position.x) * 0.18;
      const deltaY = (pos.y - target.position.y) * 0.18;

      Matter.Body.setVelocity(target, { x: deltaX, y: deltaY });
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if (dragActiveRef.current && dragBodyRef.current) {
        const pos = getPointerPos(e);
        const dist = Math.hypot(pos.x - dragStartPosRef.current.x, pos.y - dragStartPosRef.current.y);

        // If it was a quick tap, deliver a friendly physical impulse
        if (dist < 10) {
          const lateral = (Math.random() - 0.5) * 0.10;
          const upward = -0.16;
          Matter.Body.applyForce(dragBodyRef.current, dragBodyRef.current.position, { x: lateral, y: upward });
          Matter.Body.setAngularVelocity(dragBodyRef.current, (Math.random() - 0.5) * 0.12);
        }
      }

      dragActiveRef.current = false;
      dragBodyRef.current = null;
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    // Passive touch listeners so vertical scrolling outside direct touches remains silky smooth
    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp, { passive: true });

    // IntersectionObserver to pause loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Visibility change handler (pauses when browser tab is inactive)
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      width = containerRef.current.clientWidth;
      canvas.width = width * dpr;
      canvas.style.width = `${width}px`;
      ctx.scale(dpr, dpr);

      // Re-align boundaries
      Matter.Body.setPosition(ground, { x: width / 2, y: height + 40 });
      Matter.Body.setPosition(ceiling, { x: width / 2, y: -40 });
      Matter.Body.setPosition(rightWall, { x: width + 40, y: height / 2 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (runnerRef.current) cancelAnimationFrame(runnerRef.current);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <section
      id="playground"
      className="relative w-full py-14 sm:py-20 md:py-28 bg-white text-[#091c09] border-t border-[rgba(9,28,9,0.10)] select-none overflow-hidden"
      aria-label="Interactive Geometric Shapes Arena"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div>
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight">
              Play with the geometry of PropheC.
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 font-medium max-w-xl">
              Tap, nudge, or drag shapes to explore physical impulses and settling dynamics.
            </p>
          </div>

          {/* Clean Controls: Shuffle & Reset */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={shuffleShapes}
              aria-label="Shuffle all geometric shapes"
              className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#091c09]"
              title="Shuffle shapes"
            >
              <Shuffle className="w-4 h-4 text-[#091c09]" />
            </button>
            <button
              onClick={resetShapes}
              aria-label="Reset shapes to default arrangement"
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[rgba(9,28,9,0.06)] border border-[rgba(9,28,9,0.12)] text-xs font-urbanist font-bold text-[#091c09] flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#091c09]" />
              Reset Arrangement
            </button>
          </div>
        </div>

        {/* Clean Physics Arena */}
        <div
          ref={containerRef}
          className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] rounded-2xl sm:rounded-[32px] bg-white border border-[rgba(9,28,9,0.12)] overflow-hidden shadow-xs"
          style={{ touchAction: "pan-y" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
            title="Drag or tap any shape"
          />

          {/* Centered Editorial Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center pointer-events-none z-20">
            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="font-space-grotesk font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#091c09] tracking-tight leading-tight select-none">
                Engineering Intelligence for Enterprise
              </h3>
              <p className="font-urbanist text-xs sm:text-sm text-[rgba(9,28,9,0.70)] font-medium max-w-md mx-auto">
                Deterministic state machines, agent execution, and human oversight.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
