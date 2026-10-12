"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, ShieldCheck } from "lucide-react";
import { AuditModal } from "./ActionModals";

export const Footer: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#F3EFEA] text-[#202320] pt-20 pb-12 px-5 md:px-8 select-none border-t border-[rgba(12,16,21,0.08)]"
      aria-label="Footer"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Top Call to Action Row */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-16 border-b border-[#E8DFD5]">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold text-[#202320]/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>READY TO SCALE</span>
            </div>
            <h3 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#202320] tracking-tight">
              Build smarter. Operate better. Scale further.
            </h3>
            <p className="font-urbanist text-[#59636E] text-sm md:text-base font-medium max-w-xl">
              From websites and mobile applications to AI tools, automation, dashboards, SaaS, CRM, ERP and custom software.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="pill-btn-mint shadow-md text-[14px]"
            >
              Discuss your project <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Navigation & Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-14 border-b border-[#E8DFD5]">
          
          {/* Brand Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative w-[180px] h-[48px]">
              <Image
                src="/brand/prophec-logo-dark.png"
                alt="PropheC AI"
                fill
                sizes="180px"
                className="object-contain object-left"
              />
            </div>
            <p className="font-urbanist text-sm text-[#59636E] max-w-md leading-relaxed font-medium">
              PropheC is an AI-driven technology company that helps startups, businesses, institutions and organisations turn ideas into intelligent digital products and scalable technology ecosystems.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://x.com/prophecai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PropheC AI on X"
                className="w-10 h-10 rounded-full bg-white hover:bg-[#E8DFD5] border border-[#E8DFD5] flex items-center justify-center text-[#202320] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#03FEA7]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/prophec.ai/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PropheC AI on Instagram"
                className="w-10 h-10 rounded-full bg-white hover:bg-[#E8DFD5] border border-[#E8DFD5] flex items-center justify-center text-[#202320] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#03FEA7]"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Direct Section Links */}
          <div className="space-y-3">
            <h4 className="font-urbanist font-bold text-xs uppercase tracking-wider text-[#202320]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-urbanist font-semibold text-[#59636E]">
              <li>
                <a href="#services" className="hover:text-[#202320] transition-colors">
                  AI Ecosystem
                </a>
              </li>
              <li>
                <a href="#what-we-build" className="hover:text-[#202320] transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#argus" className="hover:text-[#202320] transition-colors">
                  Argus Orchestration
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#202320] transition-colors">
                  Who We Are
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-[#202320] transition-colors">
                  Our Work
                </a>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="space-y-4">
            <h4 className="font-urbanist font-bold text-xs uppercase tracking-wider text-[#202320]">
              Scroll
            </h4>
            <p className="text-xs font-urbanist text-[#59636E] leading-relaxed font-medium">
              Return to the top of the page.
            </p>
            <div className="pt-1">
              <button
                onClick={scrollToTop}
                aria-label="Back to top of page"
                className="w-12 h-12 rounded-full bg-white hover:bg-[#03FEA7] text-[#202320] border border-[#E8DFD5] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Oversized Brand Wordmark (Google Labs Reference Style: 80-90% width) */}
        <div className="py-14 md:py-20 flex flex-col items-center justify-center select-none overflow-hidden">
          <div className="relative w-full max-w-[880px] h-[130px] sm:h-[180px] md:h-[240px]">
            <Image
              src="/brand/prophec-logo-dark.png"
              alt="PropheC AI Brandmark"
              fill
              sizes="(max-width: 768px) 100vw, 880px"
              className="object-contain object-center opacity-85 hover:opacity-100 transition-opacity"
            />
          </div>
          <span className="font-mono text-xs text-[#59636E] tracking-widest uppercase mt-4 font-bold">
            AI-Driven Technology & Digital Solutions
          </span>
        </div>

        {/* Thin Horizontal Rule */}
        <div className="w-full h-px bg-[#E8DFD5] mb-8" />

        {/* Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-urbanist text-[#59636E]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#03FEA7]" />
            <span>© 2026 PropheC AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#hero" className="hover:text-[#202320] transition-colors">
              Privacy Policy
            </a>
            <a href="#hero" className="hover:text-[#202320] transition-colors">
              Terms of Service
            </a>
            <a href="#hero" className="hover:text-[#202320] transition-colors">
              Security Overview
            </a>
          </div>
        </div>

      </div>

      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
};
