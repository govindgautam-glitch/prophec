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
  Workflow 
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
      icon: MessageSquare,
      color: "#03FEA7",
      workflow: "Lead sends inquiry on WhatsApp → Argus parses intent, checks product availability, answers queries in real time, and logs conversation into CRM.",
      capabilities: ["Instant Response", "Lead Qualification", "Catalog Queries", "Automated Follow-ups"],
    },
    {
      id: "email" as const,
      name: "Email",
      label: "Inbox Dispatch",
      icon: Mail,
      color: "#3B82F6",
      workflow: "Inbound client RFQ arrives → Argus triages priority, drafts contextual proposal grounded in pricing guidelines, and prompts human approval before dispatch.",
      capabilities: ["Semantic Triage", "Draft Generation", "Attachment Parsing", "Executive Alerts"],
    },
    {
      id: "crm" as const,
      name: "CRM",
      label: "Pipeline Sync",
      icon: Database,
      color: "#EAB308",
      workflow: "Deal state changes or meeting concludes → Argus automatically updates stage, enriches contact profile, and creates assigned action items across the team.",
      capabilities: ["Field Enrichment", "Stage Automation", "Contact Deduplication", "Activity Logging"],
    },
    {
      id: "accounting" as const,
      name: "Accounting / ERP",
      label: "Financial & Tally",
      icon: Receipt,
      color: "#EC4899",
      workflow: "Purchase order approved → Argus verifies transaction ledger, validates inventory balance, and generates invoice draft ready for financial sign-off.",
      capabilities: ["Invoice Triage", "Inventory Reconciliation", "Tally Interoperability", "Expense Categorization"],
    },
  ];

  const currentNode = integrationNodes.find((n) => n.id === selectedNode) || integrationNodes[0];

  return (
    <section
      id="argus"
      className="relative w-full bg-[#F3EFEA] text-[#202320] py-24 md:py-36 select-none overflow-hidden border-t border-[rgba(12,16,21,0.08)]"
      aria-label="Argus Intelligent Orchestration Platform"
    >
      {/* Oversized background decorative geometry (pale mint & soft yellow) */}
      <div className="absolute top-12 -right-32 w-[420px] md:w-[600px] h-[420px] md:h-[600px] rounded-full bg-[#03FEA7]/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-16 -left-28 w-[360px] md:w-[500px] h-[360px] md:h-[500px] rounded-[80px] rotate-45 bg-[#F8E9A1]/20 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#202320]/80 shadow-2xs mb-4">
              <Cpu className="w-3.5 h-3.5 text-[#03FEA7]" />
              <span>ARGUS INTELLIGENCE LAYER</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#202320] tracking-tight leading-[1.08]">
              Connected intelligence across your existing tools.
            </h2>
            <p className="font-urbanist text-[#59636E] text-base md:text-lg mt-4 font-medium leading-relaxed">
              Argus connects WhatsApp, email, CRM, and accounting systems into a coherent automated workflow with complete auditability and human oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsContactOpen(true)}
              className="pill-btn-mint shadow-md"
            >
              Request Argus Access <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Integration Diagram Stage */}
        <div className="p-6 md:p-10 rounded-[32px] bg-white border border-[#E8DFD5] mb-20 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
            
            {/* Left Diagram Visual */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative min-h-[380px]">
              
              {/* Central Argus Node */}
              <div className="w-28 h-28 md:w-34 md:h-34 rounded-3xl bg-white border-2 border-[#03FEA7] shadow-[0_10px_30px_rgba(3,254,167,0.25)] flex flex-col items-center justify-center p-3 text-center z-20 relative transition-transform hover:scale-105">
                <div className="w-9 h-9 rounded-full bg-[#03FEA7]/20 flex items-center justify-center mb-1 text-[#08090B]">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="font-urbanist font-extrabold text-base md:text-lg text-[#202320]">
                  Argus
                </span>
                <span className="text-[10px] font-mono text-[#08090B] bg-[#03FEA7] px-2 py-0.5 rounded-full uppercase font-bold mt-1">
                  Core AI
                </span>
              </div>

              {/* 4 Satellite Integration Nodes */}
              <div className="grid grid-cols-2 gap-x-28 md:gap-x-36 gap-y-24 absolute inset-0 items-center justify-center pointer-events-none">
                {integrationNodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  const Icon = node.icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`pointer-events-auto p-3.5 md:p-4 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#03FEA7] ${
                        isSelected
                          ? "bg-[#202320] text-white scale-105 shadow-md border border-[#202320]"
                          : "bg-[#F3EFEA] hover:bg-white text-[#202320] border border-[#E8DFD5] shadow-2xs"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: isSelected ? "#03FEA7" : `${node.color}20`, color: isSelected ? "#08090B" : node.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-urbanist font-bold text-xs md:text-sm">
                          {node.name}
                        </div>
                        <div className={`text-[10px] font-mono ${isSelected ? "text-white/70" : "text-[#59636E]"}`}>
                          {node.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Connecting Pulsing Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
                <line 
                  x1="25%" y1="25%" x2="50%" y2="50%" 
                  stroke={selectedNode === "whatsapp" ? "#03FEA7" : "#E8DFD5"} 
                  strokeWidth={selectedNode === "whatsapp" ? "2.5" : "1.5"} 
                  strokeDasharray="4 4" 
                />
                <line 
                  x1="75%" y1="25%" x2="50%" y2="50%" 
                  stroke={selectedNode === "email" ? "#3B82F6" : "#E8DFD5"} 
                  strokeWidth={selectedNode === "email" ? "2.5" : "1.5"} 
                  strokeDasharray="4 4" 
                />
                <line 
                  x1="25%" y1="75%" x2="50%" y2="50%" 
                  stroke={selectedNode === "crm" ? "#EAB308" : "#E8DFD5"} 
                  strokeWidth={selectedNode === "crm" ? "2.5" : "1.5"} 
                  strokeDasharray="4 4" 
                />
                <line 
                  x1="75%" y1="75%" x2="50%" y2="50%" 
                  stroke={selectedNode === "accounting" ? "#EC4899" : "#E8DFD5"} 
                  strokeWidth={selectedNode === "accounting" ? "2.5" : "1.5"} 
                  strokeDasharray="4 4" 
                />
              </svg>

            </div>

            {/* Right Selected Node Detail & Illustrative Workflow */}
            <div className="w-full lg:w-1/2 rounded-2xl bg-[#F7F5F2] border border-[#E8DFD5] p-6 md:p-8 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold text-[#202320]">
                    <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
                    <span>INTEGRATION: {currentNode.name.toUpperCase()}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#59636E]">
                    Live Workflow Preview
                  </span>
                </div>

                <h4 className="font-urbanist font-extrabold text-2xl text-[#202320] mb-3">
                  {currentNode.label} Integration
                </h4>

                <p className="font-urbanist text-sm md:text-base text-[#59636E] leading-relaxed font-medium">
                  {currentNode.workflow}
                </p>
              </div>

              {/* Capabilities checklist */}
              <div className="mt-6 pt-6 border-t border-[#E8DFD5]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#59636E] mb-3 font-bold">
                  Autonomous Capabilities
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {currentNode.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2 text-xs font-urbanist font-semibold text-[#202320]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#03FEA7]" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Five Automation Capabilities Grid */}
        <div>
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono font-bold tracking-wider text-[#202320]/80 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#03FEA7]" />
              <span>AUTOMATION SUITE</span>
            </div>
            <h3 className="font-urbanist font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#202320] tracking-tight">
              Five capabilities built for enterprise scale.
            </h3>
            <p className="font-urbanist text-[#59636E] text-sm md:text-base mt-2 font-medium">
              Verified operational modules configured for resilience, data isolation, and continuous learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARGUS_CAPABILITIES.map((cap, idx) => (
              <div
                key={cap.id}
                className={`p-7 rounded-2xl bg-white border border-[#E8DFD5] flex flex-col justify-between hover:border-[#03FEA7] hover:shadow-xs transition-all ${
                  idx === 4 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3EFEA] border border-[#E8DFD5] flex items-center justify-center text-[#202320] mb-4">
                    {idx === 0 && <MessageSquare className="w-5 h-5 text-[#03FEA7]" />}
                    {idx === 1 && <Bot className="w-5 h-5 text-[#3B82F6]" />}
                    {idx === 2 && <Wrench className="w-5 h-5 text-[#EAB308]" />}
                    {idx === 3 && <Workflow className="w-5 h-5 text-[#EC4899]" />}
                    {idx === 4 && <ShieldCheck className="w-5 h-5 text-[#03FEA7]" />}
                  </div>

                  <h4 className="font-urbanist font-bold text-xl text-[#202320] mb-2">
                    {cap.title}
                  </h4>

                  <p className="font-urbanist text-xs md:text-sm text-[#59636E] leading-relaxed font-medium">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8DFD5] flex items-center justify-between text-xs font-mono text-[#59636E]">
                  <span>Module 0{idx + 1}</span>
                  <span className="text-[#08090B] font-bold inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#03FEA7]" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <AuditModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};
