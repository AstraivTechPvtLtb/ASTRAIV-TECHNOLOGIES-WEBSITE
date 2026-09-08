'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Cloud, Zap, Layers } from 'lucide-react';

interface FeatureCard {
  id: number;
  category: string;
  label: string;
  subtitle: string;
  description: string;
  metric: string;
  color: string;
  image: string;
  icon: typeof Sparkles;
}

const items: FeatureCard[] = [
  {
    id: 1,
    category: 'ARTIFICIAL INTELLIGENCE',
    label: 'Cognitive AI & Neural RAG',
    subtitle: 'Autonomous Multi-Agent Architecture',
    description: 'Production-ready LLM pipelines, vector embeddings, and self-improving cognitive agents built for enterprise-grade reasoning and intelligence.',
    metric: '10x Faster Retrieval',
    color: '#00C2FF',
    image: '/features/feature-ai.jpg',
    icon: Cpu,
  },
  {
    id: 2,
    category: 'SOFTWARE ENGINEERING',
    label: 'Next-Gen SaaS Platforms',
    subtitle: 'High-Velocity Web Applications',
    description: 'Engineered on Next.js 15, React 19, and modular micro-frontends with sub-millisecond edge transitions and real-time data streaming.',
    metric: 'Sub-50ms Edge Latency',
    color: '#6366F1',
    image: '/features/feature-saas.jpg',
    icon: Layers,
  },
  {
    id: 3,
    category: 'DEVOPS & CLOUD',
    label: 'Resilient Cloud Mesh',
    subtitle: 'Zero-Downtime Distributed Nodes',
    description: 'Multi-region cloud infrastructure with automated failovers, auto-scaling Kubernetes clusters, and global Cloudflare edge caching.',
    metric: '99.99% Uptime SLA',
    color: '#0284C7',
    image: '/features/feature-cloud.jpg',
    icon: Cloud,
  },
  {
    id: 4,
    category: 'INFOSEC & GOVERNANCE',
    label: 'Enterprise Security Shield',
    subtitle: 'Military-Grade Compliance by Design',
    description: 'SOC2 and ISO 27001-ready posture featuring quantum-resistant encryption, biometric authorization gates, and automated security telemetry.',
    metric: 'Zero-Trust Cryptography',
    color: '#10B981',
    image: '/features/feature-security.jpg',
    icon: ShieldCheck,
  },
  {
    id: 5,
    category: 'PROCESS AUTOMATION',
    label: 'Autonomous Workflows',
    subtitle: 'Frictionless Enterprise Operations',
    description: 'Unifying CRM synchronization, automated billing pipelines, event telemetry, and ERP data flows to eliminate operational drag.',
    metric: '40%+ Operational Savings',
    color: '#F59E0B',
    image: '/features/feature-automation.jpg',
    icon: Zap,
  },
];

export function ScrollHorizontal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    itemWidth: 420,
    gap: 32,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setDimensions({ itemWidth: 290, gap: 20 });
      } else if (window.innerWidth <= 1024) {
        setDimensions({ itemWidth: 360, gap: 24 });
      } else {
        setDimensions({ itemWidth: 420, gap: 32 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Move from first item centered to last item centered
  const totalDistance = (items.length - 1) * (dimensions.itemWidth + dimensions.gap);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <div id="company-features" className="scroll-horizontal-root">
      {/* Intro Section */}
      <section className="intro-section">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-primary/10 dark:bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 border border-primary/30 dark:border-accent/30 mb-5 backdrop-blur-md shadow-[0_0_16px_rgba(91,95,239,0.12)] dark:shadow-[0_0_18px_rgba(0,194,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-primary dark:text-accent animate-pulse" />
            <span>Core Engineering Pillars</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
            Architected for <span className="bg-gradient-to-r from-primary via-secondary to-accent dark:from-accent dark:via-cyan-300 dark:to-white bg-clip-text text-transparent">Hyper-Velocity</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Explore the flagship technologies powering our enterprise solutions — engineered with zero compromises on performance, security, and scalability.
          </p>

          <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span>Scroll horizontally to inspect</span>
            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center animate-bounce">
              <span className="w-1 h-1 rounded-full bg-primary dark:bg-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Horizontal Scroll Section */}
      <div ref={containerRef} className="scroll-container">
        <div 
          className="sticky-wrapper"
          style={{
            ['--item-width' as string]: `${dimensions.itemWidth}px`,
            ['--item-gap' as string]: `${dimensions.gap}px`,
          }}
        >
          <motion.div 
            className="gallery" 
            style={shouldReduceMotion ? {} : { x }}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="gallery-item group"
                  style={
                    {
                      '--item-color': item.color,
                      '--item-image': `url(${item.image})`,
                    } as React.CSSProperties
                  }
                >
                  {/* Top Bar with Number Badge and Metric */}
                  <div className="item-top-bar">
                    <span className="item-number">
                      <span className="font-mono font-bold tracking-wider">0{item.id}</span>
                      <span className="opacity-40">/</span>
                      <span className="text-[10px] opacity-75 font-semibold tracking-widest">{item.category}</span>
                    </span>

                    <div className="item-metric">
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      <span>{item.metric}</span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="item-content">
                    <p className="item-subtitle" style={{ color: item.color }}>
                      {item.subtitle}
                    </p>
                    <h3 className="item-title">{item.label}</h3>
                    <p className="item-desc">{item.description}</p>

                    {/* Interactive Capability Badge */}
                    <div className="item-action">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-white flex items-center gap-1.5 transition-colors">
                        Enterprise Capability
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: item.color }} />
                      </span>
                    </div>
                  </div>

                  {/* Glowing Top Border Beam */}
                  <div 
                    className="item-glow-bar" 
                    style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Outro Section */}
      <section className="outro-section">
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto text-center px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent mb-3">
            NEXT-GENERATION DEPLOYMENT
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Ready to Accelerate Your Digital Stack?
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Partner with Astraiv Technologies to architect, deploy, and scale your mission-critical applications with unmatched speed.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 dark:bg-accent dark:text-slate-950 dark:hover:bg-cyan-300 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Schedule Architecture Call</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-800 shadow-xs transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore All Services</span>
            </Link>
          </div>
        </div>
      </section>

      <StyleSheet />
    </div>
  );
}

