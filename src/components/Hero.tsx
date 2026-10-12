"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Headphones, Cpu, ShieldCheck, ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroArtworkRings } from "./HeroArtworkRings";
import { AuditModal } from "./ActionModals";

export const Hero: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [cardOffset, setCardOffset] = useState({
    sales: { x: 0, y: 0 },
    customer: { x: 0, y: 0 },
    workflow: { x: 0, y: 0 },
    oversight: { x: 0, y: 0 },
  });

  const heroRef = useRef<HTMLDivElement>(null);

  // Pointer parallax strictly affecting decorative elements, capped to 6px
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      setParallax({
        x: Math.round(normX * 10),
        y: Math.round(normY * 6),
      });
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  // Bounded interactive click displacement on agent cards (4-8px)
  const handleCardClick = (cardKey: keyof typeof cardOffset) => {
    setCardOffset((prev) => ({
      ...prev,
      [cardKey]: { x: (Math.random() - 0.5) * 8, y: -6 },
    }));

    setTimeout(() => {
      setCardOffset((prev) => ({
        ...prev,
        [cardKey]: { x: 0, y: 0 },
      }));
    }, 450);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full overflow-hidden select-none bg-[#08090B]"
      style={{
        background: "linear-gradient(179.26deg, #03FEA7 1.02%, #08090B 109.26%)",
        minHeight: "832px",
      }}
    >
      {/* Concentric Geometric Rings matching Figma Node 3:193 */}
      <HeroArtworkRings parallaxOffset={parallax} />

      {/* Main 1280px Container for Exact Figma Placement */}
      <div className="relative w-full max-w-[1280px] mx-auto min-h-[832px] px-4 md:px-8 pt-28 md:pt-32 pb-16 flex flex-col justify-between z-10">
        
        {/* Central Content Wrapper (Figma Node 3:471) */}
        <div className="relative mx-auto mt-6 md:mt-10 w-full max-w-[580px] text-center z-20 flex flex-col items-center">
          
          {/* Eyebrow / Brand Line from Deck */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#03FEA7]/30 text-xs font-mono font-bold text-[#03FEA7] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#03FEA7] animate-pulse" />
            <span>AI-Driven Technology & Digital Solutions</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-urbanist font-bold text-white tracking-[-2px] leading-[0.96] text-[36px] sm:text-[46px] md:text-[56px] max-w-[560px]">
            AI that runs the work behind your business.
          </h1>

          {/* Supporting Summary from Deck */}
          <p className="font-urbanist font-medium text-white/85 text-[15px] sm:text-[17px] md:text-[18.5px] leading-[1.3] max-w-[500px] mt-4 mb-8">
            AI products, business systems and automation—from concept to deployment and beyond.
          </p>

          {/* Pill CTAs Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 z-30">
            {/* Primary CTA: Discuss your project */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="pill-btn-mint shadow-lg text-[14px]"
            >
              Discuss your project <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Secondary CTA: Explore Argus → */}
            <a
              href="#argus"
              className="h-[50px] rounded-full px-7 bg-white text-[#08090B] font-urbanist font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-md transition-all hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Argus <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 
          Desktop Figma Agent Cards (Exact Coordinates in 1280px Canvas)
          Updated to deck capabilities without invented metrics:
          1. Sales Agent
          2. Customer Care
          3. Workflow Automation
          4. Human Oversight
        */}
        <div className="hidden xl:block absolute inset-0 pointer-events-none z-20">
          
          {/* 1. Sales Agent (x: 132, y: 249) */}
          <div
            onClick={() => handleCardClick("sales")}
            className="absolute figma-agent-card rounded-full px-5 py-2.5 flex items-center gap-3.5 pointer-events-auto cursor-pointer animate-drift-a"
            style={{
              left: "112px",
              top: "249px",
              transform: `translate(${cardOffset.sales.x + parallax.x * 0.4}px, ${cardOffset.sales.y + parallax.y * 0.4}px)`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#03FEA7]/20 border border-[#03FEA7]/40 flex items-center justify-center text-[#03FEA7] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-[13px] text-white">
                Sales Agent
              </div>
              <div className="font-urbanist font-medium text-[11px] text-[#03FEA7]">
                Pipeline Qualification
              </div>
            </div>
          </div>

          {/* 2. Customer Care (x: 172, y: 400) */}
          <div
            onClick={() => handleCardClick("customer")}
            className="absolute figma-agent-card rounded-full px-5 py-2.5 flex items-center gap-3.5 pointer-events-auto cursor-pointer animate-drift-b"
            style={{
              left: "152px",
              top: "400px",
              transform: `translate(${cardOffset.customer.x + parallax.x * 0.3}px, ${cardOffset.customer.y + parallax.y * 0.3}px)`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-[13px] text-white">
                Customer Care
              </div>
              <div className="font-urbanist font-medium text-[11px] text-cyan-300">
                Support & Routing
              </div>
            </div>
          </div>

          {/* 3. Workflow Automation (x: 905, y: 222) */}
          <div
            onClick={() => handleCardClick("workflow")}
            className="absolute figma-agent-card rounded-full px-5 py-2.5 flex items-center gap-3.5 pointer-events-auto cursor-pointer animate-drift-b"
            style={{
              right: "95px",
              top: "222px",
              transform: `translate(${cardOffset.workflow.x + parallax.x * 0.4}px, ${cardOffset.workflow.y + parallax.y * 0.4}px)`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-[13px] text-white">
                Workflow Automation
              </div>
              <div className="font-urbanist font-medium text-[11px] text-blue-300">
                Cross-System Execution
              </div>
            </div>
          </div>

          {/* 4. Human Oversight (x: 870, y: 386) */}
          <div
            onClick={() => handleCardClick("oversight")}
            className="absolute figma-agent-card rounded-full px-5 py-2.5 flex items-center gap-3.5 pointer-events-auto cursor-pointer animate-drift-a"
            style={{
              right: "130px",
              top: "386px",
              transform: `translate(${cardOffset.oversight.x + parallax.x * 0.3}px, ${cardOffset.oversight.y + parallax.y * 0.3}px)`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-[13px] text-white">
                Human Oversight
              </div>
              <div className="font-urbanist font-medium text-[11px] text-emerald-300">
                Audit & Approvals
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Agent Cards (<1280px) */}
        <div className="xl:hidden mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto w-full z-20">
          <div
            onClick={() => handleCardClick("sales")}
            className="figma-agent-card rounded-full px-4 py-2.5 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#03FEA7]/20 border border-[#03FEA7]/40 flex items-center justify-center text-[#03FEA7] shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-xs text-white">Sales Agent</div>
              <div className="font-urbanist text-[11px] text-[#03FEA7]">Pipeline Qualification</div>
            </div>
          </div>

          <div
            onClick={() => handleCardClick("workflow")}
            className="figma-agent-card rounded-full px-4 py-2.5 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-xs text-white">Workflow Automation</div>
              <div className="font-urbanist text-[11px] text-blue-300">Cross-System Execution</div>
            </div>
          </div>

          <div
            onClick={() => handleCardClick("customer")}
            className="figma-agent-card rounded-full px-4 py-2.5 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-xs text-white">Customer Care</div>
              <div className="font-urbanist text-[11px] text-cyan-300">Support & Routing</div>
            </div>
          </div>

          <div
            onClick={() => handleCardClick("oversight")}
            className="figma-agent-card rounded-full px-4 py-2.5 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-urbanist font-bold text-xs text-white">Human Oversight</div>
              <div className="font-urbanist text-[11px] text-emerald-300">Audit & Approvals</div>
            </div>
          </div>
        </div>

        {/* 
          Visible Next Section Transition Silhouette (Node 3:492)
          Bridges smoothly into the #F3EFEA light editorial canvas
        */}
        <div className="mt-14 w-full rounded-t-[40px] bg-[#F3EFEA] border-t border-[#E8DFD5] px-6 py-6 md:py-8 shadow-sm relative z-20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-urbanist font-bold text-[22px] md:text-[24px] text-[#0C1015] tracking-tight">
                AI Ecosystem & Enterprise Solutions
              </h2>
              <p className="text-[#59636E] text-xs sm:text-sm mt-0.5 font-urbanist font-medium">
                Turning ideas into intelligent digital products and scalable ecosystems.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {["Concept", "Architecture", "Automation", "Deployment"].map((step, idx) => (
                <div
                  key={step}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-[11px] font-mono tracking-wider text-[#0C1015]/80 shadow-2xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#03FEA7]" />
                  <span>{step}</span>
                  {idx < 3 && <span className="text-[#59636E]/40 ml-1">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};
