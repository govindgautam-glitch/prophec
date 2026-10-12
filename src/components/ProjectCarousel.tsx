"use client";

import React, { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Cpu, Layers, ArrowUpRight, Workflow, BarChart3, Bot, Network } from "lucide-react";
import { AI_ECOSYSTEM_SERVICES, ServiceItem } from "@/data/deckContent";
import { AuditModal } from "./ActionModals";

export const ProjectCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const services = AI_ECOSYSTEM_SERVICES;
  const totalSlots = services.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalSlots - 1 ? prev + 1 : prev));
  }, [totalSlots]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const activeIndex = Math.min(currentIndex, Math.max(0, totalSlots - 1));

  // Render authored SVG artwork for each service type
  const renderServiceArtwork = (item: ServiceItem) => {
    switch (item.iconType) {
      case "applications":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center mb-3">
              <Layers className="w-8 h-8 text-[#03FEA7]" />
            </div>
            {/* Modular interlocking graphic */}
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="w-3 h-3 rounded-md bg-[#03FEA7]" />
              <span className="w-8 h-3 rounded-md bg-[#0C1015]/20" />
              <span className="w-4 h-3 rounded-md bg-[#0C1015]/10" />
            </div>
          </div>
        );
      case "agents":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center mb-3">
              <Bot className="w-8 h-8 text-cyan-400" />
            </div>
            {/* Interactive node pulse */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#0C1015]/60">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Qualify • Assist • Execute</span>
            </div>
          </div>
        );
      case "automation":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center mb-3">
              <Workflow className="w-8 h-8 text-blue-500" />
            </div>
            {/* Pipeline loop */}
            <div className="flex items-center gap-2 opacity-60">
              <div className="h-1.5 w-12 bg-blue-500/40 rounded-full" />
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="h-1.5 w-12 bg-blue-500/40 rounded-full" />
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8 text-amber-500" />
            </div>
            {/* Data trend bar */}
            <div className="flex items-end gap-1.5 h-6">
              <div className="w-2 h-3 bg-[#0C1015]/20 rounded-t" />
              <div className="w-2 h-4 bg-[#0C1015]/30 rounded-t" />
              <div className="w-2 h-6 bg-amber-500 rounded-t" />
              <div className="w-2 h-5 bg-[#0C1015]/40 rounded-t" />
            </div>
          </div>
        );
      case "systems":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center mb-3">
              <Network className="w-8 h-8 text-purple-500" />
            </div>
            {/* Embedded integration nexus */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#0C1015]/60">
              <span>CRM</span>
              <span>↔</span>
              <span className="font-bold text-[#08090B]">AI Nexus</span>
              <span>↔</span>
              <span>ERP</span>
            </div>
          </div>
        );
      case "custom":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center mb-3">
              <Cpu className="w-8 h-8 text-[#03FEA7]" />
            </div>
            {/* Bespoke tailored constellation */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <div className="w-8 h-px bg-[#03FEA7]" />
              <span className="w-2 h-2 rounded-full bg-[#0C1015]" />
              <div className="w-8 h-px bg-[#03FEA7]" />
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="services"
      className="relative w-full py-24 md:py-32 bg-[#F3EFEA] text-[#202320] select-none overflow-hidden"
      aria-label="Our AI Ecosystem Services Carousel"
    >
      {/* Oversized background decorative geometry */}
      <div className="absolute top-10 -left-28 w-[400px] h-[400px] rounded-full bg-[#03FEA7]/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 -right-28 w-[380px] h-[380px] rounded-[60px] bg-[#F8E9A1]/15 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#0C1015]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>OUR AI ECOSYSTEM</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C1015] tracking-tight">
              AI, built around your business.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-2 max-w-xl font-medium">
              We identify where intelligence can create actual business value.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold text-[#0C1015]/70 shadow-2xs">
            <span>0{activeIndex + 1}</span>
            <span className="text-[#59636E]/40">/</span>
            <span>0{totalSlots}</span>
          </div>
        </div>

        {/* Carousel Stage Container with Keyboard Focus & Touch Swipe */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="AI Ecosystem Service Carousel"
          className="relative w-full h-[520px] md:h-[560px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#03FEA7]/50 rounded-3xl"
        >
          <div className="relative w-full max-w-[360px] md:max-w-[380px] h-[480px]">
            {services.map((item, index) => {
              const offset = index - activeIndex;
              const isCenter = offset === 0;

              // Geometric spatial fanning calculation
              let translateX = 0;
              let rotateDeg = 0;
              let scale = 1;
              let zIndex = 10;
              let opacity = 1;
              let isVisible = true;

              if (offset === 0) {
                translateX = 0;
                rotateDeg = 0;
                scale = 1;
                zIndex = 30;
                opacity = 1;
              } else if (offset === -1) {
                translateX = -270;
                rotateDeg = -5;
                scale = 0.94;
                zIndex = 20;
                opacity = 0.88;
              } else if (offset === 1) {
                translateX = 270;
                rotateDeg = 5;
                scale = 0.94;
                zIndex = 20;
                opacity = 0.88;
              } else if (offset === -2) {
                translateX = -460;
                rotateDeg = -9;
                scale = 0.88;
                zIndex = 10;
                opacity = 0.45;
              } else if (offset === 2) {
                translateX = 460;
                rotateDeg = 9;
                scale = 0.88;
                zIndex = 10;
                opacity = 0.45;
              } else {
                translateX = offset > 0 ? 600 : -600;
                rotateDeg = offset > 0 ? 12 : -12;
                scale = 0.8;
                zIndex = 5;
                opacity = 0;
                isVisible = false;
              }

              return (
                /* Nested Wrapper 1: Positional Transform */
                <div
                  key={item.id}
                  className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    zIndex,
                    pointerEvents: isVisible && (isCenter || Math.abs(offset) === 1) ? "auto" : "none",
                  }}
                >
                  {/* Nested Wrapper 2: Rotation & Scale Transform */}
                  <div
                    onClick={() => {
                      if (!isCenter) setCurrentIndex(index);
                    }}
                    className="w-full h-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer"
                    style={{
                      transform: `rotate(${rotateDeg}deg) scale(${scale})`,
                      opacity,
                    }}
                  >
                    {/* Nested Wrapper 3: Physical White Rounded Editorial Card */}
                    <div className="editorial-card w-full h-full p-6 md:p-7 flex flex-col justify-between select-none">
                      
                      {/* Inset Approximately Square Neutral Media Region */}
                      <div className="w-full aspect-[4/3] rounded-[22px] bg-[#F7F5F2] border border-[#E8DFD5] flex flex-col items-center justify-center relative overflow-hidden group">
                        {renderServiceArtwork(item)}

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#E8DFD5] text-[10px] font-mono font-bold text-[#0C1015]/80">
                            {item.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#08090B] text-white text-[10px] font-mono font-bold">
                            {item.badge}
                          </span>
                        </div>
                      </div>

                      {/* Content Area: Left-aligned with clear hierarchy */}
                      <div className="pt-5 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="font-urbanist font-extrabold text-xl md:text-2xl text-[#0C1015] tracking-tight">
                            {item.title}
                          </h3>
                          <p className="font-urbanist font-medium text-xs md:text-sm text-[#59636E] mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Action Link Area */}
                        <div className="pt-5 flex items-center justify-between border-t border-[rgba(12,16,21,0.08)] mt-auto">
                          <span className="text-[11px] font-mono text-[#59636E]">
                            Enterprise Service
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08090B] hover:bg-[#1a202c] text-white text-xs font-urbanist font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            Inquire <ArrowUpRight className="w-3.5 h-3.5 text-[#03FEA7]" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular Controls Below */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous service"
            className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#03FEA7]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] shadow-2xs">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to service ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex
                    ? "w-6 bg-[#08090B]"
                    : "bg-[#E8DFD5] hover:bg-[#59636E]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === totalSlots - 1}
            aria-label="Next service"
            className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#03FEA7]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
