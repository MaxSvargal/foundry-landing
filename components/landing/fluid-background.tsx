"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    WebGLFluid?: (canvas: HTMLCanvasElement, options: Record<string, unknown>) => void;
  }
}

type FluidMode = "hero" | "feature" | "how-it-works" | "off";

interface FluidBackgroundProps {
  mode: FluidMode;
  isMuted: boolean;
}

const FLUID_CONFIG: Record<string, unknown> = {
  TRIGGER: "hover",
  IMMEDIATE: true,
  AUTO: false,
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  DENSITY_DISSIPATION: 0.97,
  VELOCITY_DISSIPATION: 0.98,
  PRESSURE: 0.8,
  CURL: 30,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLORFUL: true,
  COLOR_UPDATE_SPEED: 4,
  TRANSPARENT: true,
  BLOOM: true,
  BLOOM_ITERATIONS: 8,
  BLOOM_RESOLUTION: 256,
  BLOOM_INTENSITY: 0.8,
  BLOOM_THRESHOLD: 0.6,
  SUNRAYS: true,
  SUNRAYS_RESOLUTION: 196,
  SUNRAYS_WEIGHT: 1,
};

export function FluidBackground({ mode, isMuted }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initializedRef = useRef(false);

  const initializeFluid = useCallback(() => {
    if (initializedRef.current) return;

    const canvas = canvasRef.current;
    const WebGLFluid = window.WebGLFluid;

    if (!canvas || !WebGLFluid) return;

    initializedRef.current = true;
    WebGLFluid(canvas, FLUID_CONFIG);
  }, []);

  useEffect(() => {
    if (mode === "off") return;

    initializeFluid();

    let isThrottled = false;
    let moveSkipCounter = 0;

    const proxyEvent = (event: MouseEvent | TouchEvent) => {
      if ("isProxy" in event && (event as Record<string, unknown>).isProxy) return;
      if (isThrottled || !canvasRef.current) return;

      const shouldThinMouseMoves = mode === "feature" || mode === "how-it-works" || isMuted;

      if (shouldThinMouseMoves && event.type === "mousemove") {
        moveSkipCounter += 1;
        if (moveSkipCounter % (mode === "feature" ? 3 : 4) !== 0) return;
      }

      isThrottled = true;
      window.requestAnimationFrame(() => {
        isThrottled = false;
      });

      let clientX: number;
      let clientY: number;

      if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ("changedTouches" in event && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        const mouseEvent = event as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
      }

      const proxied = new MouseEvent(event.type, {
        clientX,
        clientY,
        bubbles: false,
        cancelable: true,
        view: window,
      }) as MouseEvent & { isProxy?: boolean };

      proxied.isProxy = true;
      canvasRef.current.dispatchEvent(proxied);
    };
    const eventTypes: Array<keyof WindowEventMap> = ["mousemove", "mousedown", "touchstart", "touchmove"];

    eventTypes.forEach((type) => {
      window.addEventListener(type, proxyEvent as EventListener, { passive: true });
    });

    return () => {
      eventTypes.forEach((type) => {
        window.removeEventListener(type, proxyEvent as EventListener);
      });
    };
  }, [initializeFluid, isMuted, mode]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/webgl-fluid@0.3.0"
        strategy="afterInteractive"
        onLoad={initializeFluid}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[1] h-screen w-screen transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[filter,opacity]",
          mode === "off"
            ? "opacity-0 [filter:blur(0px)]"
            : mode === "feature"
              ? "opacity-100 [filter:invert(0)_hue-rotate(-10deg)_contrast(1.08)_saturate(1.05)_blur(0px)]"
              : mode === "how-it-works"
                ? "opacity-80 [filter:invert(0)_hue-rotate(0deg)_contrast(1)_saturate(0.8)_blur(0px)]"
                : "opacity-100 [filter:invert(0)_hue-rotate(0deg)_contrast(1)_saturate(1)_blur(0px)]",
        )}
      />
    </>
  );
}
