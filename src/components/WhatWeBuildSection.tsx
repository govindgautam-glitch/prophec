"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MonitorSmartphone,
  Database,
  Workflow,
  Palette,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Building2,
  Gem,
  Hotel,
  Home,
  Rocket,
  TrendingUp,
  Briefcase
} from "lucide-react";
import {
  WHAT_WE_BUILD,
  PRINCIPLES,
  SECTORS,
  OUR_WORK_CLIENTS,
  LEADERSHIP_TEAM
} from "@/data/deckContent";
import { AuditModal } from "./ActionModals";

export const WhatWeBuildSection: React.FC = () => {
  const [activeSector, setActiveSector] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBuildIcon = (index: number) => {
    switch (index) {
      case 0: return <MonitorSmartphone className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
      case 1: return <Database className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
      case 2: return <Workflow className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
      default: return <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
    }
  };

  const getSectorIcon = (name: string, isActive: boolean) => {
    const iconClass = `w-4 h-4 ${isActive ? "text-white" : "text-[#091c09]"}`;
    switch (name) {
      case "Startups": return <Rocket className={iconClass} />;
      case "Growing Businesses": return <TrendingUp className={iconClass} />;
      case "Enterprises": return <Building2 className={iconClass} />;
      case "Institutions": return <Briefcase className={iconClass} />;
      case "Jewellery": return <Gem className={iconClass} />;
      case "Hospitality": return <Hotel className={iconClass} />;
      default: return <Home className={iconClass} />;
    }
  };

  return (
    <div id="build" className="w-full bg-white text-[#091c09] select-none">

      {/* 1. WHAT WE BUILD (4-PART EDITORIAL GRID) */}
      <section
        className="relative w-full bg-[#07190A] text-[#F5F7F3] py-16 sm:py-24 md:py-32 select-none overflow-hidden"
        style={{
          backgroundImage: `
          linear-gradient(rgba(190, 210, 185, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(190, 210, 185, 0.035) 1px, transparent 1px)
        `,
          backgroundSize: "64px 64px",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">

          <div className="max-w-2xl mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#F5F7F3] tracking-tight">
              WHAT WE BUILD
            </h2>
            <p className="font-urbanist text-[#A5B0A4] text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2 font-medium">
              One ecosystem. Multiple layers of intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {WHAT_WE_BUILD.map((item, idx) => (
              <div
                key={item.title}
                className="rounded-2xl sm:rounded-[28px] bg-[#0A1D0E]/85 backdrop-blur-md border border-[rgba(190,210,185,0.14)] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-[rgba(190,210,185,0.30)] hover:bg-[#0E2613]/90 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#B7C9B2] shadow-xs">
                      {getBuildIcon(idx)}
                    </div>
                    <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-semibold text-[#A5B0A4]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-urbanist font-extrabold text-xl sm:text-2xl text-[#F5F7F3] tracking-tight mb-2 sm:mb-2.5">
                    {item.title}
                  </h3>
                  <p className="font-urbanist text-xs sm:text-sm md:text-base text-[#A5B0A4] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. BUSINESS VALUE & APPROACH (ONE PARTNER, EVERY LAYER) */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-[rgba(9,28,9,0.10)] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight">
              One partner. Every layer of technology.
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium">
              We bring the thinking, design, engineering, and intelligence required to move from an idea to a solution that works in the real world.            </p>
          </div>

          {/* 6 Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="p-5 sm:p-6 md:p-7 rounded-2xl bg-white border border-[rgba(9,28,9,0.10)] transition-all hover:border-[rgba(9,28,9,0.30)] hover:shadow-xs"
              >
                <h3 className="font-urbanist font-bold text-base sm:text-lg text-[#091c09] mb-1.5 sm:mb-2">
                  {p.title}
                </h3>
                <p className="font-urbanist text-xs sm:text-sm text-[rgba(9,28,9,0.70)] leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHO WE BUILD FOR (7 SECTORS - REDESIGNED EDITORIAL EXPERIENCE) */}
      <section className="py-16 sm:py-24 md:py-32 border-t border-[rgba(9,28,9,0.10)] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              {/* <span className="block font-mono text-xs sm:text-sm font-semibold tracking-[0.18em] text-[#091c09]/60 uppercase mb-3 sm:mb-4">
                04 / WHO WE BUILD FOR
              </span> */}
              <h2 className="font-urbanist font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#091c09] tracking-tight leading-[1.08]">
                Technology shaped<br />around your world.
              </h2>
            </div>
            <div className="md:max-w-xs lg:max-w-sm">
              <p className="font-urbanist text-sm sm:text-base md:text-lg text-[#091c09]/70 leading-relaxed font-normal">
                Every industry has different workflows, customer expectations, and operational challenges.
                We build with those differences in mind.
              </p>
            </div>
          </div>

          {/* Two-Column Explorer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Sectors List */}
            <div className="lg:col-span-5 flex flex-col">
              {SECTORS.map((sector, idx) => {
                const isActive = activeSector === idx;
                const formattedNum = `0${idx + 1}`;
                return (
                  <button
                    key={sector.name}
                    onClick={() => setActiveSector(idx)}
                    className={`w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between transition-all duration-200 cursor-pointer group ${isActive
                        ? "rounded-xl sm:rounded-2xl bg-[#091c09] text-white shadow-md my-1"
                        : "bg-transparent hover:bg-[#091c09]/[0.025] text-[#091c09] border-b border-[#091c09]/10"
                      }`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span
                        className={`font-mono text-xs sm:text-sm tracking-wider ${isActive
                            ? "text-white/50"
                            : "text-[#091c09]/40 group-hover:text-[#091c09]/70 transition-colors"
                          }`}
                      >
                        {formattedNum}
                      </span>
                      <span
                        className={`font-urbanist text-sm sm:text-base ${isActive
                            ? "font-bold text-white"
                            : "font-medium text-[#091c09]/85 group-hover:text-[#091c09] transition-colors"
                          }`}
                      >
                        {sector.name}
                      </span>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${isActive
                          ? "text-white"
                          : "text-[#091c09]/30 group-hover:text-[#091c09]/70 group-hover:translate-x-0.5"
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Active Sector Deep Dive Card */}
            <div className="lg:col-span-7 rounded-[28px] sm:rounded-[36px] border border-[#091c09]/12 bg-[#FBFBFA] p-6 sm:p-9 md:p-12 shadow-[0_8px_32px_rgba(9,28,9,0.03)] flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Top Row: Tag & Circular Action Button */}
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-[#091c09]/50 uppercase">
                    INDUSTRY / 0{activeSector + 1}
                  </span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    aria-label={`Inquire about ${SECTORS[activeSector].name}`}
                    className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border border-[#091c09]/15 bg-white flex items-center justify-center text-[#091c09] shadow-2xs hover:border-[#091c09] hover:bg-[#091c09] hover:text-white transition-all cursor-pointer group"
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                {/* Sector Title */}
                <h3 className="font-urbanist font-extrabold text-2xl sm:text-3xl md:text-[38px] text-[#091c09] tracking-tight leading-[1.12] mb-3 sm:mb-4">
                  {SECTORS[activeSector].name}
                </h3>

                {/* Sector Detail Description */}
                <p className="font-urbanist text-sm sm:text-base text-[#091c09]/70 leading-relaxed font-normal max-w-xl mb-6 sm:mb-8">
                  {SECTORS[activeSector].detail}
                </p>

                {/* Capabilities Checklist */}
                <div className="space-y-3 mb-8 sm:mb-10">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-[#091c09]/85 font-medium font-urbanist">
                    <Check className="w-4 h-4 text-[#091c09] stroke-[2.2] shrink-0" />
                    <span>Custom System Architecture</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-[#091c09]/85 font-medium font-urbanist">
                    <Check className="w-4 h-4 text-[#091c09] stroke-[2.2] shrink-0" />
                    <span>Full Interoperability</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-[#091c09]/85 font-medium font-urbanist">
                    <Check className="w-4 h-4 text-[#091c09] stroke-[2.2] shrink-0" />
                    <span>Enterprise Data Governance &amp; Scale</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Hairline Divider + Action Link */}
              <div>
                <div className="w-full h-px bg-[#091c09]/10 mb-5 sm:mb-6" />

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-urbanist font-bold text-[#091c09] hover:text-[#091c09]/75 transition-colors cursor-pointer w-fit"
                >
                  <span>Discuss a {SECTORS[activeSector].name.toLowerCase()} project</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. OUR WORK (8 BRAND MARKS FROM DECK PAGE 9) */}
      {/* <section id="work" className="py-14 sm:py-20 md:py-28 border-t border-[rgba(9,28,9,0.10)] bg-white"> */}
      <section id="work" className="relative w-full bg-[#07190A] text-[#F5F7F3] py-16 sm:py-24 md:py-32 select-none overflow-hidden"
        style={{
          backgroundImage: `
          linear-gradient(rgba(190, 210, 185, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(190, 210, 185, 0.035) 1px, transparent 1px)
        `,
          backgroundSize: "64px 64px",
        }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-bold tracking-[0.14em] text-[#A5B0A4] mb-2.5 sm:mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7C9B2]" />
              <span>PROVEN COLLABORATIONS</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#F5F7F3] tracking-tight">
              Our Work.
            </h2>
            <p className="font-urbanist text-[#A5B0A4] text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2 font-medium">
              Trusted by forward-thinking teams, institutions, and high-growth enterprises.
            </p>
          </div>

          {/* Dark Translucent Client Logo Grid with Elevated Logo Showcase Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {OUR_WORK_CLIENTS.map((client) => {
              const clientLogoMap: Record<string, string> = {
                "Hobnob Realtech": "/logos/hobnob.png",
                "Innovher": "/logos/innovher.png",
                "Alliance for Political Intelligence": "/logos/api.png",
                "Bharat Ventures": "/logos/bharat.png",
                "Cityvibes": "/logos/cityvibes.png",
                "AllSoll": "/logos/allsoll.png",
                "IDEA IND": "/logos/idea.png",
                "FAIR Stay": "/logos/fair.png",
              };
              const logoSrc = clientLogoMap[client.name];

              return (
                <div
                  key={client.name}
                  className="group relative rounded-2xl sm:rounded-3xl bg-[#0A1D0E]/85 backdrop-blur-md border border-[rgba(190,210,185,0.16)] p-6 sm:p-7 flex flex-col items-center text-center justify-between transition-all duration-300 hover:border-[rgba(190,210,185,0.38)] hover:bg-[#0E2813] hover:-translate-y-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]"
                >
                  {/* Subtle Ambient Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-radial from-[rgba(190,210,185,0.06)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Elegant Dedicated Logo Showcase Tile */}
                  <div className="w-full max-w-[200px] h-24 sm:h-28 rounded-2xl bg-white px-5 py-3.5 flex items-center justify-center shadow-[0_6px_24px_rgba(0,0,0,0.28)] border border-white/80 mb-5 group-hover:scale-105 transition-transform duration-300 relative z-10 shrink-0">
                    {logoSrc ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={logoSrc}
                          alt={`${client.name} logo`}
                          fill
                          sizes="(max-width: 640px) 180px, 200px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xl font-mono font-extrabold text-[#07190A]">
                        {client.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Company Name and Sector Information */}
                  <div className="flex flex-col items-center text-center w-full relative z-10">
                    <h3 className="font-urbanist font-extrabold text-base sm:text-lg text-[#F5F7F3] leading-snug group-hover:text-white transition-colors mb-2 min-h-[46px] flex items-center justify-center text-balance">
                      {client.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.14] text-[11px] font-mono font-semibold tracking-wider text-[#C5D6C1] uppercase group-hover:bg-white/[0.10] group-hover:text-white transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#52D370] shrink-0" />
                      <span>{client.sector}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. LEADERSHIP SECTION (DECK PAGE 10) */}
      <section className="py-14 sm:py-20 md:py-28 border-t border-[rgba(9,28,9,0.10)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#091c09] shadow-2xs mb-2.5 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#091c09]" />
              <span>LEADERSHIP</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight">
              Guided by experience. Built around possibility.
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2 font-medium">
              A team bringing together technology, strategic thinking, and execution to build what businesses need next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {LEADERSHIP_TEAM.map((leader) => (
              <div
                key={leader.name}
                className="editorial-card p-5 sm:p-6 md:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#091c09] text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center mb-3 sm:mb-5 shadow-xs">
                    {leader.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="font-urbanist font-bold text-base sm:text-lg text-[#091c09]">
                    {leader.name}
                  </h3>
                  <p className="font-urbanist text-xs text-[rgba(9,28,9,0.70)] mt-0.5 sm:mt-1 font-medium">
                    {leader.role}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-[rgba(9,28,9,0.10)] flex items-center justify-between text-[11px] sm:text-xs font-mono text-[#091c09]/70">
                  <span>Affiliation</span>
                  <span className="font-bold text-[#091c09]">{leader.affiliation}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Inquiry & Project Discussion Modal */}
      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
};
