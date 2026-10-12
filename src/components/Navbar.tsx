"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";
import { AuditModal, SearchModal } from "./ActionModals";

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"hero" | "light">("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 650) {
        setNavTheme("hero");
      } else {
        setNavTheme("light");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle escape key to close mobile menu
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    },
    [isMobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isLight = navTheme === "light";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 pt-4 md:pt-6 px-4 z-50 select-none transition-all duration-300">
        <nav
          aria-label="Primary Navigation"
          className={`w-full max-w-[1240px] mx-auto h-[68px] md:h-[76px] rounded-full px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${
            isLight
              ? "light-sticky-nav text-[#202320]"
              : "figma-glass-nav text-white"
          }`}
        >
          {/* Left: Authentic Brand Logo */}
          <div className="flex items-center gap-8">
            <a
              href="#hero"
              aria-label="PropheC AI - Home"
              className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#03FEA7] rounded-full px-1 py-0.5"
            >
              <div className="relative h-[34px] md:h-[38px] w-[130px] md:w-[150px] transition-all flex items-center">
                <Image
                  src={isLight ? "/brand/prophec-logo-dark.png" : "/brand/prophec-logo.png"}
                  alt="PropheC AI"
                  fill
                  sizes="150px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className={`hidden md:flex items-center gap-7 text-[14px] font-urbanist font-semibold tracking-wide transition-colors ${
              isLight ? "text-[#202320]/80" : "text-white/80"
            }`}>
              <a
                href="#services"
                className="hover:text-[#03FEA7] transition-colors py-1"
              >
                Solutions
              </a>
              <a
                href="#argus"
                className="hover:text-[#03FEA7] transition-colors py-1"
              >
                Argus
              </a>
              <a
                href="#build"
                className="hover:text-[#03FEA7] transition-colors py-1"
              >
                What We Build
              </a>
              <a
                href="#about"
                className="hover:text-[#03FEA7] transition-colors py-1"
              >
                About
              </a>
              <a
                href="#work"
                className="hover:text-[#03FEA7] transition-colors py-1"
              >
                Our Work
              </a>
            </div>
          </div>

          {/* Right: Actions & Pill Button */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search dialog"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#03FEA7] cursor-pointer ${
                isLight
                  ? "bg-black/5 hover:bg-black/10 text-[#202320]"
                  : "bg-white/5 hover:bg-white/15 text-white/90"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Primary Action Pill Button */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#03FEA7] hover:bg-[#0dffae] text-[#08090B] font-urbanist font-bold text-xs tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
            >
              Discuss your project <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isLight
                  ? "bg-black/5 hover:bg-black/10 text-[#202320]"
                  : "bg-white/5 hover:bg-white/15 text-white"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden mt-3 max-w-[1240px] mx-auto rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border ${
              isLight
                ? "bg-white/98 backdrop-blur-xl border-[#E8DFD5] text-[#202320] shadow-xl"
                : "bg-[#08090B]/98 backdrop-blur-xl border-white/10 text-white shadow-2xl"
            }`}
          >
            <div className="flex flex-col gap-3.5 font-urbanist text-base font-semibold">
              <a
                href="#hero"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#03FEA7] transition-colors"
              >
                Overview
              </a>
              <a
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#03FEA7] transition-colors"
              >
                AI Ecosystem
              </a>
              <a
                href="#argus"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#03FEA7] transition-colors"
              >
                Argus Platform
              </a>
              <a
                href="#build"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#03FEA7] transition-colors"
              >
                What We Build
              </a>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#03FEA7] transition-colors"
              >
                About PropheC
              </a>
              <a
                href="#work"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-[#03FEA7] transition-colors"
              >
                Our Work
              </a>
            </div>

            <div className="pt-4 border-t border-current/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactOpen(true);
                }}
                className="w-full py-3 rounded-full bg-[#03FEA7] text-[#08090B] font-urbanist font-bold text-sm flex items-center justify-center gap-1.5 shadow-md"
              >
                Discuss your project <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
