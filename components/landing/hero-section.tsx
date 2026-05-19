"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FluidBackground } from "./fluid-background";

const words = ["governs", "enforces", "scales", "endures"];
const stats = [
  { value: "2M", label: "WebSockets on a single node" },
  { value: "0%", label: "Spec-code drift" },
  { value: "10x", label: "Faster reviews" },
  { value: "-94%", label: "Cloud bill" },
  { value: "100%", label: "Visualizable code" },
  { value: "Eject", label: "At any time" },
  { value: "150→5", label: "Servers" },
  { value: "$2M/yr", label: "Savings in case" },
  { value: "$150/mo", label: "vs $16k Lambda" },
  { value: "80.3%", label: "LLM Pass@1 on Elixir" },
  { value: "2–3×", label: "Less code than TypeScript" },
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [fluidMode, setFluidMode] = useState<"hero" | "feature" | "how-it-works" | "off">("hero");
  const [isFluidMuted, setIsFluidMuted] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const featuresSection = document.getElementById("features");
    const howItWorksSection = document.getElementById("how-it-works");

    if (!featuresSection || !howItWorksSection) return;

    let ticking = false;

    const updateFluidMode = () => {
      const featuresTop = featuresSection.getBoundingClientRect().top;
      const howItWorksTop = howItWorksSection.getBoundingClientRect().top;
      const featureThreshold = window.innerHeight * 0.82;
      const howItWorksThreshold = window.innerHeight * 0.5;
      const endThreshold = window.innerHeight * -0.5;

      if (howItWorksTop <= howItWorksThreshold) {
        setFluidMode("off");
      } else if (howItWorksTop <= endThreshold) {
        setFluidMode("how-it-works");
      } else if (featuresTop <= featureThreshold) {
        setFluidMode("feature");
      } else {
        setFluidMode("hero");
      }
    };

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        updateFluidMode();
        ticking = false;
      });
    };

    updateFluidMode();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#050408] text-white"
      onPointerMove={(event) => {
        setIsFluidMuted(event.target === event.currentTarget);
      }}
      onPointerLeave={() => setIsFluidMuted(true)}
    >
      <FluidBackground mode={fluidMode} isMuted={(fluidMode === "hero" || fluidMode === "how-it-works") && isFluidMuted} />
      {/* <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[2] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[length:8.33%_12.5%] transition-opacity duration-[800ms] ease-out",
          fluidMode === "off" ? "opacity-[0.03]" : fluidMode === "feature" ? "opacity-[0.05]" : "opacity-10",
        )}
      /> */}

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-40 pt-32 sm:pt-36 lg:px-20 lg:pb-44 lg:pt-40">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div
            className={cn(
              "transition-all duration-1000",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <Image
              src="/foundry-logo.png"
              alt="Foundry logo"
              width={400}
              height={400}
              priority
              className="h-24 w-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] sm:h-32 lg:h-72"
            />
          </div>

          <h1
            className={cn(
              "max-w-[10ch] font-sans text-[clamp(3.5rem,11vw,9.5rem)] leading-[0.84] font-normal tracking-[-0.04em] [text-shadow:1px_0_30px_rgba(0,0,0,0.2)] transition-all duration-1000",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="block">Your codebase</span>
            <span className="block">
              that{" "}
              <span key={wordIndex} className="inline-flex min-w-[1.2em] text-[#fc7b03]">
                {words[wordIndex].split("").map((char, index) => (
                  <span
                    key={`${wordIndex}-${index}`}
                    className="inline-block animate-char-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          </h1>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          <div
            className={cn(
              "max-w-2xl transition-all duration-700 delay-200 [text-shadow:1px_0_2px_rgba(0,0,0,0.22)]",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <p
              className={cn(
                "mb-8 text-3xl font-medium leading-tight xxl:text-44xl xxl:leading-[1.18]",
                "text-white/96",
              )}
            >
              Build, run, and understand complex platforms — without the complexity.
              
              </p>
                          <p
              className={cn(
                "mb-3 text-xl font-medium leading-6 xxl:text-2xl xxl:leading-8",
                "text-[#f5f1ea]",
              )}
            >
              A full-stack development environment with a live system graph that knows your domain. Your AI copilot works from code, tests, traces, and decisions — not from guesses. Everything your team needs from day one. 
              </p>
            <p
              className={cn(
                "mt-8 text-md italic leading-tight",
                "text-white/80",
              )}
            >
              Foundry built on Elixir/Ash ecosystem and Open Source. <br/>Eject code any time.
            </p>
          </div>

          <div
            className={cn(
              "pointer-events-auto flex flex-wrap items-center justify-start gap-4 transition-all duration-700 delay-300 lg:justify-end lg:gap-6",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <Button
              asChild
              size="lg"
              className="h-auto rounded-full border border-white bg-white px-8 py-4 text-base font-bold text-black shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[##f5f1ea] hover:text-black sm:px-10 sm:py-5 sm:text-lg"
            >
              <Link href="#">
                Take a Tour
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-full border-white/30 bg-transparent px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-transparent hover:bg-black hover:text-white sm:px-10 sm:py-5 sm:text-lg"
            >
              <Link href="#">Source Code</Link>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-12 overflow-hidden transition-all duration-700 delay-500",
          isVisible ? (fluidMode === "off" ? "opacity-25" : "opacity-40") : "opacity-0",
        )}
      >
        <div className="whitespace-nowrap py-6">
          <div className="flex w-max items-baseline gap-12 [animation:marquee_90s_linear_infinite] [will-change:transform]">
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                className="flex items-baseline gap-12"
                aria-hidden={copyIndex === 1}
              >
                {stats.map((stat) => (
                  <div
                    key={`${copyIndex}-${stat.value}-${stat.label}`}
                    className="flex items-baseline gap-4"
                  >
                    <span
                      className="text-4xl font-black text-white sm:text-5xl lg:text-6xl"
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/75 sm:text-xs"
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
