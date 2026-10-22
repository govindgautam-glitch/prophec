"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MonitorSmartphone,
  Database,
  Workflow,
  Palette,
} from "lucide-react";
import {
  WHAT_WE_BUILD,
  PRINCIPLES,
  SECTORS,
  OUR_WORK_CLIENTS,
  LEADERSHIP_TEAM,
} from "@/data/deckContent";
import { IndustryTabs } from "@/prophec/IndustryTabs";
import type { IndustriesContent } from "@/prophec/types";
import { AuditModal } from "./ActionModals";
import { AmbientBackgroundDecor } from "./AmbientBackgroundDecor";

export const WhatWeBuildSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBuildIcon = (index: number) => {
    switch (index) {
      case 0:
        return <MonitorSmartphone className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
      case 1:
        return <Database className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
      case 2:
        return <Workflow className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
      default:
        return <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-[#B7C9B2]" />;
    }
  };

  const industriesContent: IndustriesContent = {
    eyebrow: "INDUSTRIES WE EMPOWER",
    heading: (
      <>
        Technology shaped
        <br />
        around your world.
      </>
    ),
    description: (
      <>
        Every industry has different workflows, customer expectations, and operational challenges. We build with those differences in mind.
      </>
    ),
    tabListLabel: "Choose your industry",
    panelLabel: "Industry",
    flowLabel: "Illustrative delivery approach",
    items: [
      {
        id: "sector-0",
        name: "Startups",
        title: "From the first idea to the next stage.",
        description:
          SECTORS[0]?.detail ||
          "Idea validation, MVP architecture, and rapid market scaling.",
        outcomes: [
          "Product discovery & MVP planning",
          "Web and mobile experiences",
          "Connected product foundations",
        ],
        flow: ["Idea", "Product", "Growth"],
        action: {
          label: "Discuss a startup project",
          onClick: () => setIsModalOpen(true),
        },
      },
      {
        id: "sector-1",
        name: "Growing Businesses",
        title: "Build beyond the workarounds.",
        description:
          SECTORS[1]?.detail ||
          "Modernised operations, custom dashboards, and workflow infrastructure.",
        outcomes: [
          "Custom CRM & operations tools",
          "Workflow automation",
          "Reporting and business visibility",
        ],
        flow: ["Processes", "Systems", "Visibility"],
        action: {
          label: "Discuss your next stage",
          onClick: () => setIsModalOpen(true),
        },
      },
      {
        id: "sector-2",
        name: "Enterprises",
        title: "Intelligence across the organisation.",
        description:
          SECTORS[2]?.detail ||
          "Custom platforms, multi-system integration, and automated governance.",
        outcomes: [
          "Enterprise system architecture",
          "Intelligent workflows & integrations",
          "Governance and approval journeys",
        ],
        flow: ["Systems", "Intelligence", "Oversight"],
        action: {
          label: "Discuss an enterprise project",
          onClick: () => setIsModalOpen(true),
        },
      },
      // {
      //   id: "sector-3",
      //   name: "Institutions",
      //   title: "Make complex services feel simple.",
      //   description:
      //     SECTORS[3]?.detail ||
      //     "Centralised management dashboards, reporting portals, and secure portals.",
      //   outcomes: [
      //     "Service portals and applications",
      //     "Administrative workflow tools",
      //     "Connected records and dashboards",
      //   ],
      //   flow: ["People", "Services", "Operations"],
      //   action: {
      //     label: "Discuss an institutional project",
      //     onClick: () => setIsModalOpen(true),
      //   },
      // },
      // {
      //   id: "sector-4",
      //   name: "Jewellery",
      //   title: "Connect craft with commerce.",
      //   description:
      //     SECTORS[4]?.detail ||
      //     "Personalised customer software, inventory tracking, and native integrations.",
      //   outcomes: [
      //     "Digital catalogue experiences",
      //     "Customer and inquiry management",
      //     "Inventory and operational workflows",
      //   ],
      //   flow: ["Collections", "Customers", "Operations"],
      //   action: {
      //     label: "Discuss a jewellery project",
      //     onClick: () => setIsModalOpen(true),
      //   },
      // },
      // {
      //   id: "sector-5",
      //   name: "Hospitality",
      //   title: "A more connected guest journey.",
      //   description:
      //     SECTORS[5]?.detail ||
      //     "Bespoke reservation architecture and unified guest service ecosystems.",
      //   outcomes: [
      //     "Guest and property experiences",
      //     "Inquiry and service workflows",
      //     "Operational dashboards",
      //   ],
      //   flow: ["Guests", "Service", "Operations"],
      //   action: {
      //     label: "Discuss a hospitality project",
      //     onClick: () => setIsModalOpen(true),
      //   },
      // },
      // {
      //   id: "sector-6",
      //   name: "Real Estate",
      //   title: "Move from inquiry to opportunity.",
      //   description:
      //     SECTORS[6]?.detail ||
      //     "Purpose-built property platforms, lead routing, and transaction interoperability.",
      //   outcomes: [
      //     "Property discovery platforms",
      //     "Lead qualification and CRM",
      //     "Sales and follow-up workflows",
      //   ],
      //   flow: ["Discovery", "Inquiry", "Follow-up"],
      //   action: {
      //     label: "Discuss a real estate project",
      //     onClick: () => setIsModalOpen(true),
      //   },
      // },
    ],
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
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 relative z-10">
          <div className="max-w-2xl mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#A5B0A4] mb-3">
              {/* <span className="w-2 h-2 rounded-full bg-[#52D370]" /> */}
              <span>CAPABILITIES AND ARCHITECTURE</span>
            </div>
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
                    <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-semibold text-[#ffffff]">
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
      <section className="relative py-14 sm:py-20 md:py-28 border-t border-[rgba(9,28,9,0.10)] bg-white overflow-hidden">
        <AmbientBackgroundDecor variant="alternate" />
        <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 z-10">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#091c09] shadow-2xs mb-3">
              {/* <span className="w-2 h-2 rounded-full bg-[#02D15D]" /> */}
              <span>WHY PROPHEC</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight">
              One partner. Every layer of technology.
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium">
              We bring the thinking, design, engineering, and intelligence required to move from an idea to a solution that works in the real world.
            </p>
          </div>

          {/* 6 Principles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* 3. WHO WE BUILD FOR (INDUSTRY TABS SECTION) */}
      <IndustryTabs id="industries" content={industriesContent} />

      {/* 4. OUR WORK (8 BRAND MARKS FROM DECK PAGE 9) */}
      <section
        id="work"
        className="relative w-full bg-[#07190A] text-[#F5F7F3] py-16 sm:py-24 md:py-32 select-none overflow-hidden"
        style={{
          backgroundImage: `
          linear-gradient(rgba(190, 210, 185, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(190, 210, 185, 0.035) 1px, transparent 1px)
        `,
          backgroundSize: "64px 64px",
        }}
      >
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#A5B0A4] mb-3">
              {/* <span className="w-2 h-2 rounded-full bg-[#52D370]" /> */}
              <span>OUR WORK</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#F5F7F3] tracking-tight">
              Built around real business needs.
            </h2>
            <p className="font-urbanist text-[#A5B0A4] text-sm sm:text-base md:text-lg mt-1.5 sm:mt-2 font-medium">
              Every business has a different challenge. Our work brings technology, digital experiences, and intelligent systems closer to the needs of the people and organisations using them.
            </p>
          </div>

          {/* Dark Translucent Client Logo Grid with Elevated Logo Showcase Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {OUR_WORK_CLIENTS.map((client) => {
              const clientLogoMap: Record<string, string> = {
                "HobNob Realtech": "/logos/hobnob.png",
                "InnovHer": "/logos/innovher.png",
                "Alliance for Political Intelligence (API)": "/logos/api.png",
                "Bharat Ventures": "/logos/bharat.png",
                "CityVibes": "/logos/cityvibes.png",
                "Allsoll": "/logos/allsoll.png",
                "IdeaIndia": "/logos/idea.png",
                "FairStay": "/logos/fair.png",
                "Hobnob Realtech": "/logos/hobnob.png",
                "Innovher": "/logos/innovher.png",
                "Alliance for Political Intelligence": "/logos/api.png",
                "Cityvibes": "/logos/cityvibes.png",
                "AllSoll": "/logos/allsoll.png",
                "IDEA IND": "/logos/idea.png",
                "FAIR Stay": "/logos/fair.png",
              };

              const clientSlugMap: Record<string, string> = {
                "HobNob Realtech": "hobnob",
                "Hobnob Realtech": "hobnob",
                "InnovHer": "innovher",
                "Innovher": "innovher",
                "Alliance for Political Intelligence (API)": "api",
                "Alliance for Political Intelligence": "api",
                "Bharat Ventures": "bv",
                "CityVibes": "cityvibes",
                "Cityvibes": "cityvibes",
                "Allsoll": "allsoll",
                "AllSoll": "allsoll",
                "IdeaIndia": "ideaindia",
                "IDEA IND": "ideaindia",
                "FairStay": "fairstay",
                "FAIR Stay": "fairstay",
              };

              const logoSrc = clientLogoMap[client.name];
              const slug = clientSlugMap[client.name] || "hobnob";

              return (
                <Link
                  key={client.name}
                  href={`/work/${slug}`}
                  className="group relative rounded-2xl sm:rounded-3xl bg-[#0A1D0E]/85 backdrop-blur-md border border-[rgba(190,210,185,0.16)] p-6 sm:p-7 flex flex-col items-center text-center justify-between transition-all duration-300 hover:border-[#52D370]/60 hover:bg-[#0E2813] hover:-translate-y-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] cursor-pointer"
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
                      <span>{client.sector}</span>
                    </div>

                    {/* <div className="mt-3.5 inline-flex items-center gap-1 text-xs font-mono text-[#52D370] opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>View Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div> */}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP SECTION (DECK PAGE 10) */}
      <section className="relative w-full py-16 sm:py-24 md:py-32 border-t border-[rgba(9,28,9,0.08)] bg-white overflow-hidden">
        <AmbientBackgroundDecor />

        <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#091c09] shadow-2xs mb-3">
              {/* <span className="w-2 h-2 rounded-full bg-[#091c09]" /> */}
              <span>LEADERSHIP</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#091c09] tracking-tight leading-[1.12]">
              Guided by experience. Built around possibility.
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm sm:text-base md:text-lg mt-2 sm:mt-3 font-medium">
              A team bringing together technology, strategic thinking, and execution to build what businesses need next.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {LEADERSHIP_TEAM.map((leader) => {
              const photos: Record<string, string> = {
                "Aditya Mittal": "/Aditya.webp",
                "Nikhil Kumar": "/Nikhil.webp",
                "Kartik Choudhary": "/Kartik.webp",
                "Tanishka Patel": "/Tanishka.webp",
              };
              const photoSrc = photos[leader.name];

              return (
                <div
                  key={leader.name}
                  className="relative rounded-[28px] sm:rounded-[32px] bg-white border border-[rgba(9,28,9,0.08)] p-4 sm:p-6 shadow-[0_12px_36px_-12px_rgba(9,28,9,0.07)] hover:shadow-[0_22px_45px_-12px_rgba(9,28,9,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Portrait Frame with Alternating Squircle vs Circle */}
                    <div
                      className={`relative w-full aspect-square max-w-[210px] mx-auto mb-5 overflow-hidden shadow-xs border border-black/5 bg-[#F2F4F1]`}
                    >
                      {photoSrc ? (
                        <Image
                          src={photoSrc}
                          alt={leader.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono font-bold text-lg text-[#091c09]">
                          {leader.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                    </div>

                    <h3 className="font-urbanist font-extrabold text-lg sm:text-xl text-[#091c09] tracking-tight">
                      {leader.name}
                    </h3>
                    <p className="font-urbanist text-xs sm:text-[13px] text-[rgba(9,28,9,0.65)] mt-1 font-medium leading-relaxed">
                      {leader.role}
                    </p>

                    {/* Green Accent Line matching Image 2 */}
                    <div className="w-10 h-[2.5px] bg-[#52D370] mt-3.5 mb-5 rounded-full" />
                  </div>

                  <div className="pt-3.5 border-t border-[rgba(9,28,9,0.08)] flex items-center justify-between text-[11px] sm:text-xs font-mono">
                    <span className="text-[rgba(9,28,9,0.55)]">Affiliation</span>
                    <span className="font-bold text-[#091c09] tracking-wide">{leader.affiliation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inquiry & Project Discussion Modal */}
      <AuditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
