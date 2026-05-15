"use client";

export function LiquidGlassBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <div
        className="absolute inset-0 bg-white/86 supports-[backdrop-filter]:bg-white/34"
        style={{
          WebkitBackdropFilter: "blur(18px) saturate(1.2)",
          backdropFilter: "blur(18px) saturate(1.2)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.7)_18%,rgba(255,255,255,0.5)_54%,rgba(255,255,255,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(44rem_22rem_at_18%_10%,rgba(255,255,255,0.9),transparent_62%),radial-gradient(34rem_18rem_at_82%_16%,rgba(255,255,255,0.62),transparent_64%),radial-gradient(42rem_20rem_at_50%_100%,rgba(255,255,255,0.34),transparent_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_24%,transparent_76%,rgba(255,255,255,0.18))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(255,255,255,0.22)_46%,transparent_78%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.3),transparent_72%)]" />
      <div className="absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,rgba(255,255,255,0.28),transparent)]" />
      <div className="absolute inset-y-0 right-0 w-8 bg-[linear-gradient(270deg,rgba(255,255,255,0.22),transparent)]" />
    </div>
  );
}
