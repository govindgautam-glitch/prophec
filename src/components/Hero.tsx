"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Headphones, Cpu, ShieldCheck, ArrowRight, ArrowUpRight } from "lucide-react";
import { AuditModal } from "./ActionModals";

interface AgentNodeData {
  id: "sales" | "care" | "flow" | "human";
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  index: string;
  /** Start position inside the 640x640 SVG space (same space the white dots live in) */
  x: number;
  y: number;
}

/*
  Cards start exactly where the white dots start (reference.html):
    dot 1 -> (320,119) r=201 | dot 2 -> (494,421) r=201 | dot 3 -> (101,194) r=252
  4th card sits on the r=201 ring at 150deg so all four are spread out.
*/
const AGENT_NODES: AgentNodeData[] = [
  {
    id: "sales",
    title: "Sales Agent",
    subtitle: "Pipeline qualification",
    icon: Sparkles,
    description: "Qualify an inquiry, capture context and route the next conversation.",
    index: "01 / 04",
    x: 320,
    y: 119,
  },
  {
    id: "care",
    title: "Customer Care",
    subtitle: "Support & routing",
    icon: Headphones,
    description: "Understand a customer request and bring the right team into the conversation.",
    index: "02 / 04",
    x: 494,
    y: 421,
  },
  {
    id: "flow",
    title: "Workflow Automation",
    subtitle: "Cross-system execution",
    icon: Cpu,
    description: "Coordinate the next action across the business tools you already use.",
    index: "03 / 04",
    x: 101,
    y: 194,
  },
  {
    id: "human",
    title: "Human Oversight",
    subtitle: "Audit & approvals",
    icon: ShieldCheck,
    description: "Keep decisions, approvals and exceptions visible to the people responsible.",
    index: "04 / 04",
    x: 146,
    y: 421,
  },
];

/* One keyframe + one duration (65s) = dots and cards can never drift apart */
const ORBIT_CSS = `
@keyframes orbit-turn { to { transform: rotate(360deg); } }

.orbit-scene-container { container-type: size; }

/* the SAME square box the SVG viewBox (640x640) is drawn into */
.orbit-field {
  position: absolute; left: 50%; top: 50%;
  width: 110cqmin; height: 110cqmin;
  transform: translate(-50%, -50%);
  pointer-events: none; z-index: 20;
}
.orbit-field .orbit-rotor { position: absolute; inset: 0; transform-origin: 50% 50%; animation: orbit-turn 65s linear infinite; }
.orbit-spin     { transform-origin: 320px 320px; animation: orbit-turn 65s linear infinite; }
.orbit-spin-rev { transform-origin: 320px 320px; animation: orbit-turn 34s linear infinite reverse; }
.orbit-unspin   { transform-origin: 0 0; animation: orbit-turn 65s linear infinite reverse; }

/* pause dots + cards together while a card is hovered / focused */
.orbit-scene-container:has(.orbit-node:hover) :is(.orbit-rotor, .orbit-spin, .orbit-spin-rev, .orbit-unspin),
.orbit-scene-container:has(.orbit-node:focus-visible) :is(.orbit-rotor, .orbit-spin, .orbit-spin-rev, .orbit-unspin),
.orbit-scene-container[data-orbit-paused="true"] :is(.orbit-rotor, .orbit-spin, .orbit-spin-rev, .orbit-unspin) {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .orbit-rotor, .orbit-spin, .orbit-spin-rev, .orbit-unspin { animation: none !important; }
}
`;

