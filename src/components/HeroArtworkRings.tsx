"use client";

import React from "react";

interface HeroArtworkRingsProps {
  parallaxOffset?: { x: number; y: number };
}

export const HeroArtworkRings: React.FC<HeroArtworkRingsProps> = ({
  parallaxOffset = { x: 0, y: 0 },
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[-211px] left-1/2 -translate-x-1/2 w-[1220px] h-[1255px] overflow-visible select-none z-0 transition-transform duration-700 ease-out will-change-transform"
      style={{
        transform: `translate(calc(-50% + ${parallaxOffset.x}px), ${parallaxOffset.y}px)`,
      }}
    >
      {/* Central Pure White Translucent Radial Glow against Deep Green */}
      <div 
        className="absolute top-[260px] left-[260px] w-[700px] h-[700px] rounded-full blur-[140px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 55%, transparent 75%)",
        }}
      />

      <svg
        viewBox="0 0 1220 1255"
        className="w-full h-full opacity-60 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ringGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.40" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#091c09" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="ringGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>

          <radialGradient id="centerGem" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric Geometric Rings matching Figma Node 3:193 in Pure White Transparency */}
        {/* Outermost Ring */}
        <circle
          cx="610"
          cy="627"
          r="590"
          stroke="url(#ringGradA)"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          opacity="0.35"
        />

        {/* Ring 2 */}
        <circle
          cx="610"
          cy="627"
          r="500"
          stroke="url(#ringGradB)"
          strokeWidth="1"
          opacity="0.45"
        />

        {/* Ring 3 with nodes */}
        <circle
          cx="610"
          cy="627"
          r="410"
          stroke="url(#ringGradA)"
          strokeWidth="1.3"
          strokeDasharray="12 16"
          opacity="0.55"
        />

        {/* Ring 4 */}
        <circle
          cx="610"
          cy="627"
          r="320"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.2"
          opacity="0.65"
        />

        {/* Ring 5 */}
        <circle
          cx="610"
          cy="627"
          r="230"
          stroke="rgba(255, 255, 255, 0.40)"
          strokeWidth="1.5"
          opacity="0.75"
        />

        {/* Innermost Ring */}
        <circle
          cx="610"
          cy="627"
          r="140"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.85"
        />

        {/* Core Radiance */}
        <circle
          cx="610"
          cy="627"
          r="60"
          fill="url(#centerGem)"
          opacity="0.6"
        />

        {/* Orbiting Satellite Points / Accents in Pure White */}
        <circle cx="200" cy="627" r="3.5" fill="#ffffff" opacity="0.8" />
        <circle cx="1020" cy="627" r="3.5" fill="#ffffff" opacity="0.8" />
        <circle cx="610" cy="217" r="4" fill="#ffffff" opacity="0.85" />
        <circle cx="890" cy="420" r="3" fill="#ffffff" opacity="0.9" />
        <circle cx="330" cy="830" r="3" fill="#ffffff" opacity="0.7" />
        <circle cx="610" cy="1037" r="4" fill="#ffffff" opacity="0.6" />

        {/* Subtle Crosshair Axis Lines */}
        <line
          x1="610"
          y1="100"
          x2="610"
          y2="1150"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="0.8"
          strokeDasharray="6 8"
        />
        <line
          x1="100"
          y1="627"
          x2="1120"
          y2="627"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="0.8"
          strokeDasharray="6 8"
        />
      </svg>
    </div>
  );
};
