"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    WebGLFluid?: (canvas: HTMLCanvasElement, options: Record<string, unknown>) => void;
  }
}

type FluidMode = "hero" | "off";

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

const PROXY_EVENT_TYPES: Array<keyof WindowEventMap> = ["mousemove", "mousedown", "touchstart", "touchmove"];

export function FluidBackground({ mode, isMuted }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initializedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const loseContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    initializedRef.current = false;
  }, []);

  const initializeFluid = useCallback(() => {
    if (initializedRef.current || !canvasRef.current || !window.WebGLFluid) return;
    initializedRef.current = true;
    window.WebGLFluid(canvasRef.current, FLUID_CONFIG);
  }, []);

  useEffect(() => {
    if (mode === "off") return;

    initializeFluid();

    let isThrottled = false;
    let moveSkipCounter = 0;

    const proxyEvent = (event: MouseEvent | TouchEvent) => {
      if (!initializedRef.current || isThrottled || !canvasRef.current) return;

      if (isMutedRef.current && event.type === "mousemove") {
        moveSkipCounter += 1;
        if (moveSkipCounter % 4 !== 0) return;
      }

      isThrottled = true;
      requestAnimationFrame(() => { isThrottled = false; });

      let clientX: number;
      let clientY: number;

      if (event instanceof TouchEvent) {
        const touch = event.touches[0] ?? event.changedTouches[0];
        if (!touch) return;
        ({ clientX, clientY } = touch);
      } else {
        ({ clientX, clientY } = event);
      }

      canvasRef.current.dispatchEvent(
        new MouseEvent(event.type, { clientX, clientY, bubbles: false, cancelable: true, view: window })
      );
    };

    PROXY_EVENT_TYPES.forEach((type) => window.addEventListener(type, proxyEvent as EventListener, { passive: true }));

    return () => {
      PROXY_EVENT_TYPES.forEach((type) => window.removeEventListener(type, proxyEvent as EventListener));
    };
  }, [initializeFluid, mode]);

  useEffect(() => {
    return () => loseContext();
  }, [loseContext]);

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
        className="pointer-events-none fixed inset-0 z-1 h-screen w-screen transition-opacity duration-500 filter-[invert(0)_hue-rotate(0deg)_contrast(1)_saturate(1)_blur(0px)]"
        style={{ opacity: mode === "off" ? 0 : 1 }}
      />
    </>
  );
}
