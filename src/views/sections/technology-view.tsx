'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  Brain,
  Cpu,
  Cloud,
  Sparkles,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Activity,
  Workflow,
  ExternalLink,
  Bot,
  DatabaseZap,
  Infinity as InfinityIcon,
  Check,
  Share2,
  Lock,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                           BRAND SVG LOGOS                                  */
/* -------------------------------------------------------------------------- */

const ReactIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const NextjsIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 180 180" fill="currentColor">
    <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
      <circle cx="90" cy="90" fill="#000" r="90" />
    </mask>
    <g mask="url(#mask0)">
      <circle cx="90" cy="90" data-circle="true" fill="currentColor" r="90" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)" />
      <rect fill="url(#paint1_linear)" height="72" width="12" x="115" y="54" />
    </g>
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="109" x2="144.5" y1="116.5" y2="160.5">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
      <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear" x1="121" x2="120.799" y1="54" y2="106.875">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);

const TypeScriptIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128">
    <rect width="128" height="128" rx="20" fill="#3178C6" />
    <path d="M74.8 77.2c1.9 4 5.3 6.9 10.3 6.9 4.3 0 7.3-2.1 7.3-5.2 0-3.6-3.7-4.8-10-7.3-9-3.6-13.8-7.8-13.8-15.6 0-8.6 6.8-15 17-15 7.8 0 13.5 3.3 16.6 9.4l-7.3 4.6c-1.8-3.3-4.4-4.8-8.8-4.8-4.3 0-6.9 2-6.9 4.7 0 3.1 3.2 4.3 9.4 6.8 9.9 4.1 14.5 8.4 14.5 16.3 0 9.8-7.6 15.7-18.4 15.7-10.4 0-17-5-19.6-11.8l9.7-4.7zM31 50.8h11.2v42.4H54V50.8h11.2v-9.5H31v9.5z" fill="#FFF" />
  </svg>
);

const PythonIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 110 110">
    <path fill="url(#python-a)" d="M54.5 3c-13.9 0-23 6.1-23 18.2V32h23.5v3.4H21.4C9.5 35.4 0 44.9 0 57.5c0 12.3 8.3 22 20.2 22.4h6.7v-9.5c0-13.8 11.6-25.2 25.4-25.2h23.5V32c0-12.1-9.9-29-21.3-29zm-9.8 8.1c2.4 0 4.4 2 4.4 4.4s-2 4.4-4.4 4.4-4.4-2-4.4-4.4 2-4.4 4.4-4.4z" />
    <path fill="url(#python-b)" d="M55.5 107c13.9 0 23-6.1 23-18.2V78H55v-3.4h33.6c11.9 0 21.4-9.5 21.4-22.1 0-12.3-8.3-22-20.2-22.4h-6.7v9.5c0 13.8-11.6 25.2-25.4 25.2H34.2V78c0 12.1 9.9 29 21.3 29zm9.8-8.1c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4z" />
    <defs>
      <linearGradient id="python-a" x1="16.5" y1="12.3" x2="68.2" y2="52.2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#387EB8" />
        <stop offset="1" stopColor="#366994" />
      </linearGradient>
      <linearGradient id="python-b" x1="93.5" y1="97.7" x2="41.8" y2="57.8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE873" />
        <stop offset="1" stopColor="#FFD43B" />
      </linearGradient>
    </defs>
  </svg>
);

const PyTorchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#EE4C2C">
    <path d="M12.923.003a9.923 9.923 0 0 0-4.992 1.348l2.072 2.073a6.974 6.974 0 0 1 2.92-.647c3.921 0 7.1 3.178 7.1 7.1 0 1.96-0.795 3.734-2.08 5.02l2.122 2.122a9.982 9.982 0 0 0 2.958-7.142C23 4.423 18.577.003 12.923.003zm-1.846 1.846l-1.077 1.077a1.43 1.43 0 0 0 0 2.022l1.077 1.077 1.077-1.077a1.43 1.43 0 0 0 0-2.022l-1.077-1.077zM4.08 6.903a9.982 9.982 0 0 0-2.958 7.142C1.122 19.699 5.545 24 11.2 24a9.923 9.923 0 0 0 4.992-1.348l-2.072-2.073a6.974 6.974 0 0 1-2.92.647c-3.921 0-7.1-3.178-7.1-7.1 0-1.96.795-3.734 2.08-5.02L4.08 6.903z" />
  </svg>
);

const OpenAIIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.98 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.771-4.205 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.746-7.074zm-9.022 12.608a4.475 4.475 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zm-9.66-4.763a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-2.284zm-1.802-9.52a4.485 4.485 0 0 1 2.34-1.974v5.677a.784.784 0 0 0 .388.677l5.839 3.37-2.02 1.168a.076.076 0 0 1-.067 0L2.8 12.2a4.497 4.497 0 0 1-1.002-4.054zm15.42 2.92l-5.84-3.37 2.019-1.168a.076.076 0 0 1 .067 0l4.743 2.737a4.5 4.5 0 0 1-.989 7.48v-5.002a.784.784 0 0 0-.39-.677zm2.493-2.735a4.485 4.485 0 0 1 .535 3.014l-.142-.085-4.783-2.759a.77.77 0 0 0-.78 0l-5.843 3.369V9.26a.08.08 0 0 1 .033-.062L14.26 4.05a4.5 4.5 0 0 1 6.14 2.284zM10.87 13.5l-2.02-1.167 4.745-2.737a4.505 4.505 0 0 1 5.485 1.04l-.142.08-4.78 2.76a.795.795 0 0 0-.392.68v5.568l-2.896-1.674V13.5z" />
  </svg>
);

const DockerIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#2496ED">
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.954 5.43h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.145a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm0-2.714h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.145a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm5.884 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm14.807-.066c-.33-.674-.916-1.12-1.636-1.284-.66-.15-1.503-.066-2.316.326a5.752 5.752 0 00-3.328-1.554V7.525a.25.25 0 00-.25-.25H16.89a.25.25 0 00-.25.25v3.473H.994a.994.994 0 00-.994.994v2.097c0 4.608 3.518 8.448 8.01 8.795a12.8 12.8 0 006.18-.847c3.48-1.468 5.787-4.484 6.745-7.988a6.564 6.564 0 001.996.113c.895-.125 1.547-.648 1.89-1.39.387-.84.25-1.956-.762-2.99z" />
  </svg>
);

const PostgresIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#336791">
    <path d="M11.968 0C5.556 0 .34 5.097.34 11.378c0 3.75 1.867 7.07 4.757 9.141-.034-.515-.044-1.074.004-1.603.206-2.28 1.39-3.778 2.502-4.888.24-.239.467-.464.673-.699.206-.234.394-.492.545-.778.204-.388.293-.833.322-1.298.026-.412.012-.843-.051-1.282-.12-.843-.377-1.69-.74-2.454-.378-.795-.88-1.523-1.488-2.128a8.21 8.21 0 0 1 5.094-1.802c4.333 0 7.848 3.427 7.848 7.653 0 1.258-.31 2.443-.854 3.491.439.11.894.17 1.365.17 2.946 0 5.334-2.327 5.334-5.198C23.65 4.343 18.414 0 11.968 0z" />
  </svg>
);

const AwsIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#FF9900">
    <path d="M6.883 14.88c-.917 0-1.62-.25-2.11-.749-.49-.499-.735-1.22-.735-2.164 0-.968.257-1.722.772-2.261.515-.539 1.258-.808 2.228-.808.97 0 1.705.245 2.205.735.5.49.75 1.218.75 2.184 0 .972-.255 1.714-.765 2.225-.51.511-1.29.768-2.345.768zm7.575-5.836h2.157v7.502h-2.157v-.98c-.44.385-.945.68-1.514.884-.57.204-1.187.306-1.85.306-.948 0-1.748-.255-2.4-.766-.652-.51-1.157-1.233-1.514-2.167-.358-.934-.537-2.023-.537-3.267 0-1.228.188-2.308.563-3.24.375-.932.898-1.652 1.568-2.16.67-.508 1.488-.762 2.454-.762.663 0 1.268.106 1.815.318.547.212 1.02.51 1.418.895V9.044zm-9.355 9.771c-4.47-1.874-7.535-5.967-7.535-10.743 0-6.42 5.58-11.625 12.465-11.625 6.885 0 12.465 5.205 12.465 11.625 0 4.776-3.065 8.869-7.535 10.743l-.75-1.875c3.81-1.597 6.42-5.077 6.42-9.15 0-5.46-4.755-9.885-10.6-9.885-5.845 0-10.6 4.425-10.6 9.885 0 4.073 2.61 7.553 6.42 9.15l-.75 1.875z" />
  </svg>
);

const TailwindIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#06B6D4">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
  </svg>
);

const PrismaIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.062 18.07L13.882.996a1.44 1.44 0 00-2.585 0L1.938 18.07c-.495 1.03.25 2.227 1.293 2.227h17.538c1.043 0 1.788-1.197 1.293-2.227zm-10.285-13.1l6.19 12.893H5.034l6.743-12.893z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                               DATA DEFINITION                              */
/* -------------------------------------------------------------------------- */

export type TechCategory = 'all' | 'ai-data' | 'app-eng' | 'infra-cloud' | 'core-stack';

export interface TechItem {
  id: string;
  name: string;
  category: 'ai-data' | 'app-eng' | 'infra-cloud' | 'core-stack';
  categoryLabel: string;
  badge: string;
  role: string;
  source: 'dropdown' | 'core-page' | 'both';
  description: string;
  icon: React.ReactNode;
  versionOrSla?: string;
  highlights: string[];
  metrics?: { label: string; value: string };
  codeSnippet?: string;
}

