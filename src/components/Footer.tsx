"use client";

import React, { useState } from "react";
import { AuditModal } from "./ActionModals";
import { AmbientBackgroundDecor } from "./AmbientBackgroundDecor";

interface TopNavItem {
  label: string;
  href: string;
}

const TOP_NAV_ITEMS: TopNavItem[] = [
  { label: "Prophec AI", href: "#hero" },
  { label: "Technology", href: "#argus" },
  { label: "Solutions", href: "#services" },
  { label: "About Us", href: "#about" },
];

export const Footer: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#F3F0EB] text-[#202124] border-t border-[#202124]/10 select-none overflow-hidden transition-colors duration-300"
      aria-label="Footer"
    >
      <AmbientBackgroundDecor variant="subtle" />
      <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 pt-14 sm:pt-20 md:pt-24 pb-14 sm:pb-20 z-10">

        {/* Top Navigation Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 pb-14 sm:pb-20 md:pb-28">
          <div className="font-urbanist text-[15px] sm:text-[16px] font-normal text-[#202124] tracking-normal">
            Other teams and product areas
          </div>

          <nav
            aria-label="Other teams and product areas"
            className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14"
          >
            {TOP_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-urbanist text-[15px] sm:text-[16px] font-normal text-[#5f6368] hover:text-[#202124] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Oversized Brand Typography */}
        <div className="overflow-hidden">
          <h2
            className="font-urbanist font-bold text-[#202124] tracking-[-0.04em] leading-[0.84] text-left select-none text-[clamp(3.2rem,13vw,14rem)]"
            style={{
              wordBreak: "break-word",
            }}
          >
            PropheC Ai
          </h2>
        </div>

        {/* Thin Horizontal Divider */}
        <div
          className="w-full h-px bg-[#202124]/20 mt-8 sm:mt-12 md:mt-14 mb-8 sm:mb-10 md:mb-12"
          role="separator"
          aria-hidden="true"
        />

        {/* Bottom Footer Navigation — Semantic Responsive Grid (2-cols mobile, 5-cols desktop) */}
        <nav
          aria-label="Footer Navigation"
          className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-6 md:gap-4 items-start pt-2 text-[12px] sm:text-[13px]"
        >
          {/* Column 1: Brand Identifier */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="#hero"
              aria-label="Prophec AI Home"
              className="font-urbanist font-bold text-[18px] sm:text-[20px] text-[#202124] tracking-tight hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm"
            >
              Prophec AI
            </a>
          </div>

          {/* Column 2: About Prophec AI */}
          <div className="col-span-1">
            <a
              href="#about"
              className="font-urbanist font-semibold uppercase tracking-[0.07em] text-[#5f6368] hover:text-[#202124] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm py-1 inline-block"
            >
              ABOUT PROPHEC AI
            </a>
          </div>

          {/* Column 3: Products & Solutions + Support */}
          <div className="col-span-1 flex flex-col items-start gap-2 sm:gap-2.5">
            <a
              href="#services"
              className="font-urbanist font-semibold uppercase tracking-[0.07em] text-[#5f6368] hover:text-[#202124] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm py-1 inline-block"
            >
              PRODUCTS &amp; SOLUTIONS
            </a>
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="text-left font-urbanist font-semibold uppercase tracking-[0.07em] text-[#5f6368] hover:text-[#202124] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm py-1"
            >
              SUPPORT
            </button>
          </div>

          {/* Column 4: Privacy */}
          <div className="col-span-1">
            <a
              href="#hero"
              className="font-urbanist font-semibold uppercase tracking-[0.07em] text-[#5f6368] hover:text-[#202124] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm py-1 inline-block"
            >
              PRIVACY
            </a>
          </div>

          {/* Column 5: Terms (Right-aligned on desktop) */}
          <div className="col-span-1 md:text-right">
            <a
              href="#hero"
              className="font-urbanist font-semibold uppercase tracking-[0.07em] text-[#5f6368] hover:text-[#202124] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202124] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0EB] rounded-sm py-1 inline-block"
            >
              TERMS
            </a>
          </div>
        </nav>

      </div>

      {/* Audit & Consultation Modal */}
      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
};
