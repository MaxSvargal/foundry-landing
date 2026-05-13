"use client";

import { useId } from "react";

export function LiquidGlassBackdrop() {
  const rawId = useId();
  const filterId = `liquid-glass-${rawId.replace(/:/g, "")}`;

  return (
    <>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0"
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.02"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.8" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="58"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div
          className="absolute inset-0 bg-white/84 supports-[backdrop-filter]:bg-white/38"
          style={{
            WebkitBackdropFilter: "blur(36px) saturate(1.85) brightness(1.1)",
            backdropFilter: "blur(36px) saturate(1.85) brightness(1.1)",
          }}
        />
        <div
          className="absolute inset-0 opacity-95"
          style={{
            filter: `url(#${filterId})`,
            backgroundImage: [
              "radial-gradient(40rem 26rem at 16% 10%, rgba(255,255,255,1), rgba(255,255,255,0.62) 34%, rgba(255,255,255,0.18) 70%, transparent 100%)",
              "radial-gradient(32rem 20rem at 84% 16%, rgba(255,255,255,0.94), rgba(255,255,255,0.36) 42%, transparent 100%)",
              "radial-gradient(46rem 22rem at 50% 86%, rgba(255,255,255,0.56), rgba(255,255,255,0.18) 44%, transparent 100%)",
            ].join(", "),
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.64)_18%,rgba(255,255,255,0.36)_52%,rgba(255,255,255,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_22%,transparent_74%,rgba(255,255,255,0.24))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(255,255,255,0.42)_42%,transparent_76%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.48),transparent_72%)] blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.42),transparent)]" />
        <div className="absolute inset-y-0 right-0 w-10 bg-[linear-gradient(270deg,rgba(255,255,255,0.34),transparent)]" />
      </div>
    </>
  );
}
