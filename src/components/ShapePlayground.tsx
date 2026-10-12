"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { RotateCcw, Sparkles, Move, Zap } from "lucide-react";

interface ShapePlaygroundProps {
  currentTheme: "emerald" | "indigo" | "cyan" | "pearl";
  onThemeChange: (theme: "emerald" | "indigo" | "cyan" | "pearl") => void;
}

export const ShapePlayground: React.FC<ShapePlaygroundProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const isPausedRef = useRef(false);
  const [interactiveMode, setInteractiveMode] = useState<"gravity" | "float">("gravity");
  const [clickCount, setClickCount] = useState(0);

  const themeColors = {
    emerald: {
      primary: "#18B951",
      secondary: "#2FF882",
      tertiary: "#0D2419",
      accent: "#68D391",
      bg: "#07140F",
    },
    indigo: {
      primary: "#94A3FF",
      secondary: "#6366F1",
      tertiary: "#171C36",
      accent: "#C7D2FE",
      bg: "#0D1024",
    },
    cyan: {
      primary: "#5BE3F1",
      secondary: "#06B6D4",
      tertiary: "#0D2730",
      accent: "#A5F3FC",
      bg: "#071820",
    },
    pearl: {
      primary: "#2EE59D",
      secondary: "#10B981",
      tertiary: "#1E2D24",
      accent: "#D1FAE5",
      bg: "#151F19",
    },
  };

  const colors = themeColors[currentTheme];

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

    // Create 7 Playful Google Labs-style Shapes (circles, capsules, hexagons)
    const shapeConfigs = [
      { type: "circle", x: width * 0.2, y: 120, r: 36, colorKey: "primary", label: "Agent" },
      { type: "circle", x: width * 0.35, y: 90, r: 48, colorKey: "secondary", label: "Argus" },
      { type: "rect", x: width * 0.5, y: 150, w: 90, h: 42, colorKey: "primary", label: "Audit" },
      { type: "circle", x: width * 0.65, y: 100, r: 40, colorKey: "secondary", label: "Flow" },
      { type: "polygon", x: width * 0.8, y: 130, sides: 6, r: 38, colorKey: "accent", label: "Scale" },
      { type: "circle", x: width * 0.28, y: 220, r: 28, colorKey: "accent", label: "Sync" },
      { type: "rect", x: width * 0.6, y: 210, w: 80, h: 36, colorKey: "primary", label: "Neural" },
    ];

    const shapes: Matter.Body[] = shapeConfigs.map((cfg) => {
      let body: Matter.Body;
      const renderColor = colors[cfg.colorKey as keyof typeof colors];

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
        colorKey: cfg.colorKey,
        baseColor: renderColor,
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
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
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
        const data = (body as unknown as { customData: { colorKey: keyof typeof colors; label: string } }).customData;
        const color = colors[data.colorKey] || colors.primary;

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

        // Glow & Fill
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = color;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.stroke();

        // Label inside shape
        ctx.fillStyle = "#050B14";
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

    // Visibility change handler (pauses tab catch-up spikes)
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      Matter.Engine.clear(engine);
    };
  }, [currentTheme, colors]);

  // Click or tap impulse: applies upward + lateral impulse
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setClickCount((c) => c + 1);

    bodiesRef.current.forEach((body) => {
      const dx = body.position.x - clickX;
      const dy = body.position.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If clicked near shape, give high impulse, else general agitation
      if (dist < 180) {
        const forceMagnitude = 0.045 * (1 - dist / 220);
        Matter.Body.applyForce(body, body.position, {
          x: (dx / dist) * forceMagnitude * 1.5,
          y: -0.06 - Math.random() * 0.03, // strong upward impulse
        });
      } else {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.015,
          y: -0.02 - Math.random() * 0.02,
        });
      }
    });
  };

  // Reset Shapes to Deterministic Arrangement
  const handleReset = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;

    const initialPositions = [
      { x: width * 0.2, y: 120 },
      { x: width * 0.35, y: 90 },
      { x: width * 0.5, y: 150 },
      { x: width * 0.65, y: 100 },
      { x: width * 0.8, y: 130 },
      { x: width * 0.28, y: 220 },
      { x: width * 0.6, y: 210 },
    ];

    bodiesRef.current.forEach((body, idx) => {
      if (initialPositions[idx]) {
        Matter.Body.setPosition(body, initialPositions[idx]);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
        Matter.Body.setAngle(body, 0);
      }
    });
  };

  // Toggle Float/Zero Gravity mode
  const toggleGravity = () => {
    if (!engineRef.current) return;
    if (interactiveMode === "gravity") {
      engineRef.current.gravity.y = -0.05; // gentle float
      setInteractiveMode("float");
    } else {
      engineRef.current.gravity.y = 0.8;
      setInteractiveMode("gravity");
    }
  };

  return (
    <section id="playground" className="relative w-full py-20 px-4 md:px-8 border-b border-white/5 select-none transition-colors duration-500 bg-[var(--section-bg,#07140F)] text-[var(--text-primary,#F4FFF8)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[var(--accent,#18B951)] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GOOGLE LABS-INSPIRED INTERACTION</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl md:text-5xl tracking-tight">
              Interactive Physics & Theme Lab
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted,#84A995)] mt-2 max-w-xl">
              Tap or click to launch shapes with physics-bounded impulses. Switch lower-section theme palettes below without touching the hero.
            </p>
          </div>

          {/* Theme Palette Switchers (Scoped strictly to lower sections) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 flex-wrap">
            <span className="text-xs text-white/50 px-2 font-mono">THEME:</span>
            {(["emerald", "indigo", "cyan", "pearl"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-all ${
                  currentTheme === t
                    ? "bg-[var(--accent,#18B951)] text-black font-bold shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Physics Canvas Arena */}
        <div 
          ref={containerRef}
          className="relative w-full h-[440px] rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl"
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-pointer touch-pan-y"
            title="Click or tap to toss shapes"
          />

          {/* Floating Canvas Controls Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={toggleGravity}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-xs text-white flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[var(--accent,#18B951)]" />
              <span>{interactiveMode === "gravity" ? "Zero-G Float" : "Normal Gravity"}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-xs text-white flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Canvas Subtitle Overlay */}
          <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-3 text-xs text-white/40 font-mono">
            <div className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5" />
              <span>Click arena to trigger kinetic impulse</span>
            </div>
            <span>•</span>
            <span>Impulses triggered: {clickCount}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
