"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { ProjectSlot, initialProjectSlots } from "@/data/projects";

interface ShowcaseRowProps {
  slots?: ProjectSlot[];
}

export const ShowcaseRow: React.FC<ShowcaseRowProps> = ({
  slots = initialProjectSlots,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  return (
    <section
      id="showcase-row"
      className="relative w-full py-20 md:py-28 bg-white text-[#091c09] border-t border-[rgba(9,28,9,0.10)] select-none"
      aria-label="Horizontal Project Showcase Row"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[rgba(9,28,9,0.12)] text-xs font-mono font-bold text-[#091c09] mb-3 shadow-2xs">
              <Grid className="w-3.5 h-3.5 text-[#091c09]" />
              <span>SHOWCASE ROW</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl md:text-5xl text-[#091c09] tracking-tight">
              Enterprise Project Archive
            </h2>
            <p className="font-urbanist text-[rgba(9,28,9,0.70)] text-sm md:text-base mt-2 max-w-xl font-medium">
              Wider aspect cards arranged in a horizontal row. Large reserved media region ready for high-fidelity workflow captures and system schematics.
            </p>
          </div>

          {/* Row Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              aria-label="Scroll projects left"
              className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#091c09]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll projects right"
              className="circular-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#091c09]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Row Track */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
        >
          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className="editorial-card shrink-0 w-[300px] sm:w-[380px] md:w-[440px] p-6 md:p-7 flex flex-col justify-between"
            >
              {/* Large Media Region */}
              <div className="w-full h-[200px] sm:h-[240px] rounded-[22px] bg-[rgba(9,28,9,0.03)] border border-[rgba(9,28,9,0.10)] relative overflow-hidden flex items-center justify-center">
                {slot.status === "published" && slot.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slot.image.src}
                    alt={slot.image.alt}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                ) : (
                  /* Reserved Empty Blueprint View */
                  <div className="flex flex-col items-center justify-center text-center space-y-2 p-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(9,28,9,0.12)] flex items-center justify-center text-[#091c09] shadow-xs font-mono text-xs font-bold">
                      B-0{index + 1}
                    </div>
                    <span className="font-mono text-[11px] text-[rgba(9,28,9,0.60)] tracking-wider uppercase font-semibold">
                      Reserved Media Well
                    </span>
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-white/95 border border-[rgba(9,28,9,0.12)] text-[10px] font-mono font-bold text-[#091c09]">
                    {slot.category || "General"}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    slot.status === "published"
                      ? "bg-[#091c09] text-white"
                      : "bg-white text-[#091c09] border border-[rgba(9,28,9,0.12)]"
                  }`}>
                    {slot.status === "published" ? "Live System" : "Reserved"}
                  </span>
                </div>
              </div>

              {/* Content Description */}
              <div className="pt-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-urbanist font-extrabold text-xl md:text-2xl text-[#091c09] tracking-tight">
                    {slot.title || `Reserved Project Slot B-0${index + 1}`}
                  </h3>
                  <p className="font-urbanist font-medium text-xs md:text-sm text-[rgba(9,28,9,0.70)] mt-2 leading-relaxed">
                    {slot.description || "Configured slot awaiting client workflow deployment and metric certification."}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[rgba(9,28,9,0.10)] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[rgba(9,28,9,0.60)]">
                    {slot.status === "published" ? "Case Study" : "Template Slot"}
                  </span>
                  <span className="text-[11px] font-mono text-[#091c09] font-bold">
                    Slot ID: {slot.id}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
