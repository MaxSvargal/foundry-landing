"use client";

import { useEffect, useRef } from "react";

type Vec3 = { x: number; y: number; z: number };

function rotateY(p: Vec3, a: number): Vec3 {
  return { x: p.x * Math.cos(a) - p.z * Math.sin(a), y: p.y, z: p.x * Math.sin(a) + p.z * Math.cos(a) };
}
function rotateX(p: Vec3, a: number): Vec3 {
  return { x: p.x, y: p.y * Math.cos(a) - p.z * Math.sin(a), z: p.y * Math.sin(a) + p.z * Math.cos(a) };
}
function rotateZ(p: Vec3, a: number): Vec3 {
  return { x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a), z: p.z };
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
}
function smootherstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function hash(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}
function noise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i), hash(i + 1), u) * 2 - 1;
}

function sampleSphere(u: number, v: number): Vec3 {
  const theta = u * Math.PI * 2;
  const phi = v * Math.PI;
  return { x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta) };
}

function sampleCube(u: number, v: number): Vec3 {
  const face = Math.floor(u * 6);
  const fu = (u * 6) % 1;
  const s = fu * 2 - 1;
  const t = v * 2 - 1;
  const r = 0.72;
  switch (face) {
    case 0: return { x:  r, y: s * r, z: t * r };
    case 1: return { x: -r, y: s * r, z: t * r };
    case 2: return { x: s * r, y:  r, z: t * r };
    case 3: return { x: s * r, y: -r, z: t * r };
    case 4: return { x: s * r, y: t * r, z:  r };
    default: return { x: s * r, y: t * r, z: -r };
  }
}

function sampleOctahedron(u: number, v: number): Vec3 {
  const theta = u * Math.PI * 2;
  const phi = v * Math.PI;
  const sx = Math.sin(phi) * Math.cos(theta);
  const sy = Math.cos(phi);
  const sz = Math.sin(phi) * Math.sin(theta);
  const denom = Math.abs(sx) + Math.abs(sy) + Math.abs(sz);
  if (denom < 1e-6) return { x: 0, y: sy > 0 ? 1 : -1, z: 0 };
  return { x: sx / denom, y: sy / denom, z: sz / denom };
}

const tetraVerts: Vec3[] = [
  { x: 0,      y: 1,      z: 0    },
  { x: -0.943, y: -0.333, z: -0.5 },
  { x:  0.943, y: -0.333, z: -0.5 },
  { x:  0,     y: -0.333, z: 1    },
];
const tetraFaces = [[0,1,2],[0,2,3],[0,3,1],[1,3,2]];

function sampleTetrahedron(u: number, v: number): Vec3 {
  const faceIdx = Math.floor(u * 4);
  const fu = (u * 4) % 1;
  const [i, j, k] = tetraFaces[Math.min(faceIdx, 3)];
  const sq = Math.sqrt(fu);
  const ba = 1 - sq;
  const bb = sq * (1 - v);
  const bc = sq * v;
  const v1 = tetraVerts[i], v2 = tetraVerts[j], v3 = tetraVerts[k];
  return {
    x: v1.x * ba + v2.x * bb + v3.x * bc,
    y: v1.y * ba + v2.y * bb + v3.y * bc,
    z: v1.z * ba + v2.z * bb + v3.z * bc,
  };
}

const SHAPES = [
  { fn: sampleSphere,      holdSec: 4.0 },
  { fn: sampleCube,        holdSec: 4.0 },
  { fn: sampleOctahedron,  holdSec: 4.0 },
  { fn: sampleTetrahedron, holdSec: 4.0 },
];
const MORPH_DURATION = 2.5;
// Total cycle length
const CYCLE = SHAPES.reduce((acc, s) => acc + s.holdSec + MORPH_DURATION, 0);

// Two char layers: dim base and bright shimmer
const charsBase    = "·:░▒";
const charsShimmer = "▓█▀▄▌▐│─┤├╭╮╰╯";

const POINT_COUNT = 480;