export const ALL_TECHNOLOGY_ITEMS: TechItem[] = [
  // ==========================================
  // 1. AI & DATA SYSTEMS (Dropdown + AI Section)
  // ==========================================
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    category: 'ai-data',
    categoryLabel: 'AI & Data',
    badge: 'Deep Learning',
    role: 'Cognitive Architecture & Inference',
    source: 'dropdown',
    versionOrSla: 'PyTorch 2.5 + CUDA 12',
    description:
      'PyTorch, custom fine-tuning & inference pipelines tailored for enterprise decision loops and predictive model deployment.',
    icon: <PyTorchIcon className="h-6 w-6" />,
    highlights: ['Custom weight quantization', 'TensorRT high-throughput inference', 'Distributed model training', 'Model drift telemetry'],
    metrics: { label: 'Inference Latency', value: '< 18ms' },
  },
  {
    id: 'llms-genai',
    name: 'LLMs & Generative AI',
    category: 'ai-data',
    categoryLabel: 'AI & Data',
    badge: 'Language Models',
    role: 'Multi-Modal Reasoning & Generation',
    source: 'dropdown',
    versionOrSla: 'Claude 3.5 & GPT-4o',
    description:
      'OpenAI, Anthropic & private local models (Llama, Mistral) engineered with semantic guardrails, zero-leakage enterprise privacy, and context caching.',
    icon: <OpenAIIcon className="h-6 w-6 text-emerald-500" />,
    highlights: ['Multi-provider fallbacks', 'Strict JSON schema function calling', 'Self-hosted air-gapped models', 'Prompt caching optimization'],
    metrics: { label: 'Cost Reduction', value: 'Up to 64%' },
  },
  {
    id: 'rag-vector',
    name: 'RAG & Vector Systems',
    category: 'ai-data',
    categoryLabel: 'AI & Data',
    badge: 'Neural Retrieval',
    role: 'Enterprise Contextual Search',
    source: 'dropdown',
    versionOrSla: 'pgvector + Pinecone',
    description:
      'Pinecone, pgvector & contextual search engines that match unstructured knowledge with exact factual citation and zero hallucination tolerances.',
    icon: <DatabaseZap className="h-6 w-6 text-purple-500" />,
    highlights: ['Hybrid semantic + BM25 search', 'Real-time embedding synchronization', 'Multi-tenant RBAC chunk isolation', 'Cohere neural reranking'],
    metrics: { label: 'Citation Accuracy', value: '99.4%' },
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    category: 'ai-data',
    categoryLabel: 'AI & Data',
    badge: 'Data Pipelines',
    role: 'ETL Flows, Warehousing & Streaming',
    source: 'dropdown',
    versionOrSla: 'Kafka + ClickHouse',
    description:
      'Data pipelines, warehousing & ETL flows structured for high-velocity transaction aggregation, real-time analytics, and clean schema transformations.',
    icon: <Workflow className="h-6 w-6 text-blue-500" />,
    highlights: ['Streaming event queues', 'Sub-second OLAP queries', 'Automated data cleansing & deduplication', 'Schema registry contracts'],
    metrics: { label: 'Pipeline Throughput', value: '100k+ ops/s' },
  },
  {
    id: 'autonomous-agents',
    name: 'Autonomous AI Agents',
    category: 'ai-data',
    categoryLabel: 'AI Capabilities',
    badge: 'Autonomous Systems',
    role: 'Goal-Driven Agent Orchestrations',
    source: 'core-page',
    versionOrSla: 'LangGraph + Swarms',
    description:
      'We develop self-orchestrating agent workflows that execute complex multi-step processes, connect to external APIs, write to databases, and handle customer support flows autonomously.',
    icon: <Bot className="h-6 w-6 text-cyan-500" />,
    highlights: ['Multi-agent role coordination', 'ReAct decision loops', 'Human-in-the-loop checkpoints', 'Self-healing execution queues'],
    metrics: { label: 'Manual Task Reduction', value: '85%' },
  },
  {
    id: 'vector-embedding-systems',
    name: 'Vector Embedding Systems',
    category: 'ai-data',
    categoryLabel: 'AI Capabilities',
    badge: 'Semantic Memory',
    role: 'High-Dimensional Intent Matching',
    source: 'core-page',
    versionOrSla: 'HNSW Indexing',
    description:
      'We set up semantic search engines that understand user intent rather than simple keywords, improving database search relevancy by up to 80%.',
    icon: <Cpu className="h-6 w-6 text-indigo-400" />,
    highlights: ['Multi-modal embeddings', 'Sub-millisecond cosine distance', 'Partitioned vector spaces', 'Cross-encoder scoring'],
    metrics: { label: 'Relevancy Lift', value: '+80%' },
  },

  // ==========================================
  // 2. APPLICATION ENGINEERING (Dropdown + Core Tech)
  // ==========================================
  {
    id: 'nextjs-react',
    name: 'Next.js & React',
    category: 'app-eng',
    categoryLabel: 'Application Engineering',
    badge: 'Core Framework',
    role: 'Frontend & Server Architecture',
    source: 'both',
    versionOrSla: 'Next.js 16.2 / React 19',
    description:
      'App router, streaming SSR & reactivity. Used for advanced Server Actions, Server Components, page caching, and serverless edge rendering with near-instant Time-to-First-Byte.',
    icon: (
      <div className="flex items-center -space-x-1">
        <NextjsIcon className="h-5 w-5 text-foreground" />
        <ReactIcon className="h-5 w-5" />
      </div>
    ),
    highlights: ['Zero-bundle Server Components', 'Incremental Static Regeneration (ISR)', 'Parallel routes & interceptors', 'Optimistic UI mutations'],
    metrics: { label: 'Lighthouse Score', value: '99+' },
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'app-eng',
    categoryLabel: 'Application Engineering',
    badge: 'Type System',
    role: 'Strict End-to-End Type Safety',
    source: 'both',
    versionOrSla: 'TypeScript 5.x Strict',
    description:
      'Strict end-to-end type safety & contracts. Guarantees absolute compiler safety, eliminating runtime bugs and facilitating clean structural refactoring across fullstack codebases.',
    icon: <TypeScriptIcon className="h-6 w-6" />,
    highlights: ['Shared API contracts with Zod', 'Discriminated union schemas', 'Zero any-type allowance', 'Automated OpenAPI spec inference'],
    metrics: { label: 'Type Safety', value: '100% Strict' },
  },
  {
    id: 'nodejs-python',
    name: 'Node.js & Python',
    category: 'app-eng',
    categoryLabel: 'Application Engineering',
    badge: 'Runtime & APIs',
    role: 'FastAPI, Async Workers & API Gateways',
    source: 'dropdown',
    versionOrSla: 'Node 22 LTS / Python 3.12',
    description:
      'FastAPI, async workers & API gateways. Built for asynchronous non-blocking I/O, concurrent microservice orchestration, and lightning-fast JSON throughput.',
    icon: <PythonIcon className="h-6 w-6" />,
    highlights: ['Async/await event loops', 'Pydantic v2 serialization', 'Worker pools & background jobs', 'Distributed Redis pub/sub'],
    metrics: { label: 'P99 API Response', value: '< 24ms' },
  },
  {
    id: 'apis-integrations',
    name: 'APIs & Integrations',
    category: 'app-eng',
    categoryLabel: 'Application Engineering',
    badge: 'Connectivity',
    role: 'REST, GraphQL, WebSockets & Webhooks',
    source: 'dropdown',
    versionOrSla: 'HTTP/2, WS & gRPC',
    description:
      'REST, GraphQL, WebSockets & webhooks. Designed with idempotent delivery, strict rate-limiting, HMAC signature verification, and bidirectional real-time push protocols.',
    icon: <Share2 className="h-6 w-6 text-sky-500" />,
    highlights: ['Bidirectional real-time feeds', 'Idempotent webhook delivery', 'Rate-limiting & DDoS shielding', 'Contract-driven mocking'],
    metrics: { label: 'Push Latency', value: '< 5ms' },
  },
  {
    id: 'tailwind-v4',
    name: 'Tailwind CSS v4',
    category: 'app-eng',
    categoryLabel: 'Design & Styling',
    badge: 'Styling Engine',
    role: 'Utility Styling Engine',
    source: 'core-page',
    versionOrSla: 'Tailwind CSS v4',
    description:
      'Provides pixel-perfect styling, zero CSS runtime bloat, and optimized utility layouts with modern CSS cascade layers and native container queries.',
    icon: <TailwindIcon className="h-6 w-6" />,
    highlights: ['Zero runtime overhead', 'JIT lightning compiler', 'Adaptive HSL color tokens', 'Native container queries'],
    metrics: { label: 'CSS Bundle Size', value: '< 12kB' },
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    category: 'app-eng',
    categoryLabel: 'Animation Engine',
    badge: 'Micro-Interactions',
    role: 'Fluid Dynamic Interactions',
    source: 'core-page',
    versionOrSla: 'v12 Hardware-Accelerated',
    description:
      'Powers custom animated card lifts, scroll reveals, spring physics, and hardware-accelerated animations that make enterprise products feel organic and responsive.',
    icon: <InfinityIcon className="h-6 w-6 text-purple-500" />,
    highlights: ['Spring physics simulation', 'GPU-accelerated transforms', 'Scroll-linked animations', 'Accessible reduced-motion defaults'],
    metrics: { label: 'Render FPS', value: 'Solid 60-120' },
  },
  {
    id: 'zod-rhf',
    name: 'Zod & React Hook Form',
    category: 'app-eng',
    categoryLabel: 'Validation & State',
    badge: 'Schema Validation',
    role: 'Validation & Form State Engine',
    source: 'core-page',
    versionOrSla: 'Zod 4.x + RHF 7',
    description:
      'Strict runtime validations for API requests and client inputs, optimizing security, input sanitization, and immediate user feedback with zero re-render waste.',
    icon: <ShieldCheck className="h-6 w-6 text-rose-500" />,
    highlights: ['Composable schema rules', 'Cross-field validation', 'Sanitized input stripping', 'Zero unnecessary rerenders'],
    metrics: { label: 'Input Sanitization', value: '100% Strict' },
  },

  // ==========================================
  // 3. DATA & INFRASTRUCTURE (Dropdown + Core Tech)
  // ==========================================
  {
    id: 'postgres-mongo',
    name: 'PostgreSQL & MongoDB',
    category: 'infra-cloud',
    categoryLabel: 'Data & Infrastructure',
    badge: 'Databases',
    role: 'ACID Transactional Data & Dynamic Schemas',
    source: 'both',
    versionOrSla: 'Postgres 16 + Mongo 7',
    description:
      'ACID transactional data & dynamic schemas. Ensuring enterprise financial fidelity, structured relational queries, and flexible JSON document stores at high scale.',
    icon: <PostgresIcon className="h-6 w-6" />,
    highlights: ['ACID strict guarantees', 'Connection pooling with PgBouncer', 'Read-replica auto-failover', 'Row-level security (RLS)'],
    metrics: { label: 'Data Durability', value: '99.99999%' },
  },
  {
    id: 'prisma-orm',
    name: 'Prisma & Postgres',
    category: 'infra-cloud',
    categoryLabel: 'Data & Infrastructure',
    badge: 'ORM & Query Engine',
    role: 'Typesafe Relational Database Layer',
    source: 'core-page',
    versionOrSla: 'Prisma v7 Rust Core',
    description:
      'Ensures typesafe relational database queries with automated connection pool management, zero SQL injection vectors, and declarative schema migrations.',
    icon: <PrismaIcon className="h-6 w-6 text-emerald-500" />,
    highlights: ['Zero SQL injection exposure', 'Auto-generated TypeScript client', 'Declarative schema migrations', 'Rust-powered query engine'],
    metrics: { label: 'Query Safety', value: 'Guaranteed' },
  },
  {
    id: 'aws-cloudflare',
    name: 'AWS & Cloud Infrastructure',
    category: 'infra-cloud',
    categoryLabel: 'Data & Infrastructure',
    badge: 'Cloud & Edge',
    role: 'Cloudflare Edge, Lambda & S3 Architecture',
    source: 'both',
    versionOrSla: 'AWS + Cloudflare R2',
    description:
      'Distributes files and pages globally with low latency and near-zero server load overhead. Serverless compute, global CDN caching, and automated multi-zone failover.',
    icon: <AwsIcon className="h-6 w-6" />,
    highlights: ['Multi-region edge deployment', 'Zero egress cost with Cloudflare R2', 'Serverless autoscaling (0 to 10k)', 'DDoS Layer 3/4/7 protection'],
    metrics: { label: 'Global Edge SLA', value: '99.99%' },
  },
  {
    id: 'docker-devops',
    name: 'Docker & DevOps CI/CD',
    category: 'infra-cloud',
    categoryLabel: 'Data & Infrastructure',
    badge: 'DevOps & Containers',
    role: 'Automated CI/CD, Staging & Container Runs',
    source: 'dropdown',
    versionOrSla: 'Docker + GitHub Actions',
    description:
      'Automated CI/CD, staging & container runs. Immutable containerized builds, automated test gates, ephemeral preview branches, and zero-downtime rolling deployments.',
    icon: <DockerIcon className="h-6 w-6" />,
    highlights: ['Immutable multi-stage Dockerfiles', 'Automated lint & typecheck gates', 'Ephemeral pull-request previews', 'Zero-downtime blue/green deploys'],
    metrics: { label: 'Deployment Time', value: '< 2.5 min' },
  },
  {
    id: 'better-auth',
    name: 'Better Auth',
    category: 'infra-cloud',
    categoryLabel: 'Security & Identity',
    badge: 'Identity System',
    role: 'Authentication & Session Shield',
    source: 'core-page',
    versionOrSla: 'Better Auth v1.6',
    description:
      'Implements secure multi-tenant cookie sessions, password hashing, 2FA, OAuth SSO, and role structures with zero vendor lock-in and high-speed local verification.',
    icon: <Lock className="h-6 w-6 text-cyan-500" />,
    highlights: ['Multi-tenant role hierarchies (RBAC)', 'Hardware-key 2FA support', 'Cryptographic session tokens', 'Zero third-party user data lock-in'],
    metrics: { label: 'Session Verification', value: '< 0.3ms' },
  },
];

