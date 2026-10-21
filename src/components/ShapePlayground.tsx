"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { RotateCcw, Sparkles, Move, Zap } from "lucide-react";

interface ShapePlaygroundProps {
  currentTheme?: "emerald" | "indigo" | "cyan" | "pearl";
  onThemeChange?: (theme: "emerald" | "indigo" | "cyan" | "pearl") => void;
}

export const ShapePlayground: React.FC<ShapePlaygroundProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const isPausedRef = useRef(false);
  const [interactiveMode, setInteractiveMode] = useState<"gravity" | "float">("gravity");
  const [clickCount, setClickCount] = useState(0);

  // Initialize and manage Matter.js Physics Engine
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = containerRef.current.clientWidth;
    const height = 440;
    const canvas = canvasRef.current;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Create Matter Engine
    const engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: prefersReducedMotion ? 0 : 0.8,
        scale: 0.001,
      },
    });
    engineRef.current = engine;

    // Boundary walls (floor, ceiling, left, right)
    const wallThickness = 60;
    const floor = Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, {
      isStatic: true,
      restitution: 0.7,
      friction: 0.1,
    });
    const ceiling = Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, {
      isStatic: true,
      restitution: 0.7,
    });
    const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      restitution: 0.7,
    });
    const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      restitution: 0.7,
    });

    // Create 7 Playful Shapes (alternating Deep Green & Pure White)
    const shapeConfigs = [
      { type: "circle", x: width * 0.2, y: 120, r: 36, isWhite: false, label: "Agent" },
      { type: "circle", x: width * 0.35, y: 90, r: 48, isWhite: true, label: "Argus" },
      { type: "rect", x: width * 0.5, y: 150, w: 90, h: 42, isWhite: false, label: "Audit" },
      { type: "circle", x: width * 0.65, y: 100, r: 40, isWhite: true, label: "Flow" },
      { type: "polygon", x: width * 0.8, y: 130, sides: 6, r: 38, isWhite: false, label: "Scale" },
      { type: "circle", x: width * 0.28, y: 220, r: 28, isWhite: true, label: "Sync" },
      { type: "rect", x: width * 0.6, y: 210, w: 80, h: 36, isWhite: false, label: "Neural" },
    ];

    const shapes: Matter.Body[] = shapeConfigs.map((cfg) => {
      let body: Matter.Body;

      if (cfg.type === "circle") {
        body = Matter.Bodies.circle(cfg.x, cfg.y, cfg.r || 36, {
          restitution: 0.8,
          friction: 0.05,
          frictionAir: 0.015,
          density: 0.002,
        });
      } else if (cfg.type === "rect") {
        body = Matter.Bodies.rectangle(cfg.x, cfg.y, cfg.w || 70, cfg.h || 35, {
          restitution: 0.75,
          friction: 0.05,
          chamfer: { radius: 16 },
        });
      } else {
        body = Matter.Bodies.polygon(cfg.x, cfg.y, cfg.sides || 6, cfg.r || 38, {
          restitution: 0.8,
          friction: 0.05,
        });
      }

      // Store visual metadata on body
      (body as unknown as { customData: unknown }).customData = {
        isWhite: cfg.isWhite,
        label: cfg.label,
        type: cfg.type,
        r: cfg.r || 35,
        w: cfg.w || 70,
        h: cfg.h || 35,
      };

      return body;
    });

    bodiesRef.current = shapes;

    Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall, ...shapes]);

    // Custom Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      animId = requestAnimationFrame(renderLoop);
      if (isPausedRef.current) return;

      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      if (!prefersReducedMotion) {
        Matter.Engine.update(engine, delta);
      }

      // Draw Scene
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = "rgba(9, 28, 9, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw each physics shape
      shapes.forEach((body) => {
        const data = (body as unknown as { customData: { isWhite: boolean; label: string } }).customData;
        const isWhite = data.isWhite;
        const color = isWhite ? "#ffffff" : "#091c09";
        const strokeColor = isWhite ? "#091c09" : "rgba(255, 255, 255, 0.40)";
        const textColor = isWhite ? "#091c09" : "#ffffff";

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        ctx.beginPath();
        const vertices = body.vertices;
        ctx.moveTo(vertices[0].x - body.position.x, vertices[0].y - body.position.y);
        for (let j = 1; j < vertices.length; j += 1) {
          ctx.lineTo(vertices[j].x - body.position.x, vertices[j].y - body.position.y);
        }
        ctx.closePath();

        // Fill with shadow
        ctx.shadowColor = "rgba(9, 28, 9, 0.12)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = color;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Label inside shape
        ctx.fillStyle = textColor;
        ctx.font = "bold 11px 'Urbanist', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.label, 0, 0);

        ctx.restore();
      });
    };

    animId = requestAnimationFrame(renderLoop);

    // Pause offscreen via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isPausedRef.current = !entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);

    // Visibility change handler
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Click to add impulse
    const handleCanvasClick = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      shapes.forEach((body) => {
        const dx = body.position.x - clickX;
        const dy = body.position.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160 && dist > 0) {
          const forceMag = (1 - dist / 160) * 0.08;
          Matter.Body.applyForce(body, body.position, {
            x: (dx / dist) * forceMag,
            y: (dy / dist) * forceMag - 0.04,
          });
        }
      });

      setClickCount((c) => c + 1);
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("click", handleCanvasClick);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  const resetArrangement = () => {
    if (!containerRef.current || !engineRef.current) return;
    const width = containerRef.current.clientWidth;

    const basePositions = [
      { x: width * 0.2, y: 120 },
      { x: width * 0.35, y: 90 },
      { x: width * 0.5, y: 150 },
      { x: width * 0.65, y: 100 },
      { x: width * 0.8, y: 130 },
      { x: width * 0.28, y: 220 },
      { x: width * 0.6, y: 210 },
    ];

    bodiesRef.current.forEach((body, idx) => {
      const pos = basePositions[idx] || { x: width * 0.5, y: 150 };
      Matter.Body.setPosition(body, pos);
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setAngle(body, 0);
    });
  };

  const toggleGravity = () => {
    if (!engineRef.current) return;
    if (interactiveMode === "gravity") {
      engineRef.current.gravity.y = -0.15;
      setInteractiveMode("float");
    } else {
      engineRef.current.gravity.y = 0.8;
      setInteractiveMode("gravity");
    }
  };

  return (
    <section id="playground" className="relative w-full py-20 px-4 md:px-8 border-b border-[rgba(9,28,9,0.10)] select-none bg-white text-[#091c09]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-xs font-mono font-bold text-[#091c09] mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#091c09]" />
              <span>INTERACTIVE PHYSICS LAB</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl md:text-5xl text-[#091c09] tracking-tight">
              Matter.js Geometric Arena
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm md:text-base mt-2 max-w-xl font-medium">
              Click anywhere inside the arena to create explosive impulse fields. Tap reset to align them back to blueprint state.
            </p>
          </div>

          {/* Controller Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleGravity}
              className={`px-3.5 py-1.5 rounded-full text-xs font-urbanist font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                interactiveMode === "float"
                  ? "bg-[#091c09] text-white border-[#091c09]"
                  : "bg-white text-[#091c09] border-[rgba(9,28,9,0.12)] hover:bg-[rgba(9,28,9,0.04)]"
              }`}
            >
              {interactiveMode === "float" ? <Move className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{interactiveMode === "float" ? "Float Mode" : "Gravity Mode"}</span>
            </button>

            <button
              onClick={resetArrangement}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[rgba(9,28,9,0.04)] border border-[rgba(9,28,9,0.12)] text-[#091c09] font-urbanist font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Physics Canvas Arena */}
        <div
          ref={containerRef}
          className="relative w-full h-[440px] rounded-3xl bg-white border border-[rgba(9,28,9,0.12)] overflow-hidden shadow-sm"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            title="Click to interact"
          />

          {/* Floating Instructions */}
          <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-[rgba(9,28,9,0.60)] bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[rgba(9,28,9,0.12)]">
            <span>Interactions: {clickCount} • Physics Engine: Matter.js</span>
          </div>
        </div>

      </div>
    </section>
  );
};
