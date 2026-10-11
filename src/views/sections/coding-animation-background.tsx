'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface CodeParticle {
  x: number;
  y: number;
  speed: number;
  text: string;
  opacity: number;
  fontSize: number;
  colorType: 'keyword' | 'fn' | 'type' | 'comment' | 'operator' | 'literal';
}

const ENTERPRISE_CODE_SNIPPETS = [
  'async function buildArchitecture(pipeline: DataPipeline): Promise<Platform>',
  'const { latency, throughput } = await edgeMesh.routeTraffic(req);',
  'interface DistributedCluster<T extends Microservice> {',
  '  @ZeroDowntime @Immutable readonly id: UUID;',
  '  executeCutover(target: StageEnvironment): CutoverResult;',
  '}',
  'type StrictContract<T> = { [K in keyof T]-?: Validated<T[K]> };',
  'const tokenEmbeddings = await vectorEngine.query({ vector, topK: 12 });',
  'SELECT status, p99_latency_ms FROM telemetry_events WHERE error = false;',
  'export const dynamic = "force-dynamic"; // 100% Deterministic SSR',
  'const stream = new ReadableStream({ start(controller) { ... } });',
  'docker run --security-opt=no-new-privileges:true astraiv/engine:latest',
  'git commit -m "feat(core): sub-millisecond multi-region state machine"',
  'HTTP/3 200 OK · TLS 1.3 · ECDSA_P384 · Brotli 11 Compression',
  'k8s.io/v1 NodePool: autoscaling: { min: 3, max: 120, targetCPU: 70% }',
  'const dbPool = createPgBouncerPool({ maxConnections: 1000, ssl: true });',
  '// Quality Gate #04: 100% Strict Type Verification & Zero Regressions',
  'const model = new OpenAICompat({ temperature: 0.2, streaming: true });',
  'function computeCosineSimilarity(a: Float32Array, b: Float32Array): number',
  'pipeline.pipe(transformStream).pipe(gzipCompressor).pipe(r2Storage);',
  'POST /api/v1/auth/verify-mfa · RBAC: { role: "Architect", pass: true }',
  'const cache = new RedisCluster({ nodes: ["edge-1", "edge-2", "edge-3"] });',
];

export function CodingAnimationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // IntersectionObserver to pause rendering when scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: '200px' }
    );
    observer.observe(container);

    const isDark = resolvedTheme === 'dark';

    // High DPI Canvas Scaling
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 2000;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 45), 28);
    const particles: CodeParticle[] = [];

    const colorTypes: CodeParticle['colorType'][] = ['keyword', 'fn', 'type', 'comment', 'operator', 'literal'];

    for (let i = 0; i < particleCount; i++) {
      const snippet = ENTERPRISE_CODE_SNIPPETS[Math.floor(Math.random() * ENTERPRISE_CODE_SNIPPETS.length)];
      particles.push({
        x: Math.random() * (canvas.clientWidth || window.innerWidth),
        y: Math.random() * (canvas.clientHeight || 2000),
        speed: Math.random() * 0.35 + 0.15,
        text: snippet,
        opacity: Math.random() * 0.4 + 0.3,
        fontSize: Math.floor(Math.random() * 3) + 11, // 11px to 13px
        colorType: colorTypes[Math.floor(Math.random() * colorTypes.length)],
      });
    }

    const getColor = (colorType: CodeParticle['colorType'], opacity: number) => {
      if (isDark) {
        switch (colorType) {
          case 'keyword':
            return `rgba(56, 189, 248, ${opacity * 0.18})`; // Light Cyan
          case 'fn':
            return `rgba(96, 165, 250, ${opacity * 0.22})`; // Blue
          case 'type':
            return `rgba(0, 245, 212, ${opacity * 0.16})`; // Neon Mint
          case 'operator':
            return `rgba(147, 197, 253, ${opacity * 0.15})`; // Ice Blue
          case 'literal':
            return `rgba(165, 180, 252, ${opacity * 0.14})`; // Indigo
          case 'comment':
          default:
            return `rgba(148, 163, 184, ${opacity * 0.12})`; // Slate
        }
      } else {
        // Light Mode
        switch (colorType) {
          case 'keyword':
            return `rgba(11, 61, 145, ${opacity * 0.13})`; // Deep Blue
          case 'fn':
            return `rgba(29, 78, 216, ${opacity * 0.14})`; // Royal
          case 'type':
            return `rgba(2, 132, 199, ${opacity * 0.12})`; // Sapphire
          case 'operator':
            return `rgba(59, 130, 246, ${opacity * 0.11})`; // Sky Blue
          case 'literal':
            return `rgba(67, 56, 202, ${opacity * 0.12})`; // Indigo
          case 'comment':
          default:
            return `rgba(100, 116, 139, ${opacity * 0.09})`; // Slate
        }
      }
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isVisible) {
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || 2000;

        ctx.clearRect(0, 0, width, height);

        // Render code streams
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.y -= p.speed * 40 * delta; // Drifting slowly upward
          if (p.y < -50) {
            p.y = height + 30;
            p.x = Math.random() * width;
            p.text = ENTERPRISE_CODE_SNIPPETS[Math.floor(Math.random() * ENTERPRISE_CODE_SNIPPETS.length)];
            p.opacity = Math.random() * 0.4 + 0.3;
          }

          ctx.font = `${p.fontSize}px var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          ctx.fillStyle = getColor(p.colorType, p.opacity);
          ctx.fillText(p.text, p.x, p.y);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mounted, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 top-[600px] bottom-0 w-full pointer-events-none select-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85 dark:opacity-90"
      />
    </div>
  );
}
