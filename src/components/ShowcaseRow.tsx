"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Grid, ArrowUpRight } from "lucide-react";
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
      className="relative w-full py-20 md:py-28 bg-[#F3EFEA] text-[#0C1015] border-t border-[#E8DFD5] select-none"
      aria-label="Horizontal Project Showcase Row"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DFD5] text-xs font-mono text-[#0C1015]/70 mb-3 shadow-xs">
              <Grid className="w-3.5 h-3.5 text-[#5E9BFF]" />
              <span>SHOWCASE ROW • LAYOUT B</span>
            </div>
            <h2 className="font-urbanist font-extrabold text-3xl md:text-5xl text-[#0C1015] tracking-tight">
              Enterprise Project Archive
            </h2>
            <p className="font-urbanist text-[#667085] text-sm md:text-base mt-2 max-w-xl">
              Wider aspect cards arranged in a horizontal row. Large reserved media region ready for high-fidelity workflow captures and system schematics.
            </p>
          </div>

          {/* Row Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              aria-label="Scroll projects left"
              className="labs-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0C1015]/30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll projects right"
              className="labs-control-btn shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0C1015]/30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Row Track (Mobile-swipeable with peek of next card) */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
        >
          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className="labs-card shrink-0 w-[300px] sm:w-[380px] md:w-[440px] p-6 md:p-7 flex flex-col justify-between"
            >
              {/* Large Media Region with Reserved Overlay Content Positions */}
              <div className="w-full h-[200px] sm:h-[240px] rounded-[22px] bg-[#F7F5F2] border border-[#E8DFD5] relative overflow-hidden flex items-center justify-center">
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
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFD5] flex items-center justify-center text-[#0C1015]/40 shadow-xs">
                      <span className="font-mono text-xs font-bold">
                        B-0{index + 1}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#667085] tracking-wider uppercase">
                      Reserved Media Well
                    </span>
                  </div>
                )}

                {/* Reserved Overlay Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E8DFD5] text-[10px] font-mono font-medium text-[#0C1015]/80 shadow-2xs">
                    {slot.category || "General Architecture"}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#0C1015]/5 text-[10px] font-mono text-[#667085]">
                    {slot.id}
                  </span>
                </div>
              </div>

              {/* Reserved Content Block */}
              <div className="pt-6 flex flex-col justify-between flex-grow">
                <div>
                  {slot.status === "published" && slot.title ? (
                    <h3 className="font-urbanist font-bold text-xl text-[#0C1015]">
                      {slot.title}
                    </h3>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-4.5 bg-[#E8DFD5]/60 rounded-md w-2/3" />
                      <div className="h-3.5 bg-[#E8DFD5]/40 rounded-md w-1/2" />
                    </div>
                  )}

                  {slot.status === "published" && slot.description ? (
                    <p className="font-urbanist text-xs text-[#667085] mt-2 line-clamp-2">
                      {slot.description}
                    </p>
                  ) : (
                    <div className="mt-4 space-y-1.5">
                      <div className="h-2.5 bg-[#E8DFD5]/25 rounded-md w-full" />
                      <div className="h-2.5 bg-[#E8DFD5]/25 rounded-md w-4/5" />
                    </div>
                  )}
                </div>

                {/* Footer Link / Meta */}
                <div className="pt-5 mt-6 border-t border-[#E8DFD5]/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#667085]">
                    {slot.status === "published" ? "Production Case" : "Configurable Slot"}
                  </span>
                  {slot.status === "published" && slot.href ? (
                    <a
                      href={slot.href}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0C1015] hover:text-[#18B951] transition-colors"
                    >
                      Read Study <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E8DFD5]/40 flex items-center justify-center text-[#667085] text-xs">
                      •
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
