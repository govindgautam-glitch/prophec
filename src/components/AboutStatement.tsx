"use client";

import React, { useEffect, useRef, useState } from "react";
import { AmbientBackgroundDecor } from "./AmbientBackgroundDecor";

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
      <AmbientBackgroundDecor />

      <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 z-10">

        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#091c09] shadow-2xs mb-4 sm:mb-6">
          {/* <span className="w-2 h-2 rounded-full bg-[#02D15D]" /> */}
          <span>WHO WE ARE</span>
        </div>

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
            PropheC is an AI-driven technology company helping startups, businesses, institutions, and organisations turn ideas into intelligent digital products, custom software, and scalable technology ecosystems.
          </p>

          <p className="font-urbanist font-medium text-sm sm:text-base md:text-xl text-[rgba(9,28,9,0.70)] leading-relaxed pt-3 border-t border-[rgba(9,28,9,0.10)]">
            From websites and mobile applications to AI-powered tools, business process automation, dashboards, SaaS platforms, CRM management, ERP, and custom software, we bring strategy, design, engineering, and intelligence together to build technology around real business needs.
          </p>

          <p className="font-urbanist font-semibold text-sm sm:text-base md:text-lg text-[#0b7a34] tracking-wide">
            From concept to deployment and beyond.
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