export function AnimatedTetrahedron() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const uvs = Array.from({ length: POINT_COUNT }, (_, i) => ({
      u: (i + 0.5) / POINT_COUNT,
      v: hash(i * 7.3 + 1.3),
      seed: i,
      // stagger shimmer phase per particle
      shimmerPhase: hash(i * 3.7) * Math.PI * 2,
    }));

    let startTime: number | null = null;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (ts: number) => {
      if (!startTime) startTime = ts;
      // Loop elapsed time over the full cycle
      const elapsed = ((ts - startTime) / 1000) % CYCLE;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const baseScale = Math.min(rect.width, rect.height) * 0.36;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Resolve shape state from looped elapsed time
      let cursor = 0;
      let fromIdx = 0;
      let toIdx = 0;
      let morphT = 1;

      for (let s = 0; s < SHAPES.length; s++) {
        const holdEnd = cursor + SHAPES[s].holdSec;
        const morphEnd = holdEnd + MORPH_DURATION;
        if (elapsed < holdEnd) {
          fromIdx = s;
          toIdx = s;
          morphT = 1;
          break;
        } else if (elapsed < morphEnd) {
          fromIdx = s;
          toIdx = (s + 1) % SHAPES.length;
          morphT = smootherstep((elapsed - holdEnd) / MORPH_DURATION);
          break;
        }
        cursor = morphEnd;
      }

      // Breathing: gentle scale pulse during hold, dampened during morph
      const holdPhase = elapsed - cursor; // time inside current hold
      const breathAmt = 1 - morphT * 0.6; // weaker during morph
      const breath = 1 + Math.sin(holdPhase * 1.4) * 0.025 * breathAmt;
      const scale = baseScale * breath;

      // Organic rotation with noise drift
      const fullElapsed = (ts - startTime!) / 1000;
      const rotY = fullElapsed * 0.28 + noise(fullElapsed * 0.07) * 0.18;
      const rotX = fullElapsed * 0.19 + noise(fullElapsed * 0.05 + 10) * 0.13;
      const rotZ = fullElapsed * 0.11 + noise(fullElapsed * 0.04 + 20) * 0.09;

      const points: { x: number; y: number; z: number; char: string; size: number }[] = [];

      for (const { u, v, seed, shimmerPhase } of uvs) {
        const pFrom = SHAPES[fromIdx].fn(u, v);
        const pTo   = SHAPES[toIdx].fn(u, v);

        // More wobble mid-morph, calmer during hold
        const wobble = 0.025 + 0.04 * (1 - Math.abs(morphT * 2 - 1));
        const wx = noise(seed * 0.31 + fullElapsed * 0.9) * wobble;
        const wy = noise(seed * 0.47 + fullElapsed * 0.8 + 5) * wobble;
        const wz = noise(seed * 0.61 + fullElapsed * 0.7 + 10) * wobble;

        let p = lerpVec(pFrom, pTo, morphT);
        p = { x: p.x + wx, y: p.y + wy, z: p.z + wz };

        p = rotateY(p, rotY);
        p = rotateX(p, rotX);
        p = rotateZ(p, rotZ);

        const depth = (p.z + 1.5) / 3; // 0..1, 1 = closest

        // Shimmer: each particle independently flickers between base and bright char
        const shimmerNoise = noise(seed * 0.19 + fullElapsed * 1.8 + shimmerPhase);
        const isShimmer = shimmerNoise > 0.55;
        let char: string;
        if (isShimmer) {
          const idx = Math.floor(depth * (charsShimmer.length - 1));
          char = charsShimmer[Math.max(0, Math.min(idx, charsShimmer.length - 1))];
        } else {
          const idx = Math.floor(depth * (charsBase.length - 1));
          char = charsBase[Math.max(0, Math.min(idx, charsBase.length - 1))];
        }

        // Closer particles are slightly larger
        const size = 11 + depth * 5;

        points.push({ x: centerX + p.x * scale, y: centerY - p.y * scale, z: p.z, char, size });
      }

      points.sort((a, b) => a.z - b.z);

      let lastSize = -1;
      points.forEach((pt) => {
        if (pt.size !== lastSize) {
          ctx.font = `${pt.size.toFixed(0)}px monospace`;
          lastSize = pt.size;
        }
        const alpha = 0.1 + (pt.z + 1.5) * 0.3;
        ctx.fillStyle = `rgba(0,0,0,${Math.min(alpha, 0.95)})`;
        ctx.fillText(pt.char, pt.x, pt.y);
      });

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
