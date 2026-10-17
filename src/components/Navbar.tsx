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
      <header className="fixed top-0 left-0 right-0 pt-3 sm:pt-4 md:pt-6 px-3 sm:px-4 z-50 select-none transition-all duration-300">
        <nav
          aria-label="Primary Navigation"
          className={`w-full max-w-[1240px] mx-auto h-[62px] sm:h-[68px] md:h-[76px] rounded-full px-3.5 sm:px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${
            isLight
              ? "light-sticky-nav text-[#091c09]"
              : "figma-glass-nav text-white"
          }`}
        >
          {/* Left: Authentic Brand Logo */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <a
              href="#hero"
              aria-label="PropheC AI - Home"
              className={`flex items-center group focus:outline-none focus:ring-2 rounded-full px-1 py-0.5 ${
                isLight ? "focus:ring-[#091c09]" : "focus:ring-white"
              }`}
            >
              <div className="relative h-[28px] sm:h-[32px] md:h-[36px] w-[130px] sm:w-[150px] md:w-[172px] transition-all flex items-center">
                <Image
                  src={isLight ? "/brand/prophec-logo-v2-dark.png" : "/brand/prophec-logo-v2.png"}
                  alt="PropheC AI"
                  fill
                  sizes="(max-width: 640px) 130px, 172px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className={`hidden md:flex items-center gap-7 text-[14px] font-urbanist font-semibold tracking-wide transition-colors ${
              isLight ? "text-[#091c09]/80" : "text-white/80"
            }`}>
              <a
                href="#services"
                className={`py-1 transition-colors ${
                  isLight ? "hover:text-[#091c09]" : "hover:text-white"
                }`}
              >
                Solutions
              </a>
              <a
                href="#argus"
                className={`py-1 transition-colors ${
                  isLight ? "hover:text-[#091c09]" : "hover:text-white"
                }`}
              >
                Argus
              </a>
              <a
                href="#build"
                className={`py-1 transition-colors ${
                  isLight ? "hover:text-[#091c09]" : "hover:text-white"
                }`}
              >
                What We Build
              </a>
              <a
                href="#about"
                className={`py-1 transition-colors ${
                  isLight ? "hover:text-[#091c09]" : "hover:text-white"
                }`}
              >
                About
              </a>
              <a
                href="#work"
                className={`py-1 transition-colors ${
                  isLight ? "hover:text-[#091c09]" : "hover:text-white"
                }`}
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
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 cursor-pointer ${
                isLight
                  ? "bg-[rgba(9,28,9,0.06)] hover:bg-[rgba(9,28,9,0.12)] text-[#091c09] focus:ring-[#091c09]"
                  : "bg-white/10 hover:bg-white/20 text-white focus:ring-white"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Primary Action Pill Button */}
            <button
              onClick={() => setIsContactOpen(true)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-urbanist font-bold text-xs tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer ${
                isLight
                  ? "bg-[#091c09] hover:bg-[#091c09]/90 text-white"
                  : "bg-white hover:bg-white/90 text-[#091c09]"
              }`}
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
                  ? "bg-[rgba(9,28,9,0.06)] hover:bg-[rgba(9,28,9,0.12)] text-[#091c09]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden mt-2.5 max-w-[1240px] mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 border ${
              isLight
                ? "bg-white/98 backdrop-blur-xl border-[rgba(9,28,9,0.12)] text-[#091c09] shadow-xl"
                : "bg-[#091c09]/98 backdrop-blur-xl border-white/15 text-white shadow-2xl"
            }`}
          >
            <div className="flex flex-col gap-1 font-urbanist text-[15px] sm:text-base font-semibold">
              <a
                href="#hero"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-current/5 transition-all"
              >
                Overview
              </a>
              <a
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-current/5 transition-all"
              >
                AI Ecosystem
              </a>
              <a
                href="#argus"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-current/5 transition-all"
              >
                Argus Platform
              </a>
              <a
                href="#build"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-current/5 transition-all"
              >
                What We Build
              </a>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-current/5 transition-all"
              >
                About PropheC
              </a>
              <a
                href="#work"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-current/5 transition-all"
              >
                Our Work
              </a>
            </div>

            <div className="pt-3 border-t border-current/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactOpen(true);
                }}
                className={`w-full min-h-[46px] py-2.5 sm:py-3 rounded-full font-urbanist font-bold text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                  isLight
                    ? "bg-[#091c09] text-white"
                    : "bg-white text-[#091c09]"
                }`}
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
