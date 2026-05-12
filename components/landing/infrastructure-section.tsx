"use client";

import { useEffect, useState, useRef } from "react";

const stackLayers = [
  { name: "Phoenix LiveView", role: "Real-time UI", status: "native" },
  { name: "Ash Framework", role: "Domain layer", status: "native" },
  { name: "Oban", role: "Background jobs", status: "native" },
  { name: "Postgres", role: "Persistence", status: "native" },
  { name: "BEAM / OTP", role: "Runtime", status: "native" },
  { name: "Foundry spec-kit", role: "Governed copilot", status: "foundry" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % stackLayers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              The stack
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8" id="infrastructure">
              The infrastructure
              <br />
              decision you&apos;ll never
              <br />
              have to make.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              The BEAM was built by Ericsson for telephone exchanges — systems that 
              needed to run without failure under millions of concurrent connections. 
              Foundry gives you this foundation from the first line you write.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">2M</div>
                <div className="text-sm text-muted-foreground">WebSockets, one server</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">~1KB</div>
                <div className="text-sm text-muted-foreground">Per connection</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">0</div>
                <div className="text-sm text-muted-foreground">GC pauses</div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Foundry Stack</span>
                <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Pre-integrated
                </span>
              </div>

              {/* Stack layers */}
              <div>
                {stackLayers.map((layer, index) => (
                  <div
                    key={layer.name}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      activeLocation === index ? "bg-foreground/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeLocation === index ? "bg-foreground" : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{layer.name}</div>
                        <div className="text-sm text-muted-foreground">{layer.role}</div>
                      </div>
                    </div>
                    <span className={`font-mono text-xs px-2 py-1 border ${
                      layer.status === "foundry" 
                        ? "border-foreground/40 text-foreground" 
                        : "border-foreground/10 text-muted-foreground"
                    }`}>
                      {layer.status === "foundry" ? "foundry" : "native"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