/**
 * ============== Stylesheet ===============
 */
function StyleSheet() {
  return (
    <style>{`
      body {
        overflow-x: hidden;
      }

      .scroll-horizontal-root {
        position: relative;
        height: auto;
        overflow-x: clip;
        background: transparent;
      }

      .intro-section {
        min-height: 48vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        padding: 60px 24px 40px 24px;
        position: relative;
      }

      .scroll-container {
        height: 320vh;
        position: relative;
      }

      .sticky-wrapper {
        position: sticky;
        top: 0;
        height: 100vh;
        width: var(--item-width, 420px);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: visible;
      }

      .gallery {
        display: flex;
        gap: var(--item-gap, 32px);
        will-change: transform;
      }

      .gallery-item {
        flex-shrink: 0;
        width: var(--item-width, 420px);
        height: 540px;
        border-radius: 24px;
        position: relative;
        overflow: hidden;
        background-image: var(--item-image);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 20px 45px -15px rgba(11, 61, 145, 0.18), 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
      }

      /* Dark Theme Card Overrides */
      :is(.dark .gallery-item) {
        border-color: rgba(255, 255, 255, 0.12);
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -10px rgba(0, 194, 255, 0.15);
      }

      .gallery-item:hover {
        transform: translateY(-6px) scale(1.01);
        border-color: var(--item-color);
        box-shadow: 0 30px 60px -15px rgba(11, 61, 145, 0.28), 0 0 30px -5px var(--item-color);
      }

      :is(.dark .gallery-item:hover) {
        box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 40px -5px var(--item-color);
      }

      /* Dual Overlay for maximum readability in both Light and Dark themes */
      .gallery-item::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(10, 15, 29, 0.55) 0%,
          rgba(10, 15, 29, 0.2) 28%,
          rgba(10, 15, 29, 0.78) 60%,
          rgba(8, 12, 23, 0.98) 100%
        );
        transition: background 0.3s ease;
      }

      .gallery-item:hover::before {
        background: linear-gradient(
          to bottom,
          rgba(10, 15, 29, 0.45) 0%,
          rgba(10, 15, 29, 0.15) 28%,
          rgba(10, 15, 29, 0.82) 60%,
          rgba(8, 12, 23, 0.98) 100%
        );
      }

      /* Top Bar */
      .item-top-bar {
        position: absolute;
        top: 24px;
        left: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 2;
      }

      .item-number {
        font-size: 12px;
        color: #FFFFFF;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 9999px;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      .item-metric {
        font-size: 11px;
        font-weight: 700;
        color: #FFFFFF;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 12px;
        border-radius: 9999px;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      /* Bottom Content */
      .item-content {
        position: absolute;
        bottom: 28px;
        left: 24px;
        right: 24px;
        z-index: 2;
        display: flex;
        flex-direction: column;
      }

      .item-subtitle {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 6px;
      }

      .item-title {
        font-size: 24px;
        font-weight: 700;
        color: #FFFFFF;
        margin: 0 0 10px 0;
        line-height: 1.25;
        font-family: var(--font-heading), sans-serif;
      }

      .item-desc {
        font-size: 13px;
        color: rgba(241, 245, 249, 0.85);
        line-height: 1.55;
        margin: 0 0 16px 0;
      }

      .item-action {
        display: flex;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      .item-glow-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        z-index: 3;
      }

      .outro-section {
        min-height: 45vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 50px 24px 80px 24px;
        position: relative;
        border-t: 1px solid var(--color-border);
      }

      @media (max-width: 640px) {
        .sticky-wrapper {
          width: 290px;
        }

        .gallery {
          gap: 20px;
        }

        .gallery-item {
          width: 290px;
          height: 460px;
          border-radius: 18px;
        }

        .item-title {
          font-size: 20px;
        }

        .item-desc {
          font-size: 12px;
          margin-bottom: 12px;
        }

        .item-top-bar {
          top: 16px;
          left: 16px;
          right: 16px;
        }

        .item-content {
          bottom: 20px;
          left: 16px;
          right: 16px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .gallery {
          transform: none !important;
        }

        .scroll-container {
          height: auto;
        }

        .sticky-wrapper {
          position: relative;
          height: auto;
          width: 100%;
          overflow-x: auto;
          padding: 40px 24px;
          justify-content: flex-start;
        }
      }
    `}</style>
  );
}
