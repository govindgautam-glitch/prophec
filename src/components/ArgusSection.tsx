"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Mail,
  Database,
  Receipt,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  Bot,
  Wrench,
  Workflow,
  Sparkles
} from "lucide-react";
import { ARGUS_CAPABILITIES } from "@/data/deckContent";
import { AuditModal } from "./ActionModals";

export const ArgusSection: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<"whatsapp" | "email" | "crm" | "accounting">("whatsapp");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const integrationNodes = [
    {
      id: "whatsapp" as const,
      name: "WhatsApp",
      label: "Direct Messaging",
      tagline: "A conversation. A connected next step.",
      icon: MessageSquare,
      workflow: "Lead sends inquiry on WhatsApp → Argus parses intent, checks product availability, answers queries in real time, and logs conversation into CRM.",
      capabilities: [
        "Receive & interpret incoming customer inquiry",
        "Understand intent & qualify sales readiness",
        "Query live product catalog & pricing guidelines",
        "Auto-update CRM record & trigger team notifications",
      ],
    },
    {
      id: "email" as const,
      name: "Email",
      label: "Inbox Dispatch",
      tagline: "Contextual triage. Instant responses.",
      icon: Mail,
      workflow: "Inbound client RFQ arrives → Argus triages priority, drafts contextual proposal grounded in pricing guidelines, and prompts human approval before dispatch.",
      capabilities: [
        "Semantic Triage & VIP client prioritization",
        "Draft contextual responses & quote proposals",
        "Extract & parse RFQ attachment documents",
        "Escalate complex requests with executive alerts",
      ],
    },
    {
      id: "crm" as const,
      name: "CRM",
      label: "Pipeline Sync",
      tagline: "Zero manual re-entry across sales cycles.",
      icon: Database,
      workflow: "Deal state changes or meeting concludes → Argus automatically updates stage, enriches contact profile, and creates assigned action items across the team.",
      capabilities: [
        "Enrich company profiles & stakeholder records",
        "Automate lifecycle pipeline stage transitions",
        "Deduplicate records across multi-channel touches",
        "Log customer call transcripts & meeting action items",
      ],
    },
    {
      id: "accounting" as const,
      name: "Accounting / ERP",
      label: "Financial & Tally",
      tagline: "Reconciliation & inventory verified instantly.",
      icon: Receipt,
      workflow: "Purchase order approved → Argus verifies transaction ledger, validates inventory balance, and generates invoice draft ready for financial sign-off.",
      capabilities: [
        "Invoice triage & automated ledger matching",
        "Real-time inventory reconciliation & alerts",
        "Seamless Tally & enterprise ERP interoperability",
        "Expense categorization & compliance audit logs",
      ],
    },
  ];

  const currentNode = integrationNodes.find((n) => n.id === selectedNode) || integrationNodes[0];

  return (
    <section
      id="argus"
      className="relative w-full bg-[#07190A] text-[#F5F7F3] py-16 sm:py-24 md:py-32 select-none overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(rgba(190, 210, 185, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(190, 210, 185, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
      aria-label="Argus Intelligent Orchestration Platform"
    >
      {/* Subtle Ambient Radial Lighting in Deep Forest Tone */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] sm:h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #19381C 0%, transparent 70%)"
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">

        {/* 1. HERO AREA: Left Heading + Right Supporting Description & Pill CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-20">

          {/* Left: Eyebrow + Prominent Heading */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.16em] text-[#A5B0A4] uppercase mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7C9B2]" />
              <span>06 / ARGUS INTELLIGENCE LAYER</span>
            </div>

            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-[#F5F7F3] tracking-tight leading-[1.06]">
              From repetitive work.
              <br className="hidden sm:inline" />
              {" "}To intelligent workflows.
            </h2>
          </div>

          {/* Right: Existing Summary + Pill CTA */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right max-w-md w-full md:w-auto">
            <p className="font-urbanist font-medium text-xs sm:text-sm md:text-[15px] text-[#A5B0A4] leading-relaxed mb-5 sm:mb-6">
              Bring customer conversations, specialised AI agents, and business processes into a more connected system, designed to reduce manual effort while keeping people in control.
            </p>

            <button
              onClick={() => setIsContactOpen(true)}
              className="pill-btn-hero-primary h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-full bg-[#F5F7F3] text-[#07190A] hover:bg-white font-urbanist font-bold text-xs sm:text-sm tracking-wide inline-flex items-center justify-center gap-2 shadow-[0_4px_22px_rgba(245,247,243,0.18)] hover:shadow-[0_6px_28px_rgba(245,247,243,0.28)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Request Argus Access</span>
              <ArrowUpRight className="w-4 h-4 text-[#07190A]" />
            </button>
          </div>
        </div>

        {/* 2. THE WORKFLOW CONTAINER: Large Dark Thin-Bordered Hub (Reference Image 1) */}
        <div className="rounded-2xl sm:rounded-[28px] md:rounded-[32px] bg-[#0A1D0E]/85 backdrop-blur-md border border-[rgba(190,210,185,0.14)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] overflow-hidden mb-12 sm:mb-16 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] sm:min-h-[480px]">

            {/* Left Column (Cols 1-7): Visual Integration Diagram */}
            <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 flex flex-col justify-between relative lg:border-r border-[rgba(190,210,185,0.12)]">

              {/* Top Diagram Label */}
              <div className="flex items-center justify-between z-20 mb-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-[#A5B0A4] font-semibold">
                  EXPLORE A CONNECTED WORKFLOW
                </span>
                <span className="text-[10px] font-mono text-[#A5B0A4]/60 hidden sm:inline">
                  Select a channel
                </span>
              </div>

              {/* Interactive Node Canvas */}
              <div className="relative w-full h-[340px] sm:h-[380px] md:h-[400px] flex items-center justify-center my-2 select-none">

                {/* SVG Organic Bezier Connecting Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="activeLinePulse" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#B7C9B2" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>

                  {/* WhatsApp (Top-Left) to Argus */}
                  <path
                    d="M 26 24 C 36 28, 38 42, 47 48"
                    fill="none"
                    stroke={selectedNode === "whatsapp" ? "url(#activeLinePulse)" : "rgba(190, 210, 185, 0.16)"}
                    strokeWidth={selectedNode === "whatsapp" ? "2.2" : "1.2"}
                    strokeDasharray={selectedNode === "whatsapp" ? "4 4" : "3 4"}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />

                  {/* Email (Top-Right) to Argus */}
                  <path
                    d="M 74 24 C 64 28, 62 42, 53 48"
                    fill="none"
                    stroke={selectedNode === "email" ? "url(#activeLinePulse)" : "rgba(190, 210, 185, 0.16)"}
                    strokeWidth={selectedNode === "email" ? "2.2" : "1.2"}
                    strokeDasharray={selectedNode === "email" ? "4 4" : "3 4"}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />

                  {/* CRM (Bottom-Left) to Argus */}
                  <path
                    d="M 26 76 C 36 72, 38 58, 47 52"
                    fill="none"
                    stroke={selectedNode === "crm" ? "url(#activeLinePulse)" : "rgba(190, 210, 185, 0.16)"}
                    strokeWidth={selectedNode === "crm" ? "2.2" : "1.2"}
                    strokeDasharray={selectedNode === "crm" ? "4 4" : "3 4"}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />

                  {/* Accounting / ERP (Bottom-Right) to Argus */}
                  <path
                    d="M 74 76 C 64 72, 62 58, 53 52"
                    fill="none"
                    stroke={selectedNode === "accounting" ? "url(#activeLinePulse)" : "rgba(190, 210, 185, 0.16)"}
                    strokeWidth={selectedNode === "accounting" ? "2.2" : "1.2"}
                    strokeDasharray={selectedNode === "accounting" ? "4 4" : "3 4"}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Central Argus Hub (Off-White Squircle Focal Point) */}
                <div
                  className="w-22 h-22 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-2xl sm:rounded-[24px] bg-[#F5F7F3] text-[#07190A] shadow-[0_0_40px_rgba(245,247,243,0.22)] border border-white flex flex-col items-center justify-center p-2.5 text-center z-20 transition-transform duration-300 hover:scale-105"
                  style={{
                    boxShadow: "0 0 35px rgba(245, 247, 243, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#07190A]/8 flex items-center justify-center mb-1 text-[#07190A]">
                    <Cpu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#07190A]" />
                  </div>
                  <span className="font-urbanist font-extrabold text-xs sm:text-sm tracking-widest uppercase text-[#07190A]">
                    ARGUS
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-[#07190A]/70 uppercase tracking-tight mt-0.5">
                    Core Intelligence
                  </span>
                </div>

                {/* Top-Left: WhatsApp Node */}
                <button
                  type="button"
                  onClick={() => setSelectedNode("whatsapp")}
                  aria-label="WhatsApp Integration"
                  className={`absolute top-2 sm:top-4 left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 transition-all duration-200 cursor-pointer min-h-[44px] ${selectedNode === "whatsapp"
                      ? "bg-[#132B18] border border-[#B7C9B2] text-[#F5F7F3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] ring-1 ring-[#B7C9B2]/40 scale-[1.03]"
                      : "bg-[#091D0D]/90 hover:bg-[#0E2613] border border-[rgba(190,210,185,0.14)] text-[#A5B0A4] hover:text-[#F5F7F3]"
                    }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${selectedNode === "whatsapp" ? "bg-white/15 text-white" : "bg-white/5 text-[#A5B0A4]"
                      }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-urbanist font-bold text-xs sm:text-sm">WhatsApp</div>
                    <div className="text-[9px] sm:text-[10px] font-mono text-[#A5B0A4] hidden xs:block">
                      Direct Messaging
                    </div>
                  </div>
                </button>

                {/* Top-Right: Email Node */}
                <button
                  type="button"
                  onClick={() => setSelectedNode("email")}
                  aria-label="Email Integration"
                  className={`absolute top-2 sm:top-4 right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 transition-all duration-200 cursor-pointer min-h-[44px] ${selectedNode === "email"
                      ? "bg-[#132B18] border border-[#B7C9B2] text-[#F5F7F3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] ring-1 ring-[#B7C9B2]/40 scale-[1.03]"
                      : "bg-[#091D0D]/90 hover:bg-[#0E2613] border border-[rgba(190,210,185,0.14)] text-[#A5B0A4] hover:text-[#F5F7F3]"
                    }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${selectedNode === "email" ? "bg-white/15 text-white" : "bg-white/5 text-[#A5B0A4]"
                      }`}
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-urbanist font-bold text-xs sm:text-sm">Email</div>
                    <div className="text-[9px] sm:text-[10px] font-mono text-[#A5B0A4] hidden xs:block">
                      Inbox Dispatch
                    </div>
                  </div>
                </button>

                {/* Bottom-Left: CRM Node */}
                <button
                  type="button"
                  onClick={() => setSelectedNode("crm")}
                  aria-label="CRM Integration"
                  className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 transition-all duration-200 cursor-pointer min-h-[44px] ${selectedNode === "crm"
                      ? "bg-[#132B18] border border-[#B7C9B2] text-[#F5F7F3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] ring-1 ring-[#B7C9B2]/40 scale-[1.03]"
                      : "bg-[#091D0D]/90 hover:bg-[#0E2613] border border-[rgba(190,210,185,0.14)] text-[#A5B0A4] hover:text-[#F5F7F3]"
                    }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${selectedNode === "crm" ? "bg-white/15 text-white" : "bg-white/5 text-[#A5B0A4]"
                      }`}
                  >
                    <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-urbanist font-bold text-xs sm:text-sm">CRM</div>
                    <div className="text-[9px] sm:text-[10px] font-mono text-[#A5B0A4] hidden xs:block">
                      Pipeline Sync
                    </div>
                  </div>
                </button>

                {/* Bottom-Right: Accounting / ERP Node */}
                <button
                  type="button"
                  onClick={() => setSelectedNode("accounting")}
                  aria-label="Accounting / ERP Integration"
                  className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 transition-all duration-200 cursor-pointer min-h-[44px] ${selectedNode === "accounting"
                      ? "bg-[#132B18] border border-[#B7C9B2] text-[#F5F7F3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] ring-1 ring-[#B7C9B2]/40 scale-[1.03]"
                      : "bg-[#091D0D]/90 hover:bg-[#0E2613] border border-[rgba(190,210,185,0.14)] text-[#A5B0A4] hover:text-[#F5F7F3]"
                    }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${selectedNode === "accounting" ? "bg-white/15 text-white" : "bg-white/5 text-[#A5B0A4]"
                      }`}
                  >
                    <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-urbanist font-bold text-xs sm:text-sm">Accounting / ERP</div>
                    <div className="text-[9px] sm:text-[10px] font-mono text-[#A5B0A4] hidden xs:block">
                      Financial & Tally
                    </div>
                  </div>
                </button>

              </div>

              {/* Bottom Diagram Footnote */}
              <div className="flex items-center justify-between text-[11px] font-urbanist text-[#A5B0A4] z-20 pt-2">
                <span>Select anywhere to follow the flow.</span>
                <span className="font-mono text-[10px] text-[#A5B0A4]/60">01 / 04</span>
              </div>
            </div>

            {/* Right Column (Cols 8-12): Integration Preview Panel */}
            <div className="lg:col-span-5 p-5 sm:p-7 md:p-9 bg-[#07190A]/60 flex flex-col justify-between">
              <div>

                {/* Header Metadata */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase text-[#A5B0A4] font-semibold">
                    WORKFLOW PREVIEW
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono text-[#B7C9B2] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B7C9B2] animate-pulse" />
                    <span>INTEGRATION: {currentNode.name.toUpperCase()}</span>
                  </div>
                </div>

                {/* Integration Title */}
                <h3 className="font-urbanist font-extrabold text-2xl sm:text-3xl text-[#F5F7F3] tracking-tight mb-2 leading-tight">
                  {currentNode.label} Integration
                </h3>

                {/* Tagline / Subtitle */}
                <p className="font-urbanist text-xs sm:text-sm text-[#B7C9B2] font-medium mb-4">
                  {currentNode.tagline}
                </p>

                {/* Workflow Detail Text */}
                <p className="font-urbanist text-xs sm:text-sm text-[#A5B0A4] leading-relaxed mb-6 sm:mb-8 font-normal">
                  {currentNode.workflow}
                </p>

                {/* Step-by-Step Autonomous Capabilities Checklist */}
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-[#A5B0A4] font-bold">
                    Autonomous Capabilities
                  </div>

                  <div className="space-y-2">
                    {currentNode.capabilities.map((cap, idx) => (
                      <div
                        key={cap}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-[rgba(190,210,185,0.08)] transition-all hover:bg-white/[0.05]"
                      >
                        <span className="w-5 h-5 rounded-full border border-[#B7C9B2]/30 flex items-center justify-center text-[10px] font-mono font-semibold text-[#B7C9B2] shrink-0 bg-white/5">
                          0{idx + 1}
                        </span>
                        <span className="font-urbanist font-medium text-xs sm:text-sm text-[#F5F7F3]">
                          {cap}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Human Oversight Guarantee */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-[rgba(190,210,185,0.12)] flex items-center gap-2 text-xs font-urbanist text-[#A5B0A4]">
                <ShieldCheck className="w-4 h-4 text-[#B7C9B2] shrink-0" />
                <span>Human oversight and audit approvals where it matters.</span>
              </div>

            </div>

          </div>
        </div>

        {/* 3. FIVE MODULE CARDS (Reference Image 1: Clean 5-Column Horizontal Layout) */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6 md:gap-7">
            {ARGUS_CAPABILITIES.map((cap, idx) => {
              const getModuleIcon = (i: number) => {
                switch (i) {
                  case 0: return <MessageSquare className="w-4 h-4 text-[#B7C9B2]" />;
                  case 1: return <Bot className="w-4 h-4 text-[#B7C9B2]" />;
                  case 2: return <Wrench className="w-4 h-4 text-[#B7C9B2]" />;
                  case 3: return <Workflow className="w-4 h-4 text-[#B7C9B2]" />;
                  default: return <ShieldCheck className="w-4 h-4 text-[#B7C9B2]" />;
                }
              };

              return (
                <div
                  key={cap.id}
                  className="group pt-4 sm:pt-5 border-t border-[rgba(190,210,185,0.14)] hover:border-[#B7C9B2] transition-colors duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Module Identifier + Icon */}
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.14em] text-[#A5B0A4] uppercase mb-2 sm:mb-2.5">
                      <span>MODULE / 0{idx + 1}</span>
                      <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-center">
                        {getModuleIcon(idx)}
                      </div>
                    </div>

                    {/* Module Title */}
                    <h4 className="font-urbanist font-bold text-base sm:text-[17px] text-[#F5F7F3] mb-2 group-hover:text-white transition-colors leading-snug">
                      {cap.title}
                    </h4>

                    {/* Module Description */}
                    <p className="font-urbanist text-xs sm:text-[13px] text-[#A5B0A4] leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  {/* Micro Status Chip */}
                  {/* <div className="mt-4 pt-3 border-t border-[rgba(190,210,185,0.08)] flex items-center justify-between text-[10px] font-mono text-[#A5B0A4]/70">
                    <span>STATUS</span>
                    <span className="text-[#B7C9B2] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7C9B2]" />
                      Verified
                    </span>
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};
