"use client";

import React, { useState } from "react";
import { CATEGORIES, ProjectSlot, initialProjectSlots, ProjectCategory } from "@/data/projects";
import { FolderCode, Plus, Sparkles, SlidersHorizontal, Info } from "lucide-react";

export const ProjectShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [slots, setSlots] = useState<ProjectSlot[]>(initialProjectSlots);
  const [simulateSample, setSimulateSample] = useState(false);

  // Toggle sample project for verification of zero vs. populated states
  const toggleSampleProject = () => {
    if (!simulateSample) {
      const updated = [...initialProjectSlots];
      updated[0] = {
        id: "slot-1",
        status: "published",
        title: "Enterprise Claims Triage Agent",
        description: "Autonomous policy verification and triage for high-volume enterprise health claims.",
        category: "Develop",
        image: {
          src: "/brand/sample-project.png",
          alt: "Claims triage system architecture preview",
        },
        href: "#argus",
        featured: true,
      };
      setSlots(updated);
      setSimulateSample(true);
    } else {
      setSlots(initialProjectSlots);
      setSimulateSample(false);
    }
  };

  // Filter slots according to selected category
  const filteredSlots = slots.filter((slot) => {
    if (selectedCategory === "All") return true;
    if (slot.status === "empty") return true; // Empty templates remain visible
    return slot.category === selectedCategory;
  });

  return (
    <section id="projects" className="relative w-full py-24 px-4 md:px-8 border-b border-white/5 select-none transition-colors duration-500 bg-[var(--section-bg,#07140F)] text-[var(--text-primary,#F4FFF8)]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Category Filter (Google Labs-inspired) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[var(--accent,#18B951)] mb-3">
              <FolderCode className="w-3.5 h-3.5" />
              <span>PROJECT SHOWCASE ARCHITECTURE</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl md:text-5xl tracking-tight">
              Configurable Project Slots
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted,#84A995)] mt-2 max-w-xl">
              Clean modular templates adhering to the Master Plan data specification. Ready for owner-supplied project case studies.
            </p>
          </div>

          {/* Category Tabs (Google Labs style) */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--accent,#18B951)] text-black font-semibold shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Toggle & Instructions Callout */}
        <div className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-[var(--accent,#18B951)] shrink-0" />
            <p className="text-[var(--text-muted,#84A995)]">
              <strong>Owner Content Contract:</strong> Populate your actual case studies in <code className="text-white px-1 py-0.5 rounded bg-black/40">src/data/projects.ts</code>. Empty slots avoid fabricated claims.
            </p>
          </div>

          <button
            onClick={toggleSampleProject}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent,#18B951)]" />
            <span>{simulateSample ? "Revert to 100% Empty Slots" : "Preview 1 Sample Project"}</span>
          </button>
        </div>

        {/* 6 Reusable Project Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map((slot, index) => {
            const isEmpty = slot.status === "empty";

            return (
              <div
                key={slot.id}
                className={`rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[260px] ${
                  isEmpty
                    ? "border border-dashed border-white/15 bg-white/[0.015] hover:border-[var(--accent,#18B951)]/40 hover:bg-white/[0.03]"
                    : "border border-white/10 bg-[var(--surface,#0D2419)] shadow-xl"
                }`}
              >
                {/* Slot Tag & Status Indicator */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs text-[var(--accent,#18B951)] font-semibold tracking-wider">
                    {`SLOT 0${index + 1}`}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isEmpty 
                      ? "bg-white/5 text-white/40 border border-white/5" 
                      : "bg-[var(--accent,#18B951)]/20 text-[var(--accent,#18B951)] border border-[var(--accent,#18B951)]/30"
                  }`}>
                    {isEmpty ? "RESERVED TEMPLATE" : "PUBLISHED"}
                  </span>
                </div>

                {isEmpty ? (
                  /* Empty Slot Blueprint State */
                  <div className="my-auto py-4 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/30">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-white/70">
                      Empty Project Template
                    </p>
                    <p className="text-xs text-white/40 max-w-[200px] mx-auto">
                      Awaiting project title, client metrics, and visual asset
                    </p>
                  </div>
                ) : (
                  /* Populated Project State */
                  <div className="space-y-3 my-auto">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[var(--accent,#18B951)] font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slot.category}</span>
                    </div>
                    <h3 className="font-urbanist font-bold text-lg text-white">
                      {slot.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted,#84A995)] leading-relaxed">
                      {slot.description}
                    </p>
                  </div>
                )}

                {/* Footer of Card */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  {isEmpty ? (
                    <span className="text-[11px] text-white/30 italic">
                      Slot ready for deployment
                    </span>
                  ) : (
                    <a
                      href={slot.href || "#"}
                      className="text-xs font-semibold text-[var(--accent,#18B951)] hover:underline inline-flex items-center gap-1"
                    >
                      View Case Study →
                    </a>
                  )}
                  <span className="text-[11px] font-mono text-white/20">
                    ID: {slot.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