export const Hero: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<AgentNodeData["id"]>("sales");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);

  // Subtle interactive parallax over orbit scene
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      setParallax({ x: Math.round(normX * 12), y: Math.round(normY * 10) });
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  // Pause orbit while hero is off-screen
  useEffect(() => {
    if (!heroRef.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  const activeNode = AGENT_NODES.find((node) => node.id === activeAgentId) || AGENT_NODES[0];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full overflow-hidden select-none bg-[#07190A] text-white pt-24 sm:pt-28 md:pt-32 pb-0 border-b border-[rgba(190,210,185,0.12)]"
      aria-labelledby="hero-heading"
    >
      <style>{ORBIT_CSS}</style>

      <div className="hero-grid" aria-hidden="true" />

      <div
        aria-hidden="true"
        className="absolute top-1/4 right-0 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full bg-radial from-[rgba(190,210,185,0.06)] via-[rgba(30,80,45,0.04)] to-transparent blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col justify-between min-h-[calc(100vh-100px)] lg:min-h-[760px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center pt-4 sm:pt-8 my-auto">
          {/* Left Column: Hero Copy & Actions */}
          <div className="relative z-20 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-bold tracking-[0.14em] text-[#A5B0A4] mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52D370] animate-pulse" />
              <span>ENTERPRISE AI &amp; DIGITAL SYSTEMS</span>
            </div>

            <h1
              id="hero-heading"
              className="font-urbanist font-extrabold text-white text-[38px] sm:text-[54px] md:text-[62px] lg:text-[70px] tracking-tight leading-[1.05]"
            >
              Beyond Digital.<br />
              <span className="text-[#F5F7F3]">Into Intelligent.</span>
            </h1>

            <p className="font-urbanist font-medium text-[16px] sm:text-[18px] md:text-[19px] leading-[1.6] text-white/80 my-5 sm:my-7 max-w-lg">
              Intelligent products. Connected operations.<br className="hidden sm:inline" />
              Technology built around your business.
            </p>

            <div className="flex flex-row items-center gap-3 sm:gap-4 flex-wrap">
              <button
                onClick={() => setIsContactOpen(true)}
                className="pill-btn-hero-primary shadow-lg text-[14px] min-h-[48px] px-6 sm:px-7 inline-flex items-center justify-center gap-2 font-urbanist font-bold cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-100"
              >
                Discuss your project <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="#argus"
                className="pill-btn-hero-outline shadow-md text-[14px] min-h-[48px] px-6 sm:px-7 inline-flex items-center justify-center gap-2 font-urbanist font-bold text-white border border-white/25 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                Explore Argus <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-4 mt-8 sm:mt-11 text-white/55 font-mono text-[11px] leading-relaxed">
              <span className="w-6 h-px bg-white/20 shrink-0" />
              <p>
                From strategy and design<br />
                to systems that work together.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Orbital Workflow Scene */}
          <div
            id="orbit-scene"
            data-orbit-paused={!inView}
            className="orbit-scene-container relative w-full max-w-[540px] lg:max-w-[620px] h-[480px] sm:h-[560px] lg:h-[630px] mx-auto flex items-center justify-center select-none"
            aria-label="Explore an intelligent business workflow"
            style={{
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
              transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-[15%] rounded-full bg-radial from-white/[0.08] to-transparent filter blur-3xl pointer-events-none"
            />

            {/* SVG Concentric Orbits & white dots */}
            <svg
              className="absolute w-[110%] h-[110%] -left-[5%] -top-[5%] pointer-events-none overflow-visible"
              viewBox="0 0 640 640"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="orbit-shine">
                  <stop stopColor="white" stopOpacity=".18" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="320" cy="320" r="300" fill="url(#orbit-shine)" />

              <g fill="none" stroke="white">
                <circle cx="320" cy="320" r="100" opacity=".2" />
                <circle cx="320" cy="320" r="151" opacity=".16" />
                <circle cx="320" cy="320" r="201" opacity=".12" />
                <circle cx="320" cy="320" r="252" opacity=".12" strokeDasharray="2 9" />
                <circle cx="320" cy="320" r="301" opacity=".09" />
                <path d="M0 320h640M320 0v640" opacity=".08" />
              </g>

              {/* White dots: 65s linear (same as reference.html) */}
              <g className="orbit-spin">
                <circle cx="320" cy="119" r="4" fill="white" />
                <circle cx="494" cy="421" r="3" fill="white" opacity=".8" />
                <circle cx="101" cy="194" r="3" fill="white" opacity=".6" />
              </g>

              {/* Dashed trace: 34s reverse (same as reference.html) */}
              <g className="orbit-spin-rev" fill="none" stroke="white" strokeWidth="1.5" opacity=".4">
                <circle cx="320" cy="320" r="151" strokeDasharray="70 879" />
              </g>
            </svg>

            {/* Central Core Wireframe Cube Badge */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[110px] sm:w-[136px] h-[122px] sm:h-[150px] border border-white/20 rounded-[26px] sm:rounded-[32px] bg-gradient-to-br from-white/[0.08] to-white/[0.015] backdrop-blur-md shadow-[0_25px_50px_rgba(0,0,0,0.4)] pointer-events-none z-10"
            >
              <svg viewBox="0 0 100 100" className="w-11 sm:w-14 h-11 sm:h-14 fill-none stroke-white stroke-[0.8] opacity-90">
                <path d="M50 6 88 28v44L50 94 12 72V28L50 6Z" />
                <path d="M50 25 72 38v25L50 76 28 63V38L50 25ZM12 28l38 22 38-22M50 50v44" />
              </svg>
              <span className="mt-2 sm:mt-3 text-center font-mono text-[7px] sm:text-[8px] leading-relaxed tracking-[0.15em] text-white/60 uppercase">
                INTELLIGENCE<br />IN MOTION
              </span>
            </div>

            {/* 4 Agent cards: same box, same pivot, same 65s turn as the dots */}
            <div className="orbit-field">
              <div className="orbit-rotor">
                {AGENT_NODES.map((node) => {
                  const isActive = activeAgentId === node.id;
                  const IconComponent = node.icon;

                  return (
                    <div
                      key={node.id}
                      className="absolute w-0 h-0"
                      style={{ left: `${(node.x / 640) * 100}%`, top: `${(node.y / 640) * 100}%` }}
                    >
                      {/* counter-rotation keeps the card upright */}
                      <div className="orbit-unspin absolute left-0 top-0 w-0 h-0">
                        <button
                          type="button"
                          onClick={() => setActiveAgentId(node.id)}
                          aria-pressed={isActive}
                          className={`orbit-node pointer-events-auto absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3.5 rounded-2xl text-left backdrop-blur-md transition-[border-color,background-color,box-shadow,scale] duration-200 cursor-pointer ${isActive
                            ? "border border-white/60 bg-white/[0.14] shadow-[0_12px_28px_rgba(0,0,0,0.5),0_0_16px_rgba(255,255,255,0.22)] scale-[0.88] sm:scale-105"
                            : "border border-white/15 bg-[#091c09]/90 hover:border-white/40 hover:bg-[#091c09]/95 shadow-[0_10px_24px_rgba(0,0,0,0.4)] scale-[0.82] sm:scale-100"
                            }`}
                        >
                          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shrink-0">
                            <IconComponent className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#52D370]" />
                          </div>

                          <div className="leading-tight">
                            <strong className="block text-xs sm:text-[13px] font-urbanist font-bold text-white whitespace-nowrap">
                              {node.title}
                            </strong>
                            <small className="block text-[9px] sm:text-[10px] font-mono text-white/60 mt-0.5">
                              {node.subtitle}
                            </small>
                          </div>

                          <span
                            className={`w-1.5 h-1.5 rounded-full ml-auto shrink-0 transition-all ${isActive ? "bg-white shadow-[0_0_8px_white]" : "bg-white/20"
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Workflow Readout Bar */}
            <div
              className="absolute bottom-2 sm:bottom-4 left-[4%] sm:left-[8%] right-[4%] sm:right-[6%] pt-3 sm:pt-4 border-t border-white/[0.13] flex items-start justify-between gap-4 z-20"
              aria-live="polite"
            >
              <div>
                <span className="block text-[8px] sm:text-[9px] font-mono tracking-wider text-white/45 uppercase mb-1">
                  EXPLORE THE WORKFLOW
                </span>
                <p className="max-w-[340px] sm:max-w-[380px] text-white/70 text-xs sm:text-[13px] leading-relaxed font-urbanist">
                  {activeNode.description}
                </p>
              </div>

              <span className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-wider shrink-0 mt-0.5">
                {activeNode.index}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="w-full border-t border-white/[0.13] mt-8 sm:mt-12 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4 text-white/65 text-xs font-urbanist z-10">
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] text-white/60 uppercase">
            BUILT FOR REAL OPERATIONS
          </span>

          <div className="flex items-center gap-5 sm:gap-7 text-xs font-mono text-white/70">
            <span>Products</span>
            <span className="text-white/30">/</span>
            <span>Systems</span>
            <span className="text-white/30">/</span>
            <span>Intelligence</span>
          </div>

          <a
            href="#about"
            className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-wider text-white/70 hover:text-white transition-colors"
            aria-label="Scroll to explore"
          >
            Scroll to explore <span className="text-sm">↓</span>
          </a>
        </div>
      </div>

      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Sparkles, Headphones, Cpu, ShieldCheck, ArrowRight, ArrowUpRight } from "lucide-react";
// import { AuditModal } from "./ActionModals";

// interface AgentNodeData {
//   id: "sales" | "care" | "flow" | "human";
//   title: string;
//   subtitle: string;
//   icon: React.ComponentType<{ className?: string }>;
//   description: string;
//   index: string;
//   orbitRadius: string;
//   orbitDelay: string;
// }

// const AGENT_NODES: AgentNodeData[] = [
//   {
//     id: "flow",
//     title: "Workflow Automation",
//     subtitle: "Cross-system execution",
//     icon: Cpu,
//     description: "Coordinate the next action across the business tools you already use.",
//     index: "03 / 04",
//     orbitRadius: "clamp(150px, 26vw, 215px)",
//     orbitDelay: "-11.7s",
//   },
//   {
//     id: "human",
//     title: "Human Oversight",
//     subtitle: "Audit & approvals",
//     icon: ShieldCheck,
//     description: "Keep decisions, approvals and exceptions visible to the people responsible.",
//     index: "04 / 04",
//     orbitRadius: "clamp(145px, 25vw, 205px)",
//     orbitDelay: "-24.4s",
//   },
//   {
//     id: "care",
//     title: "Customer Care",
//     subtitle: "Support & routing",
//     icon: Headphones,
//     description: "Understand a customer request and bring the right team into the conversation.",
//     index: "02 / 04",
//     orbitRadius: "clamp(140px, 24vw, 195px)",
//     orbitDelay: "-41.5s",
//   },
//   {
//     id: "sales",
//     title: "Sales Agent",
//     subtitle: "Pipeline qualification",
//     icon: Sparkles,
//     description: "Qualify an inquiry, capture context and route the next conversation.",
//     index: "01 / 04",
//     orbitRadius: "clamp(145px, 25vw, 205px)",
//     orbitDelay: "-56.0s",
//   },
// ];

// export const Hero: React.FC = () => {
//   const [isContactOpen, setIsContactOpen] = useState(false);
//   const [activeAgentId, setActiveAgentId] = useState<AgentNodeData["id"]>("sales");
//   const [parallax, setParallax] = useState({ x: 0, y: 0 });

//   const heroRef = useRef<HTMLDivElement>(null);

//   // Subtle interactive parallax over orbit scene
//   useEffect(() => {
//     const handlePointerMove = (e: MouseEvent) => {
//       if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//       if (!heroRef.current) return;

//       const rect = heroRef.current.getBoundingClientRect();
//       if (e.clientY < rect.top || e.clientY > rect.bottom) return;

//       const normX = (e.clientX - rect.left) / rect.width - 0.5;
//       const normY = (e.clientY - rect.top) / rect.height - 0.5;

//       setParallax({
//         x: Math.round(normX * 12),
//         y: Math.round(normY * 10),
//       });
//     };

//     window.addEventListener("mousemove", handlePointerMove, { passive: true });
//     return () => window.removeEventListener("mousemove", handlePointerMove);
//   }, []);

//   const activeNode = AGENT_NODES.find((node) => node.id === activeAgentId) || AGENT_NODES[0];

//   return (
//     <section
//       id="hero"
//       ref={heroRef}
//       className="relative w-full overflow-hidden select-none bg-[#07190A] text-white pt-24 sm:pt-28 md:pt-32 pb-0 border-b border-[rgba(190,210,185,0.12)]"
//       aria-labelledby="hero-heading"
//     >
//       {/* Background Technical Grid with low-opacity mask */}
//       <div className="hero-grid" aria-hidden="true" />

//       {/* Atmospheric Radial Ambient Lighting */}
//       <div
//         aria-hidden="true"
//         className="absolute top-1/4 right-0 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full bg-radial from-[rgba(190,210,185,0.06)] via-[rgba(30,80,45,0.04)] to-transparent blur-3xl pointer-events-none -z-0"
//       />

//       <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col justify-between min-h-[calc(100vh-100px)] lg:min-h-[760px]">

//         {/* Two-Column Responsive Layout matching Reference Image 1 & reference.html */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center pt-4 sm:pt-8 my-auto">

//           {/* Left Column: Hero Copy & Actions */}
//           <div className="relative z-20 max-w-xl">
//             {/* Enterprise Tag Kicker */}
//             <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-bold tracking-[0.14em] text-[#A5B0A4] mb-4 sm:mb-6">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#52D370] animate-pulse" />
//               <span>ENTERPRISE AI &amp; DIGITAL SYSTEMS</span>
//             </div>

//             {/* Main Headline */}
//             <h1
//               id="hero-heading"
//               className="font-urbanist font-extrabold text-white text-[38px] sm:text-[54px] md:text-[62px] lg:text-[70px] tracking-tight leading-[1.05]"
//             >
//               Beyond Digital.<br />
//               <span className="text-[#F5F7F3]">Into Intelligent.</span>
//             </h1>

//             {/* Supporting Summary Lead */}
//             <p className="font-urbanist font-medium text-[16px] sm:text-[18px] md:text-[19px] leading-[1.6] text-white/80 my-5 sm:my-7 max-w-lg">
//               Intelligent products. Connected operations.<br className="hidden sm:inline" />
//               Technology built around your business.
//             </p>

//             {/* Primary & Secondary Action Buttons */}
//             <div className="flex flex-row items-center gap-3 sm:gap-4 flex-wrap">
//               <button
//                 onClick={() => setIsContactOpen(true)}
//                 className="pill-btn-hero-primary shadow-lg text-[14px] min-h-[48px] px-6 sm:px-7 inline-flex items-center justify-center gap-2 font-urbanist font-bold cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-100"
//               >
//                 Discuss your project <ArrowUpRight className="w-4 h-4" />
//               </button>

//               <a
//                 href="#argus"
//                 className="pill-btn-hero-outline shadow-md text-[14px] min-h-[48px] px-6 sm:px-7 inline-flex items-center justify-center gap-2 font-urbanist font-bold text-white border border-white/25 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
//               >
//                 Explore Argus <ArrowRight className="w-4 h-4" />
//               </a>
//             </div>

//             {/* Strategy & Design Footnote */}
//             <div className="flex items-center gap-4 mt-8 sm:mt-11 text-white/55 font-mono text-[11px] leading-relaxed">
//               <span className="w-6 h-px bg-white/20 shrink-0" />
//               <p>
//                 From strategy and design<br />
//                 to systems that work together.
//               </p>
//             </div>
//           </div>

//           {/* Right Column: Interactive Orbital Workflow Scene */}
//           <div
//             id="orbit-scene"
//             className="orbit-scene-container relative w-full max-w-[540px] lg:max-w-[620px] h-[480px] sm:h-[560px] lg:h-[630px] mx-auto flex items-center justify-center select-none"
//             aria-label="Explore an intelligent business workflow"
//             style={{
//               transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
//               transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
//             }}
//           >
//             {/* Radial Inner Ambient Aura */}
//             <div
//               aria-hidden="true"
//               className="absolute inset-[15%] rounded-full bg-radial from-white/[0.08] to-transparent filter blur-3xl pointer-events-none"
//             />

//             {/* SVG Concentric Radar Orbits & Moving Satellites */}
//             <svg
//               className="absolute w-[110%] h-[110%] -left-[5%] -top-[5%] pointer-events-none overflow-visible"
//               viewBox="0 0 640 640"
//               aria-hidden="true"
//             >
//               <defs>
//                 <radialGradient id="orbit-shine">
//                   <stop stopColor="white" stopOpacity=".18" />
//                   <stop offset="1" stopColor="white" stopOpacity="0" />
//                 </radialGradient>
//               </defs>

//               {/* Center Radiant Glow */}
//               <circle cx="320" cy="320" r="300" fill="url(#orbit-shine)" />

//               {/* Technical Concentric Orbit Circles */}
//               <g fill="none" stroke="white">
//                 <circle cx="320" cy="320" r="100" opacity=".2" />
//                 <circle cx="320" cy="320" r="151" opacity=".16" />
//                 <circle cx="320" cy="320" r="201" opacity=".12" />
//                 <circle cx="320" cy="320" r="252" opacity=".12" strokeDasharray="2 9" />
//                 <circle cx="320" cy="320" r="301" opacity=".09" />
//                 <path d="M0 320h640M320 0v640" opacity=".08" />
//               </g>

//               {/* Orbiting Satellites with Smooth Turn Animation */}
//               <g className="animate-orbit-satellites">
//                 <circle cx="320" cy="119" r="4" fill="white" />
//                 <circle cx="494" cy="421" r="3" fill="white" opacity=".8" />
//                 <circle cx="101" cy="194" r="3" fill="white" opacity=".6" />
//               </g>

//               {/* Rotating Dashed Orbit Trace */}
//               <g className="animate-orbit-trace" fill="none" stroke="white" strokeWidth="1.5" opacity=".4">
//                 <circle cx="320" cy="320" r="151" strokeDasharray="70 879" />
//               </g>
//             </svg>

//             {/* Central Core Wireframe Cube Badge */}
//             <div
//               aria-hidden="true"
//               className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[110px] sm:w-[136px] h-[122px] sm:h-[150px] border border-white/20 rounded-[26px] sm:rounded-[32px] bg-gradient-to-br from-white/[0.08] to-white/[0.015] backdrop-blur-md shadow-[0_25px_50px_rgba(0,0,0,0.4)] pointer-events-none z-10"
//             >
//               <svg viewBox="0 0 100 100" className="w-11 sm:w-14 h-11 sm:h-14 fill-none stroke-white stroke-[0.8] opacity-90">
//                 <path d="M50 6 88 28v44L50 94 12 72V28L50 6Z" />
//                 <path d="M50 25 72 38v25L50 76 28 63V38L50 25ZM12 28l38 22 38-22M50 50v44" />
//               </svg>
//               <span className="mt-2 sm:mt-3 text-center font-mono text-[7px] sm:text-[8px] leading-relaxed tracking-[0.15em] text-white/60 uppercase">
//                 INTELLIGENCE<br />IN MOTION
//               </span>
//             </div>

//             {/* 4 Interactive Orbiting Agent Nodes */}
//             <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-20">
//               {AGENT_NODES.map((node) => {
//                 const isActive = activeAgentId === node.id;
//                 const IconComponent = node.icon;

//                 return (
//                   <div
//                     key={node.id}
//                     className="absolute left-0 top-0 pointer-events-none animate-orbit-card"
//                     style={{
//                       animationDelay: node.orbitDelay,
//                     }}
//                   >
//                     <div
//                       style={{
//                         transform: `translate(0, calc(-1 * ${node.orbitRadius})) translate(-50%, -50%)`,
//                       }}
//                     >
//                       <div
//                         className="animate-orbit-card-counter pointer-events-auto"
//                         style={{
//                           animationDelay: node.orbitDelay,
//                         }}
//                       >
//                         <button
//                           type="button"
//                           onClick={() => setActiveAgentId(node.id)}
//                           aria-pressed={isActive}
//                           className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3.5 rounded-2xl text-left backdrop-blur-md transition-all duration-200 cursor-pointer ${
//                             isActive
//                               ? "border border-white/60 bg-white/[0.14] shadow-[0_12px_28px_rgba(0,0,0,0.5),0_0_16px_rgba(255,255,255,0.22)] scale-105"
//                               : "border border-white/15 bg-[#091c09]/90 hover:border-white/40 hover:bg-[#091c09]/95 shadow-[0_10px_24px_rgba(0,0,0,0.4)] hover:scale-[1.02]"
//                           }`}
//                         >
//                           <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shrink-0">
//                             <IconComponent className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#52D370]" />
//                           </div>

//                           <div className="leading-tight">
//                             <strong className="block text-xs sm:text-[13px] font-urbanist font-bold text-white whitespace-nowrap">
//                               {node.title}
//                             </strong>
//                             <small className="block text-[9px] sm:text-[10px] font-mono text-white/60 mt-0.5">
//                               {node.subtitle}
//                             </small>
//                           </div>

//                           {/* Indicator Dot */}
//                           <span
//                             className={`w-1.5 h-1.5 rounded-full ml-auto shrink-0 transition-all ${
//                               isActive ? "bg-white shadow-[0_0_8px_white]" : "bg-white/20"
//                             }`}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Interactive Workflow Readout Bar at Bottom of Orbit */}
//             <div
//               className="absolute bottom-2 sm:bottom-4 left-[4%] sm:left-[8%] right-[4%] sm:right-[6%] pt-3 sm:pt-4 border-t border-white/[0.13] flex items-start justify-between gap-4 z-20"
//               aria-live="polite"
//             >
//               <div>
//                 <span className="block text-[8px] sm:text-[9px] font-mono tracking-wider text-white/45 uppercase mb-1">
//                   EXPLORE THE WORKFLOW
//                 </span>
//                 <p className="max-w-[340px] sm:max-w-[380px] text-white/70 text-xs sm:text-[13px] leading-relaxed font-urbanist">
//                   {activeNode.description}
//                 </p>
//               </div>

//               <span className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-wider shrink-0 mt-0.5">
//                 {activeNode.index}
//               </span>
//             </div>
//           </div>

//         </div>

//         {/* Hero Bottom Bar matching Reference Image 1 & reference.html */}
//         <div className="w-full border-t border-white/[0.13] mt-8 sm:mt-12 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4 text-white/65 text-xs font-urbanist z-10">
//           <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] text-white/60 uppercase">
//             BUILT FOR REAL OPERATIONS
//           </span>

//           <div className="flex items-center gap-5 sm:gap-7 text-xs font-mono text-white/70">
//             <span>Products</span>
//             <span className="text-white/30">/</span>
//             <span>Systems</span>
//             <span className="text-white/30">/</span>
//             <span>Intelligence</span>
//           </div>

//           <a
//             href="#about"
//             className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-wider text-white/70 hover:text-white transition-colors"
//             aria-label="Scroll to explore"
//           >
//             Scroll to explore <span className="text-sm">↓</span>
//           </a>
//         </div>

//       </div>

//       <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
//     </section>
//   );
// };
