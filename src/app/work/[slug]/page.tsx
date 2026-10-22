import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WORK_PROJECTS, WORK_PROJECTS_BY_SLUG } from "@/data/ourWorkProjects";

// Allow blocking route for URL data access under Next.js 16 cacheComponents
export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return WORK_PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = WORK_PROJECTS_BY_SLUG[slug];

  if (!project) {
    return {
      title: "Project Not Found — PropheC AI",
    };
  }

  return {
    title: `${project.name} — ${project.tagline} | PropheC AI`,
    description: project.description[0],
    openGraph: {
      title: `${project.name} | PropheC AI`,
      description: project.tagline,
      images: [project.logo],
    },
  };
}

export default async function WorkProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = WORK_PROJECTS_BY_SLUG[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="relative w-full min-h-screen bg-[#091c09] text-white selection:bg-[#52D370] selection:text-[#091c09] overflow-x-hidden">
      {/* Floating Global Navbar */}
      <Navbar />

      {/* Hero / Spotlight Header */}
      <section className="relative w-full pt-32 sm:pt-40 md:pt-44 pb-16 sm:pb-24 overflow-hidden border-b border-white/10">
        {/* Subtle, refined atmospheric illumination matching the homepage */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(82, 211, 112, 0.12) 0%, rgba(9, 28, 9, 0.6) 55%, #091c09 100%)",
          }}
          aria-hidden="true"
        />

        {/* Delicate background grid overlay matching Hero section */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <div className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-5 md:px-9 lg:px-14 z-10">
          {/* Breadcrumb Navigation Row */}
          <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs sm:text-[13px] font-mono font-medium text-[#C5D6C1] hover:text-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Our Work</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.14] text-[11px] font-mono font-semibold tracking-wider text-[#C5D6C1] uppercase">
              <span>{project.sector}</span>
            </div>
          </div>

          {/* Top Row: Dedicated Elevated Brand Logo Showcase Tile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8 sm:mb-12">
            <div className="w-[240px] sm:w-[320px] h-28 sm:h-36 rounded-2xl bg-white px-6 py-4 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/90 shrink-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={project.logo}
                  alt={`${project.name} logo`}
                  fill
                  sizes="(max-width: 640px) 240px, 320px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#A5B0A4]">
              <span className="text-[#52D370] font-bold">CASE STUDY</span>
              <span>•</span>
              <span>{project.sector.toUpperCase()}</span>
            </div>
          </div>

          {/* Main Case Study Typography Block */}
          <div className="max-w-4xl">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-[#52D370] uppercase block mb-3">
              PROJECT SPOTLIGHT
            </span>

            <h1 className="font-urbanist font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F5F7F3] tracking-tight leading-[1.08] mb-4 text-balance">
              {project.name}
            </h1>

            <h2 className="font-urbanist font-bold text-xl sm:text-2xl md:text-3xl text-[#52D370] leading-snug mb-8 text-balance">
              {project.tagline}
            </h2>

            {/* Exact Verbatim Content Provided by User */}
            <div className="space-y-6 text-base sm:text-lg md:text-xl font-urbanist text-[#D6E2D3] leading-relaxed font-normal">
              {project.description.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Capabilities Pills (if defined) */}
            {project.capabilities && project.capabilities.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <span className="block font-mono text-xs text-[#A5B0A4] uppercase tracking-wider mb-3.5 font-semibold">
                  Capabilities:
                </span>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {project.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-xs sm:text-[13px] font-urbanist font-medium text-[#F5F7F3] tracking-wide"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Authentic Editorial Website Footer */}
      <Footer />
    </div>
  );
}