/* -------------------------------------------------------------------------- */
/*                         SYSTEM ARCHITECTURE TIERS                          */
/* -------------------------------------------------------------------------- */

const ARCHITECTURE_TIERS = [
  {
    id: 'tier-client',
    number: '01',
    name: 'Client & Edge Experience',
    badge: 'Interface Layer',
    color: 'from-blue-500/20 to-cyan-500/20 text-cyan-500 border-cyan-500/30',
    techNames: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Framer Motion'],
    summary: 'Sub-second SSR, streaming render pipelines, strict client typing, and 60FPS fluid micro-interactions.',
    latency: '12ms TTFB',
  },
  {
    id: 'tier-intelligence',
    number: '02',
    name: 'Intelligence & Agent Orchestration',
    badge: 'Cognitive Layer',
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    techNames: ['Autonomous Agents', 'Claude 3.5 & GPT-4o', 'PyTorch 2.5', 'FastAPI', 'Node.js 22'],
    summary: 'Autonomous agent swarms, function calling schemas, model routing, and fine-tuned domain vocabulary.',
    latency: '< 18ms Inference',
  },
  {
    id: 'tier-data',
    number: '03',
    name: 'Knowledge Lake & Storage Matrix',
    badge: 'Persistence Layer',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    techNames: ['PostgreSQL 16', 'MongoDB 7', 'pgvector', 'Pinecone', 'Prisma 7'],
    summary: 'ACID transactional safety, vector similarity search, multi-tenant RBAC schemas, and streaming ETL.',
    latency: '< 0.8ms Query',
  },
  {
    id: 'tier-infrastructure',
    number: '04',
    name: 'Cloud Backbone & Security Perimeter',
    badge: 'DevOps & Edge',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    techNames: ['AWS Cloud', 'Cloudflare Edge / R2', 'Docker', 'Better Auth', 'Zod Gates'],
    summary: 'Zero-trust authentication, containerized pipelines, DDoS layer protection, and automated CI/CD runs.',
    latency: '99.99% Uptime',
  },
];

