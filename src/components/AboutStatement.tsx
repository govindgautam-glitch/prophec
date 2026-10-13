"use client";

import React, { useEffect, useRef, useState } from "react";

export const AboutStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress from when top of section enters to when it leaves
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height * 0.5)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headlineWords = ["Building", "the", "systems", "behind", "modern", "businesses."];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 md:py-36 bg-[#F3EFEA] text-[#202320] border-t border-[rgba(12,16,21,0.08)] select-none overflow-hidden"
      aria-label="Who We Are - PropheC AI Introduction"
    >
      {/* 
        Oversized, Partially Cropped Mint/Yellow Background Geometry 
        Subtle scroll-linked parallax translation & rotation
      */}
      <div
        className="absolute -top-16 -right-24 md:right-8 w-[360px] md:w-[560px] h-[360px] md:h-[560px] rounded-full bg-gradient-to-br from-[#03FEA7]/20 via-[#B8EFD8]/15 to-[#F8E9A1]/10 blur-3xl pointer-events-none transition-transform duration-300 ease-out -z-0"
        style={{
          transform: `translateY(${scrollProgress * 40}px) rotate(${scrollProgress * 15}deg)`,
        }}
      />
      <div
        className="absolute top-1/2 -left-28 w-[320px] md:w-[500px] h-[320px] md:h-[500px] rounded-[70px] bg-gradient-to-tr from-[#F8E9A1]/25 via-[#03FEA7]/10 to-transparent blur-2xl pointer-events-none transition-transform duration-300 ease-out -z-0"
        style={{
          transform: `translateY(${-scrollProgress * 30}px) rotate(${12 - scrollProgress * 10}deg)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 md:px-8 z-10">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#202320]/80 shadow-2xs mb-8">
          <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
          <span>WHO WE ARE</span>
        </div>

        {/* Large Editorial Statement with Scroll-Linked Word Emphasis */}
        <h2 className="font-urbanist font-extrabold text-[32px] sm:text-[44px] md:text-[62px] lg:text-[68px] text-[#202320] tracking-tight leading-[1.08] max-w-4xl">
          {headlineWords.map((word, idx) => {
            // Sequential reveal based on scroll progress
            const wordThreshold = 0.2 + (idx / headlineWords.length) * 0.45;
            const isLit = scrollProgress >= wordThreshold;

            return (
              <span
                key={word}
                className="inline-block mr-[0.28em] transition-all duration-300 ease-out"
                style={{
                  color: isLit ? "#202320" : "rgba(32, 35, 32, 0.35)",
                  transform: isLit ? "translateY(0)" : "translateY(2px)",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Supporting Paragraph */}
        <div className="mt-8 md:mt-12 max-w-3xl space-y-5">
          <p className="font-urbanist font-semibold text-lg sm:text-xl md:text-2xl text-[#202320]/90 leading-relaxed">
            PropheC is an AI-driven technology company that helps startups, businesses, institutions and organisations turn ideas into intelligent digital products and scalable technology ecosystems.
          </p>

          <p className="font-urbanist font-medium text-base sm:text-lg md:text-xl text-[#59636E] leading-relaxed pt-2 border-t border-[rgba(12,16,21,0.08)]">
            From websites and mobile applications to AI tools, automation, dashboards, SaaS, CRM, ERP and custom software—from concept to deployment and beyond.
          </p>
        </div>

        {/* Quick Scope Indicators */}
        <div className="mt-12 pt-8 flex flex-wrap items-center gap-3">
          {[
            "AI Tools & Agents",
            "Custom ERP & CRM",
            "Web & Mobile Applications",
            "Workflow Automation",
            "Enterprise Dashboards",
          ].map((scope) => (
            <div
              key={scope}
              className="px-4 py-2 rounded-full bg-white/95 border border-[#E8DFD5] text-xs font-urbanist font-bold text-[#202320] shadow-2xs flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#03FEA7]" />
              <span>{scope}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
