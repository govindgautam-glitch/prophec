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
      {/* Central Emerald Radial Glow */}
      <div 
        className="absolute top-[260px] left-[260px] w-[700px] h-[700px] rounded-full blur-[140px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(24,185,81,0.65) 0%, rgba(24,185,81,0.15) 55%, transparent 75%)",
        }}
      />

      <svg
        viewBox="0 0 1220 1255"
        className="w-full h-full opacity-65 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ringGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18B951" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#2FF882" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#081225" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="ringGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#245FFF" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#18B951" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#18B951" stopOpacity="0.02" />
          </linearGradient>

          <radialGradient id="centerGem" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#18B951" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#18B951" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#18B951" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric Geometric Rings matching Figma Node 3:193 */}
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
          stroke="rgba(24, 185, 81, 0.4)"
          strokeWidth="1.2"
          opacity="0.65"
        />

        {/* Ring 5 */}
        <circle
          cx="610"
          cy="627"
          r="230"
          stroke="rgba(47, 248, 130, 0.45)"
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

        {/* Orbiting Satellite Points / Accents */}
        <circle cx="200" cy="627" r="3.5" fill="#18B951" opacity="0.8" />
        <circle cx="1020" cy="627" r="3.5" fill="#2FF882" opacity="0.8" />
        <circle cx="610" cy="217" r="4" fill="#245FFF" opacity="0.7" />
        <circle cx="890" cy="420" r="3" fill="#18B951" opacity="0.9" />
        <circle cx="330" cy="830" r="3" fill="#18B951" opacity="0.7" />
        <circle cx="610" cy="1037" r="4" fill="#2FF882" opacity="0.6" />

        {/* Subtle Crosshair Axis Lines */}
        <line
          x1="610"
          y1="100"
          x2="610"
          y2="1150"
          stroke="rgba(24, 185, 81, 0.12)"
          strokeWidth="0.8"
          strokeDasharray="6 8"
        />
        <line
          x1="100"
          y1="627"
          x2="1120"
          y2="627"
          stroke="rgba(24, 185, 81, 0.12)"
          strokeWidth="0.8"
          strokeDasharray="6 8"
        />
      </svg>
    </div>
  );
};