/* -------------------------------------------------------------------------- */
/*                         AI COGNITIVE PIPELINE STEPS                        */
/* -------------------------------------------------------------------------- */

const AI_PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Query Ingestion & Schema Gate',
    tech: 'Zod + LangChain Guard',
    desc: 'Incoming prompt is sanitized, typed, and checked against prompt-injection and security barriers.',
    telemetry: '0.2ms validation',
  },
  {
    step: '02',
    title: 'Hybrid Vector & Semantic Retrieval',
    tech: 'pgvector + Pinecone + Cohere',
    desc: 'Proprietary enterprise documents matched via cosine similarity and BM25 reranking for exact context.',
    telemetry: '< 8ms lookup',
  },
  {
    step: '03',
    title: 'Cognitive Reasoning & Synthesis',
    tech: 'Claude 3.5 / GPT-4o / Local Llama',
    desc: 'High-parameter model processes retrieved context chunks with deterministic citations and zero hallucination.',
    telemetry: 'Token stream active',
  },
  {
    step: '04',
    title: 'Autonomous Tool Execution & Sync',
    tech: 'FastAPI + Database Actions',
    desc: 'Agent executes verified schema actions (API calls, DB writes, webhook dispatches) with human safety guards.',
    telemetry: '200 OK Executed',
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

interface TechnologyViewProps {
  badge?: string;
  title?: string;
  description?: string;
}

export function TechnologyView({
  badge: _badge,
  title = 'Next-Gen Software & Intelligent Systems',
  description: _description,
}: TechnologyViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTierId, setActiveTierId] = useState<string>('tier-client');
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  // Filter items based on active tab and search query
  const filteredTechs = useMemo(() => {
    return ALL_TECHNOLOGY_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'core-stack'
          ? item.source === 'core-page' || item.source === 'both'
          : item.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query) ||
        item.highlights.some((h) => h.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full relative">
      {/* 1. HEADER */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-10 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-left mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
            Foundational engineering stack, intelligent agent frameworks, and enterprise infrastructure.
          </p>
        </div>

        {/* =========================================================================
            ENTERPRISE IT SPOTLIGHT (Dropdown Featured Card Elevated)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-card/90 via-primary/5 to-card/90 dark:from-slate-900/80 dark:via-primary/10 dark:to-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col gap-2 max-w-2xl text-left">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30">
                    <Zap className="h-3 w-3" />
                    ENTERPRISE IT
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">Battle-Tested Primitives</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Modern Technical Stack Engineered for Enterprise Scale.
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed">
                  Every layer of our software architecture is selected with rigorous benchmarks: zero memory leak profiles, multi-cloud redundancy, strict zero-trust security postures, and sub-millisecond data pipelines.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href="#tech-matrix"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-primary/25 hover:scale-[1.02] transition-all"
                >
                  <span>Explore Technology Stack</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground font-semibold text-sm border border-border/60 transition-all"
                >
                  <span>Request Stack Audit</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          INTERACTIVE ARCHITECTURAL SYSTEM BLUEPRINT (UNIQUE FEATURE)
          ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-border/30">
        <div className="flex flex-col items-center text-center gap-2 mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            System Topology
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Interactive Multi-Tier Architecture
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-medium">
            Explore how data flows through our four core architectural tiers from client request to AI inference and cloud persistence.
          </p>
        </div>

        {/* Interactive Architecture Tier Switcher & Visual Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Tier Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {ARCHITECTURE_TIERS.map((tier) => {
              const isActive = activeTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTierId(tier.id)}
                  className={cn(
                    "text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative flex flex-col gap-2 cursor-pointer group",
                    isActive
                      ? "bg-card shadow-md border-primary/50 dark:border-primary/60 ring-1 ring-primary/20"
                      : "bg-card/40 hover:bg-card/70 border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-muted/60 text-muted-foreground">
                      TIER {tier.number}
                    </span>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {tier.latency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className={cn("text-base sm:text-lg font-bold transition-colors", isActive ? "text-foreground" : "text-foreground/80")}>
                      {tier.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">
                      {tier.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border/30">
                    {tier.techNames.map((tName, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/80 text-foreground/80 font-medium">
                        {tName}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Tier Inspect Panel */}
          <div className="lg:col-span-7 flex flex-col">
            {(() => {
              const currentTier = ARCHITECTURE_TIERS.find((t) => t.id === activeTierId) || ARCHITECTURE_TIERS[0];
              return (
                <div className="h-full rounded-2xl border border-border/60 bg-card/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {currentTier.badge} Online
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">SLA Guaranteed</span>
                  </div>

                  <div className="my-6 flex flex-col gap-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                      {currentTier.name}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Engineered for high concurrency & enterprise-grade resilience.
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {currentTier.summary} All components communicate across dedicated internal transport protocols with automated retry budgets and structured distributed tracing.
                    </p>

                    {/* Visual Stack Blocks */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {currentTier.techNames.map((tech, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-background/80 dark:bg-slate-800/60 border border-border/60 flex flex-col gap-1 items-start shadow-xs hover:border-primary/40 transition-colors"
                        >
                          <span className="text-xs font-bold text-foreground">{tech}</span>
                          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                            <Check className="h-2.5 w-2.5 text-emerald-500" />
                            Production Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">Real-time Telemetry: Active</span>
                    <span className="font-mono font-bold text-primary">{currentTier.latency}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* =========================================================================
          COGNITIVE AI WORKFLOW SIMULATION (ELEVATING & PRESERVING AI SECTION)
          ========================================================================= */}
      <section id="ai-expertise" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-border/30">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            AI Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Cognitive AI & Enterprise Automations
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-medium">
            We do not just wrap basic API endpoints. We build production-ready vector databases, autonomous workflows, and custom-tuned language models that optimize business margins.
          </p>
        </div>

        {/* 4 Core AI Capability Cards (Preserving original contents + rich styling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-14">
          <div className="p-6 rounded-2xl bg-card/70 dark:bg-slate-900/50 border border-border/50 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500 flex items-center justify-center border border-cyan-500/20">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Autonomous AI Agents</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                We develop self-orchestrating agent workflows that execute complex multi-step processes, connect to external APIs, write to databases, and handle customer support flows autonomously.
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-4 font-bold uppercase">
              • 85% Task Automation
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-card/70 dark:bg-slate-900/50 border border-border/50 hover:border-purple-500/40 transition-all shadow-xs flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-500/20">
                <DatabaseZap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Enterprise RAG Pipelines</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Retrieval-Augmented Generation enables your LLM to access proprietary enterprise documentation in real-time, matching queries with semantic accuracy using vector databases like pgvector.
              </p>
            </div>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-4 font-bold uppercase">
              • 99.4% Factual Precision
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-card/70 dark:bg-slate-900/50 border border-border/50 hover:border-blue-500/40 transition-all shadow-xs flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">LLM Fine-Tuning & Prompting</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                We customize open-weight models (Llama, Mistral) for specific domain vocabularies, reducing API costs and latency while keeping your corporate data completely private.
              </p>
            </div>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-4 font-bold uppercase">
              • Zero Data Leakage
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-card/70 dark:bg-slate-900/50 border border-border/50 hover:border-indigo-500/40 transition-all shadow-xs flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Vector Embedding Systems</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                We set up semantic search engines that understand user intent rather than simple keywords, improving database search relevancy by up to 80%.
              </p>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mt-4 font-bold uppercase">
              • Sub-10ms Cosine Distance
            </span>
          </div>
        </div>

        {/* Interactive Step-by-Step Cognitive Execution Pipeline */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 to-card/50 dark:from-slate-900/70 dark:to-slate-900/40 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                Live Execution Protocol
              </span>
              <h3 className="text-xl font-bold text-foreground mt-1">
                How Astraiv Executes Real-Time Cognitive Queries
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 self-start sm:self-auto">
              Interactive Flow
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {AI_PIPELINE_STEPS.map((item, idx) => {
              const isSelected = activePipelineStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActivePipelineStep(idx)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left",
                    isSelected
                      ? "bg-primary/10 border-primary/50 shadow-sm"
                      : "bg-background/60 hover:bg-background border-border/40"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-primary">
                        STEP {item.step}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.telemetry}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <span className="text-[10px] font-semibold text-primary/80 dark:text-accent">
                      {item.tech}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FULL TECHNOLOGY SPECTRUM MATRIX (With Dynamic Filter & Live Search)
          ========================================================================= */}
      <section id="tech-matrix" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-border/30">
        <div id="technologies" className="flex flex-col items-center text-center gap-2 mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            Technology Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Elite Technologies for High Performance
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-medium">
            We build exclusively with state-of-the-art frameworks and databases, guaranteeing near-instant load speeds and bulletproof code security.
          </p>
        </div>

        {/* Filter Toolbar & Live Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 max-w-6xl mx-auto mb-10">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-card/60 dark:bg-slate-900/60 border border-border/50 backdrop-blur-md">
            {[
              { id: 'all', label: 'All Technologies' },
              { id: 'ai-data', label: 'AI & Data' },
              { id: 'app-eng', label: 'Application Engineering' },
              { id: 'infra-cloud', label: 'Data & Infrastructure' },
              { id: 'core-stack', label: 'Core Production Stack' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as TechCategory)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frameworks, databases, tools..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-card/70 dark:bg-slate-900/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Technology Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          <AnimatePresence>
            {filteredTechs.map((tech, index) => (
              <motion.div
                key={tech.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-card/70 dark:bg-slate-900/50 backdrop-blur-md border border-border/50 hover:border-primary/40 dark:hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left group min-h-[280px]"
              >
                <div className="flex flex-col gap-3">
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {tech.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      {tech.badge}
                    </span>
                  </div>

                  {/* Title & Role */}
                  <div className="flex flex-col gap-0.5 mt-1">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {tech.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {tech.role}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {tech.description}
                  </p>
                </div>

                {/* Bottom Metadata: Highlights + SLA/Metric */}
                <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1">
                    {tech.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[9.5px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                        {h}
                      </span>
                    ))}
                  </div>

                  {tech.metrics && (
                    <div className="flex items-center justify-between text-[10.5px] font-mono pt-1 text-muted-foreground">
                      <span>{tech.metrics.label}:</span>
                      <span className="font-bold text-foreground">{tech.metrics.value}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTechs.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">
              No technologies match &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          ENTERPRISE ARCHITECTURE GUARANTEES & STANDARDS MATRIX
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-border/30">
        <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card/90 to-card p-6 sm:p-10 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Enterprise Assurances
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-2">
              Our Architectural Commitments
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">
              Every digital asset built by Astraiv undergoes continuous automated auditing against performance, security, and scalability benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 dark:bg-slate-900/60 border border-border/40">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Performance</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">Core Web Vitals 99+</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Server-rendered pages engineered for instant paint, near-zero layout shift, and minimal JS footprint.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 dark:bg-slate-900/60 border border-border/40">
              <div className="flex items-center gap-2 text-blue-500">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Security</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">Zero-Trust & SOC2 Ready</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Cryptographic session validation, automated injection guards, and role-partitioned data access.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 dark:bg-slate-900/60 border border-border/40">
              <div className="flex items-center gap-2 text-purple-500">
                <Brain className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Privacy</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">Zero Data Ingestion</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Zero training on enterprise proprietary IP. Dedicated private vector lakes with RBAC encryption.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 dark:bg-slate-900/60 border border-border/40">
              <div className="flex items-center gap-2 text-amber-500">
                <Cloud className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Reliability</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">99.99% Availability</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Multi-region edge deployment with automatic failovers and zero single points of failure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-card/80 dark:bg-slate-900/80 border border-border/60 shadow-xl flex flex-col items-center gap-5">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            Build With Elite Technology
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Ready to deploy an enterprise-grade technology stack?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl font-medium">
            Consult with our principal software architects to design, refactor, or scale your production infrastructure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:shadow-primary/25 hover:scale-[1.02] transition-all"
            >
              <span>Schedule Architecture Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
