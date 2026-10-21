import React from "react";

interface AmbientBackgroundDecorProps {
  className?: string;
  variant?: "default" | "alternate" | "subtle";
}

export const AmbientBackgroundDecor: React.FC<AmbientBackgroundDecorProps> = ({
  className = "",
  variant = "default",
}) => {
  const isAlt = variant === "alternate";
  const isSubtle = variant === "subtle";

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* =========================================================================
          1. LEFT SIDE AMBIENT GRADIENT BLOBS
          Soft sage, mint, and emerald glow matching reference image
          ========================================================================= */}
      <div
        className={`absolute pointer-events-none transition-transform duration-700 ${
          isAlt
            ? "w-[440px] sm:w-[560px] h-[480px] sm:h-[600px] -top-16 -left-32 sm:-left-40 rounded-[55%_45%_50%_50%/50%_55%_45%_50%]"
            : "w-[400px] sm:w-[520px] h-[460px] sm:h-[580px] top-[18%] sm:top-[22%] -left-28 sm:-left-36 rounded-[48%_52%_58%_42%/42%_58%_48%_52%]"
        }`}
        style={{
          background: isSubtle
            ? "radial-gradient(ellipse at 35% 50%, rgba(200, 228, 205, 0.32) 0%, rgba(165, 220, 180, 0.14) 40%, rgba(82, 211, 112, 0.04) 65%, transparent 80%)"
            : "radial-gradient(ellipse at 35% 50%, rgba(195, 232, 205, 0.48) 0%, rgba(155, 222, 175, 0.22) 42%, rgba(82, 211, 112, 0.07) 68%, transparent 82%)",
          filter: "blur(40px)",
        }}
      />

      {/* Secondary Left Accent Blob for organic curvature */}
      <div
        className={`absolute pointer-events-none ${
          isAlt
            ? "w-[300px] sm:w-[420px] h-[320px] sm:h-[440px] bottom-[5%] -left-20 sm:-left-28 rounded-full"
            : "w-[280px] sm:w-[380px] h-[300px] sm:h-[400px] -bottom-16 -left-16 sm:-left-24 rounded-full"
        }`}
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(215, 240, 218, 0.40) 0%, rgba(82, 211, 112, 0.08) 55%, transparent 75%)",
          filter: "blur(48px)",
        }}
      />

      {/* =========================================================================
          2. RIGHT SIDE AMBIENT GRADIENT BLOBS
          Prominent organic mint-sage cloud on the right margin matching reference
          ========================================================================= */}
      <div
        className={`absolute pointer-events-none transition-transform duration-700 ${
          isAlt
            ? "w-[420px] sm:w-[540px] h-[480px] sm:h-[600px] top-[20%] -right-28 sm:-right-36 rounded-[52%_48%_42%_58%/48%_52%_58%_42%]"
            : "w-[460px] sm:w-[600px] h-[500px] sm:h-[640px] -top-12 sm:-top-16 -right-24 sm:-right-32 rounded-[58%_42%_48%_52%/52%_48%_52%_48%]"
        }`}
        style={{
          background: isSubtle
            ? "radial-gradient(ellipse at 65% 45%, rgba(200, 228, 205, 0.34) 0%, rgba(165, 220, 180, 0.16) 42%, rgba(82, 211, 112, 0.05) 68%, transparent 82%)"
            : "radial-gradient(ellipse at 65% 45%, rgba(195, 232, 205, 0.52) 0%, rgba(155, 222, 175, 0.25) 45%, rgba(82, 211, 112, 0.08) 70%, transparent 85%)",
          filter: "blur(42px)",
        }}
      />

      {/* Secondary Right Lower Accent Blob */}
      <div
        className={`absolute pointer-events-none ${
          isAlt
            ? "w-[320px] sm:w-[440px] h-[340px] sm:h-[460px] -bottom-14 -right-20 sm:-right-28 rounded-full"
            : "w-[340px] sm:w-[460px] h-[360px] sm:h-[480px] bottom-[8%] -right-20 sm:-right-32 rounded-full"
        }`}
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(215, 240, 218, 0.42) 0%, rgba(82, 211, 112, 0.09) 55%, transparent 75%)",
          filter: "blur(46px)",
        }}
      />

      {/* =========================================================================
          3. SWEEPING CONTOUR GREEN LINES (EXACT REFERENCE CURVES)
          Emerald green lines (#52D370) arcing gracefully on left and right sides
          ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 760"
        fill="none"
        preserveAspectRatio="none"
      >
        {isAlt ? (
          <>
            {/* Alternate Variant - Left Side Sweeping Arcs */}
            <path
              d="M -40 120 C 180 180 240 380 40 640"
              stroke="#52D370"
              strokeWidth="1.5"
              strokeOpacity="0.45"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M -80 280 C 120 340 160 480 -20 690"
              stroke="#52D370"
              strokeWidth="1"
              strokeOpacity="0.25"
              vectorEffect="non-scaling-stroke"
            />

            {/* Alternate Variant - Right Side Sweeping Arcs */}
            <path
              d="M 1480 80 C 1220 200 1260 480 1480 660"
              stroke="#52D370"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 1520 220 C 1320 320 1360 520 1500 720"
              stroke="#52D370"
              strokeWidth="1"
              strokeOpacity="0.28"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : (
          <>
            {/* Default Variant - Left Side Sweeping Arcs (Matching Reference Image) */}
            <path
              d="M -40 320 C 120 370 140 470 -30 580"
              stroke="#52D370"
              strokeWidth="1.5"
              strokeOpacity="0.48"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M -80 180 C 160 260 170 520 -50 680"
              stroke="#52D370"
              strokeWidth="1"
              strokeOpacity="0.25"
              vectorEffect="non-scaling-stroke"
            />

            {/* Default Variant - Right Side Sweeping Arcs (Prominent Curve behind 4th Card) */}
            <path
              d="M 1480 180 C 1240 240 1220 460 1480 620"
              stroke="#52D370"
              strokeWidth="1.5"
              strokeOpacity="0.52"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 1420 80 C 1280 180 1310 380 1520 540"
              stroke="#52D370"
              strokeWidth="1"
              strokeOpacity="0.3"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

        {/* Delicate structural architectural dashed accents for senior craftsmanship */}
        <path
          d={
            isAlt
              ? "M 1400 40 C 1290 190 1320 360 1460 540"
              : "M 40 40 C 140 190 120 380 -40 560"
          }
          stroke="#091c09"
          strokeWidth="1"
          strokeDasharray="3 7"
          strokeOpacity="0.08"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

