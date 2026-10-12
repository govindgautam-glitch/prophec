"use client";

import React, { useState } from "react";
import { 
  MonitorSmartphone, 
  Database, 
  Workflow, 
  Palette, 
  ArrowRight, 
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

export const WhatWeBuildSection: React.FC = () => {
  const [activeSector, setActiveSector] = useState(0);

  const getBuildIcon = (index: number) => {
    switch (index) {
      case 0: return <MonitorSmartphone className="w-6 h-6 text-[#03FEA7]" />;
      case 1: return <Database className="w-6 h-6 text-blue-500" />;
      case 2: return <Workflow className="w-6 h-6 text-cyan-400" />;
      default: return <Palette className="w-6 h-6 text-purple-400" />;
    }
  };

  const getSectorIcon = (name: string) => {
    switch (name) {
      case "Startups": return <Rocket className="w-4 h-4 text-[#03FEA7]" />;
      case "Growing Businesses": return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "Enterprises": return <Building2 className="w-4 h-4 text-purple-500" />;
      case "Institutions": return <Briefcase className="w-4 h-4 text-amber-500" />;
      case "Jewellery": return <Gem className="w-4 h-4 text-emerald-500" />;
      case "Hospitality": return <Hotel className="w-4 h-4 text-rose-400" />;
      default: return <Home className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div id="build" className="w-full bg-[#F3EFEA] text-[#0C1015] select-none">
      
      {/* 1. WHAT WE BUILD (4-PART EDITORIAL GRID) */}
      <section className="py-24 md:py-32 border-t border-[rgba(12,16,21,0.08)]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#0C1015]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>CAPABILITIES & ARCHITECTURE</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C1015] tracking-tight">
              What we build.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-2 font-medium">
              Comprehensive digital engineering from scalable infrastructure to custom AI agent workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHAT_WE_BUILD.map((item, idx) => (
              <div
                key={item.title}
                className="editorial-card p-8 md:p-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#08090B] flex items-center justify-center text-white shadow-xs">
                      {getBuildIcon(idx)}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#F7F5F2] border border-[#E8DFD5] text-xs font-mono font-semibold text-[#59636E]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-urbanist font-extrabold text-2xl text-[#0C1015] tracking-tight mb-2.5">
                    {item.title}
                  </h3>
                  <p className="font-urbanist text-sm md:text-base text-[#59636E] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-8 border-t border-[rgba(12,16,21,0.08)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#59636E]">Production Ready</span>
                  <div className="w-6 h-6 rounded-full bg-[#08090B] text-[#03FEA7] flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. BUSINESS VALUE & APPROACH (ONE PARTNER, EVERY LAYER) */}
      <section className="py-24 md:py-32 border-t border-[rgba(12,16,21,0.08)] bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFEA] border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#0C1015]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>CORE PRINCIPLES</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C1015] tracking-tight">
              One partner. Every layer of technology.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-3 font-medium">
              We guide businesses from concept through deployment and long-term evolutionary scaling.
            </p>
          </div>

          {/* 6 Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="p-6 md:p-7 rounded-2xl bg-[#F3EFEA] border border-[#E8DFD5] transition-all hover:border-[#0C1015]/30 hover:shadow-xs"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#03FEA7] mb-4" />
                <h3 className="font-urbanist font-bold text-lg text-[#0C1015] mb-2">
                  {p.title}
                </h3>
                <p className="font-urbanist text-xs md:text-sm text-[#59636E] leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHO WE BUILD FOR (7 SECTORS) */}
      <section className="py-24 md:py-32 border-t border-[rgba(12,16,21,0.08)]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#0C1015]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>INDUSTRY EXPERTISE</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C1015] tracking-tight">
              Built for every enterprise.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-2 font-medium">
              Purpose-built architectures calibrated for the specific workflows of each sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sectors List */}
            <div className="md:col-span-1 space-y-2">
              {SECTORS.map((sector, idx) => (
                <button
                  key={sector.name}
                  onClick={() => setActiveSector(idx)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl font-urbanist font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                    activeSector === idx
                      ? "bg-[#08090B] text-white shadow-md"
                      : "bg-white hover:bg-white/70 text-[#0C1015] border border-[#E8DFD5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getSectorIcon(sector.name)}
                    <span>{sector.name}</span>
                  </div>
                  {activeSector === idx && <ArrowRight className="w-4 h-4 text-[#03FEA7]" />}
                </button>
              ))}
            </div>

            {/* Right Active Sector Deep Dive */}
            <div className="md:col-span-2 editorial-card p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F5F2] text-xs font-mono text-[#59636E] mb-6">
                  <span>Sector Profile 0{activeSector + 1} of 07</span>
                </div>
                <h3 className="font-urbanist font-extrabold text-3xl md:text-4xl text-[#0C1015] mb-4">
                  {SECTORS[activeSector].name}
                </h3>
                <p className="font-urbanist font-medium text-lg text-[#59636E] leading-relaxed max-w-xl">
                  {SECTORS[activeSector].detail}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(12,16,21,0.08)] flex items-center gap-4 text-xs font-mono text-[#59636E]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#03FEA7]" /> Custom System Architecture
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#03FEA7]" /> Full Interoperability
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. OUR WORK (8 BRAND MARKS FROM DECK PAGE 9) */}
      <section id="work" className="py-24 md:py-32 border-t border-[rgba(12,16,21,0.08)] bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFEA] border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#0C1015]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>PROVEN COLLABORATIONS</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C1015] tracking-tight">
              Our Work.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-2 font-medium">
              Trusted by forward-thinking teams, institutions, and high-growth enterprises.
            </p>
          </div>

          {/* Quiet, Readable Logo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {OUR_WORK_CLIENTS.map((client) => (
              <div
                key={client.name}
                className="p-6 md:p-8 rounded-2xl bg-[#F3EFEA] border border-[#E8DFD5] flex flex-col items-center justify-center text-center transition-all hover:border-[#0C1015]/30 hover:bg-white shadow-2xs"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8DFD5] flex items-center justify-center text-xs font-mono font-extrabold text-[#0C1015] mb-3 shadow-2xs">
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="font-urbanist font-bold text-base text-[#0C1015]">
                  {client.name}
                </div>
                <div className="text-[11px] font-mono text-[#59636E] mt-1">
                  {client.sector}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. LEADERSHIP SECTION (DECK PAGE 10) */}
      <section className="py-24 md:py-32 border-t border-[rgba(12,16,21,0.08)]">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#0C1015]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>LEADERSHIP</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C1015] tracking-tight">
              Guided by experience.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-2 font-medium">
              Multidisciplinary leadership across engineering, strategy, growth, and design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_TEAM.map((leader) => (
              <div
                key={leader.name}
                className="editorial-card p-6 md:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#08090B] text-[#03FEA7] font-mono font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                    {leader.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="font-urbanist font-bold text-lg text-[#0C1015]">
                    {leader.name}
                  </h3>
                  <p className="font-urbanist text-xs text-[#59636E] mt-1 font-medium">
                    {leader.role}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[rgba(12,16,21,0.08)] flex items-center justify-between text-xs font-mono text-[#0C1015]/70">
                  <span>Affiliation</span>
                  <span className="font-bold text-[#08090B]">{leader.affiliation}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
