"use client";

import React, { useState } from "react";
import { Sparkles, Headphones, Cpu, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { AuditModal } from "./ActionModals";

export const SolutionsSection: React.FC = () => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const solutions = [
    {
      title: "Autonomous Sales Agents",
      subtitle: "Pipeline acceleration & qualification",
      metric: "128 Qualified Leads / wk",
      icon: Sparkles,
      color: "#18B951",
      points: [
        "Identifies and qualifies high-intent outbound & inbound leads",
        "Enriches contact profiles directly within Salesforce and HubSpot",
        "Personalized multi-channel follow-up sequences",
      ],
    },
    {
      title: "Intelligent Customer Care",
      subtitle: "24/7 autonomous support tier",
      metric: "97% Automated Resolution",
      icon: Headphones,
      color: "#5BE3F1",
      points: [
        "Resolves repetitive tier-1 tickets across Zendesk and Intercom",
        "Context-aware escalation with summarized handover to humans",
        "Multilingual support with strict enterprise privacy bounds",
      ],
    },
    {
      title: "Autonomous Operations",
      subtitle: "System integration & synchronization",
      metric: "63% Workflows Automated",
      icon: Cpu,
      color: "#94A3FF",
      points: [
        "Cross-system data synchronization between ERPs and internal databases",
        "Automated exception handling and audit trail validation",
        "Zero-code human approval loops for sensitive financial thresholds",
      ],
    },
    {
      title: "Email Triaging & Dispatch",
      subtitle: "High-volume inbox processing",
      metric: "426 Processed Emails / hr",
      icon: Mail,
      color: "#C084FC",
      points: [
        "Classifies complex inbound emails with semantic intent parsing",
        "Drafts hyper-accurate responses grounded in internal knowledge base",
        "Auto-tags, routes, and flags high-priority executive communications",
      ],
    },
  ];

  const steps = [
    { num: "01", title: "Workflow Audit", desc: "Identify operational friction points, repetitive human hours, and high-ROI automation candidates." },
    { num: "02", title: "Agent Mapping", desc: "Design purpose-built agents with strict permission boundaries and deterministic validation rules." },
    { num: "03", title: "Sandbox Testing", desc: "Shadow existing workflows in read-only mode to measure precision before autonomous execution." },
    { num: "04", title: "Production Scale", desc: "Deploy seamlessly into existing tech stacks with continuous telemetry and human-in-the-loop controls." },
  ];

  return (
    <section id="solutions" className="relative w-full bg-[#081225] py-20 px-4 md:px-8 border-b border-white/5 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#18B951] mb-3">
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="font-urbanist font-extrabold text-3xl md:text-4xl text-white tracking-tight">
            Autonomous Agents Engineered for Precision
          </h2>
          <p className="font-urbanist text-white/60 text-sm md:text-base mt-3 leading-relaxed">
            Prophec AI agents run across your existing cloud infrastructure, eliminating manual friction without disrupting your established toolchains.
          </p>
        </div>

        {/* 4 Agent Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0C1A30]/80 border border-white/10 p-6 md:p-8 hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-30"
                  style={{ background: item.color }}
                />

                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${item.color}15`, 
                        borderColor: `${item.color}35`,
                        color: item.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-urbanist font-bold text-lg text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/50">{item.subtitle}</p>
                    </div>
                  </div>

                  <span 
                    className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80"
                  >
                    {item.metric}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs md:text-sm text-white/70 leading-normal">
                      <CheckCircle2 className="w-4 h-4 text-[#18B951] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setIsAuditModalOpen(true)}
                  className="text-xs font-semibold text-white/80 hover:text-white inline-flex items-center gap-1 group/btn transition-colors"
                >
                  Configure agent architecture <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 4-Step Process Strip */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 md:p-10">
          <div className="text-center mb-10">
            <h3 className="font-urbanist font-bold text-2xl text-white">
              From Workflow Audit to Production Automation
            </h3>
            <p className="text-xs md:text-sm text-white/50 mt-1">
              A rigorous engineering framework designed for security, accuracy, and measurable ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="relative space-y-2">
                <span className="font-mono text-2xl font-black text-[#18B951]/60">
                  {st.num}
                </span>
                <h4 className="font-urbanist font-bold text-base text-white">
                  {st.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <AuditModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
    </section>
  );
};
