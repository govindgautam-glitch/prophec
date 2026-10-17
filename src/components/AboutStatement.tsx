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
      className="relative w-full py-14 sm:py-20 md:py-32 bg-white text-[#091c09] border-t border-[rgba(9,28,9,0.10)] select-none overflow-hidden"
      aria-label="Who We Are - PropheC AI Introduction"
    >
      {/* 
        Oversized, Partially Cropped Deep Green Ambient Geometry 
        Subtle scroll-linked parallax translation & rotation using approved transparency
      */}
      <div
        className="absolute -top-16 -right-24 md:right-8 w-[280px] sm:w-[360px] md:w-[560px] h-[280px] sm:h-[360px] md:h-[560px] rounded-full bg-gradient-to-br from-[rgba(9,28,9,0.04)] to-transparent blur-3xl pointer-events-none transition-transform duration-300 ease-out -z-0"
        style={{
          transform: `translateY(${scrollProgress * 40}px) rotate(${scrollProgress * 15}deg)`,
        }}
      />
      <div
        className="absolute top-1/2 -left-28 w-[260px] sm:w-[320px] md:w-[500px] h-[260px] sm:h-[320px] md:h-[500px] rounded-[70px] bg-gradient-to-tr from-[rgba(9,28,9,0.03)] to-transparent blur-2xl pointer-events-none transition-transform duration-300 ease-out -z-0"
        style={{
          transform: `translateY(${-scrollProgress * 30}px) rotate(${12 - scrollProgress * 10}deg)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-8 z-10">

        {/* Large Editorial Statement with Scroll-Linked Word Emphasis */}
        <h2 className="font-urbanist font-extrabold text-[28px] sm:text-[40px] md:text-[56px] lg:text-[66px] text-[#091c09] tracking-tight leading-[1.1] max-w-4xl">
          {headlineWords.map((word, idx) => {
            // Sequential reveal based on scroll progress
            const wordThreshold = 0.2 + (idx / headlineWords.length) * 0.45;
            const isLit = scrollProgress >= wordThreshold;

            return (
              <span
                key={word}
                className="inline-block mr-[0.24em] transition-all duration-300 ease-out"
                style={{
                  color: isLit ? "#091c09" : "rgba(9, 28, 9, 0.28)",
                  transform: isLit ? "translateY(0)" : "translateY(2px)",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Supporting Paragraph */}
        <div className="mt-6 sm:mt-8 md:mt-12 max-w-3xl space-y-4 sm:space-y-5">
          <p className="font-urbanist font-semibold text-base sm:text-lg md:text-2xl text-[#091c09]/90 leading-relaxed">
            PropheC is an AI-driven technology company helping startups, businesses, institutions, and
            organisations , custom software and scalable technology ecosystems.
          </p>

          <p className="font-urbanist font-medium text-sm sm:text-base md:text-xl text-[rgba(9,28,9,0.70)] leading-relaxed pt-3 border-t border-[rgba(9,28,9,0.10)]">
            From websites and mobile applications to AI-powered tools,business process automation,
            dashboards, SaaS platforms, CRM management, ERP, and custom software, we bring strategy, design, engineering, and
            intelligence together to build technology around real business needs.
          </p>
        </div>

        {/* Quick Scope Indicators */}
        {/* <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 flex flex-wrap items-center gap-2 sm:gap-3">
          {[
            "AI Tools & Agents",
            "Custom ERP & CRM",
            "Web & Mobile Applications",
            "Workflow Automation",
            "Enterprise Dashboards",
          ].map((scope) => (
            <div
              key={scope}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-[11px] sm:text-xs font-urbanist font-bold text-[#091c09] shadow-2xs flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#091c09]" />
              <span>{scope}</span>
            </div>
          ))}
        </div> */}

      </div>
    </section>
  );
};
