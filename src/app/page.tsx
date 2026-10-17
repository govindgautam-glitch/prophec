"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutStatement } from "@/components/AboutStatement";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { WhatWeBuildSection } from "@/components/WhatWeBuildSection";
import { ArgusSection } from "@/components/ArgusSection";
import { InteractiveShapeScene } from "@/components/InteractiveShapeScene";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-white text-[#091c09] overflow-x-hidden selection:bg-[#091c09] selection:text-white">
      {/* 
        A. HEADER & HERO (FRAME 1:3, 1280 × 832)
        Deep-green foundation, glass navbar, circular artwork,
        4 agent cards with real capabilities, and pill buttons.
      */}
      <div className="relative w-full bg-[#091c09]">
        <Navbar />
        <Hero />
      </div>

      {/* 
        B. LARGE EDITORIAL INTRODUCTION (LIGHT CANVAS)
        "Who we are" • "Building the systems behind modern businesses."
        Oversized partially cropped background shape.
      */}
      <AboutStatement />

      {/* 
        C. AI ECOSYSTEM — THE MAIN SPATIAL CAROUSEL (LIGHT CANVAS)
        6 services from the company deck, authored SVG function artwork,
        upright center card, and tilted neighbors.
      */}
      <ProjectCarousel />

      {/* 
        D, F, G, H, I. WHAT WE BUILD, PRINCIPLES, SECTORS, OUR WORK & LEADERSHIP
        4 build categories, 6 principles, transformation pairs,
        7 industry sectors, 8 client marks, and leadership team.
      */}
      <WhatWeBuildSection />

      {/* 
        E. THE AUTOMATION GAP & ARGUS PLATFORM
        4 problem gaps, interactive Argus integration node diagram
        with SVG connection pulses, and 5 automation capabilities.
      */}
      <ArgusSection />

      {/* 
        J. INTERACTIVE GEOMETRIC PLAYGROUND & FINAL INVITATION
        Google Labs-inspired Matter.js 2D physics canvas with deep green & pure white palette,
        touch-safe controls, reset & shuffle buttons.
      */}
      <InteractiveShapeScene />

      {/* 
        EDITORIAL FOOTER
        "Build smarter. Operate better. Scale further.",
        large authentic logo display (80-90% width), thin rules, and verified links.
      */}
      <Footer />
    </div>
  );
}
