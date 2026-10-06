'use client';

import React, { useState, useEffect } from 'react';

interface CodeToken {
  text: string;
  className: string;
}

interface CodeSnippet {
  filename: string;
  lang: string;
  badge: string;
  successMsg: string;
  lines: CodeToken[][];
}

/* =========================================================================
   SNIPPET LIBRARIES: Distributed, Diverse & Fullstack Astraiv Technologies
   ========================================================================= */

// SECTOR 1: TOP-LEFT — Python AI Core & Reasoning
const AI_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'astraiv_ai_engine.py',
    lang: 'python',
    badge: 'AI Core v2.4',
    successMsg: '✓ Tensor batch dispatched (0.8ms)',
    lines: [
      [
        { text: 'import ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'astraiv_neural ', className: 'text-slate-800 dark:text-slate-200' },
        { text: 'as ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'ai', className: 'text-blue-700 dark:text-blue-300 font-semibold' },
      ],
      [
        { text: '@ai.distributed_pipeline', className: 'text-blue-700 dark:text-blue-400 font-semibold' },
        { text: '(', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'region=', className: 'text-slate-700 dark:text-slate-300' },
        { text: '"global-edge"', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ')', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: 'async def ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'stream_inference', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(tensor):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    cluster = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'ai.connect_cluster()', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    return await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'cluster.dispatch(tensor, sla=', className: 'text-slate-700 dark:text-slate-300' },
        { text: '0.9999', className: 'text-cyan-700 dark:text-cyan-400 font-bold' },
        { text: ')', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'neural_agent.py',
    lang: 'python',
    badge: 'PyTorch 2.5',
    successMsg: '⚡ Embeddings quantized (1.1ms)',
    lines: [
      [
        { text: 'class ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'AstraivReasoningAgent', className: 'text-cyan-700 dark:text-cyan-300 font-bold' },
        { text: ':', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    def ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '__init__', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(self, model_id: str):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        self.engine = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'load_optimized_weights(model_id)', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '    async def ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'solve_task', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(self, prompt):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        return await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'self.engine.stream_tokens(prompt)', className: 'text-slate-800 dark:text-slate-200' },
      ],
    ],
  },
  {
    filename: 'vector_pipeline.py',
    lang: 'python',
    badge: 'Qdrant + RAG',
    successMsg: '🔍 Semantic index synced (0.4ms)',
    lines: [
      [
        { text: 'index = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'VectorIndex', className: 'text-cyan-700 dark:text-cyan-300 font-bold' },
        { text: '(collection=', className: 'text-slate-700 dark:text-slate-300' },
        { text: '"astraiv_vault"', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ')', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: 'async def ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'query_hybrid_context', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(query: str):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    vec = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'embed_multimodal(query, dim=', className: 'text-slate-700 dark:text-slate-300' },
        { text: '1536', className: 'text-cyan-700 dark:text-cyan-400 font-bold' },
        { text: ')', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    return await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'index.similarity_search(vec, top_k=', className: 'text-slate-800 dark:text-slate-200' },
        { text: '5', className: 'text-cyan-700 dark:text-cyan-400 font-bold' },
        { text: ')', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
];

// SECTOR 5: MID-RIGHT — Next.js 15 Server Actions & Edge Auth
const SERVER_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'server_action.ts',
    lang: 'typescript',
    badge: 'Next.js 15',
    successMsg: '⚡ Zero-downtime stream active',
    lines: [
      [
        { text: "'use server';", className: 'text-blue-600 dark:text-blue-400 font-bold' },
      ],
      [
        { text: 'export async function ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'orchestratePipeline', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '() {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    const ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'session = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'auth.verify();', className: 'text-blue-700 dark:text-blue-300' },
      ],
      [
        { text: '    return await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'astraivEngine.stream({', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '        concurrency: ', className: 'text-blue-700 dark:text-blue-300' },
        { text: '64', className: 'text-cyan-700 dark:text-cyan-400 font-bold' },
        { text: ', sla: ', className: 'text-slate-700 dark:text-slate-300' },
        { text: '"ultra-low"', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '    });', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '}', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'auth_shield.ts',
    lang: 'typescript',
    badge: 'Edge Auth',
    successMsg: '🛡️ JWT session verified (0.3ms)',
    lines: [
      [
        { text: 'export const ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'validateEdgeRequest = ', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: 'async (req) => {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    const ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'token = req.headers.get("authorization");', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    if (!token) ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'throw new ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'UnauthorizedError();', className: 'text-blue-600 dark:text-blue-400' },
      ],
      [
        { text: '    return await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'jwt.verify(token, process.env.SECRET);', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '};', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'telemetry_sink.ts',
    lang: 'typescript',
    badge: 'Edge Sockets',
    successMsg: '📡 Real-time heartbeat stream connected',
    lines: [
      [
        { text: 'export async function ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'streamTelemetry', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(clientId: string) {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    const ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'channel = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'await ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'EdgeSocket.openChannel(clientId);', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    return channel.subscribe((packet) => {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        metrics.record(packet.latency, packet.status);', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '    });', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '}', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
];

// SECTOR 6: BOTTOM-LEFT — Rust Tokio & High Concurrency Engine
const RUST_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'engine.rs',
    lang: 'rust',
    badge: 'tokio::async',
    successMsg: '🚀 Worker pool connected (64 threads)',
    lines: [
      [
        { text: 'pub async fn ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'handle_stream', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(stream: Arc<Queue>) -> Result<()> {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    let ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'cluster = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'WorkerPool::bind(', className: 'text-slate-800 dark:text-slate-200' },
        { text: '"0.0.0.0:8080"', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ').await?;', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    cluster.dispatch(stream, SLA::High99).await', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '}', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'zero_copy_arena.rs',
    lang: 'rust',
    badge: 'mem::alloc',
    successMsg: '⚡ Zero-copy buffer locked (0.1ms)',
    lines: [
      [
        { text: 'pub struct ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'MemoryArena<T: Send + Sync>', className: 'text-cyan-700 dark:text-cyan-300 font-bold' },
        { text: ' {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    pub fn ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'alloc_pinned', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(&self, size: usize) -> PinBuffer<T> {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        self.pool.acquire_uninit(size).expect("OOM")', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '    }', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '}', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'mesh_gateway.rs',
    lang: 'rust',
    badge: 'actix::mesh',
    successMsg: '🌐 Edge gateway operational (100k req/s)',
    lines: [
      [
        { text: '#[actix_web::get("/api/v2/mesh/status")]', className: 'text-blue-700 dark:text-blue-400 font-semibold' },
      ],
      [
        { text: 'pub async fn ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'mesh_status', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(mesh: web::Data<MeshCluster>) -> HttpResponse {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    let telemetry = mesh.read_active_nodes().await;', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    HttpResponse::Ok().json(telemetry)', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '}', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
];

// SECTOR 9: CENTER TILE — Compact, Vertically Well-Proportioned Astraiv Services & Architecture
const CENTER_ORCHESTRATOR_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'astraiv_platform.ts',
    lang: 'typescript',
    badge: 'Astraiv Hub v2.6',
    successMsg: '✨ Enterprise Suite live across edge (0.4ms)',
    lines: [
      [
        { text: 'import { ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'AstraivEngine', className: 'text-blue-700 dark:text-blue-300 font-semibold' },
        { text: ' } from ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '"@astraiv/core";', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: 'export const ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'Platform = ', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: 'defineStack({', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '  services: ', className: 'text-slate-700 dark:text-slate-300' },
        { text: '["Web Dev", "AI RAG", "Cloud"]', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ',', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '  frontend: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '"Next.js 15 App Router"', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ',', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '  aiEngine: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '"Neural Vector Mesh (<12ms)"', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ',', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '  cloudSLA: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '"99.999% Zero-Downtime"', className: 'text-cyan-600 dark:text-cyan-300' },
        { text: ',', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '  async deploy(suite) {', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
      ],
      [
        { text: '    return await AstraivEngine.launch(suite);', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '  }', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '});', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'services_matrix.config.ts',
    lang: 'typescript',
    badge: 'Enterprise Architecture',
    successMsg: '🚀 7 Core Services scaled & healthy',
    lines: [
      [
        { text: 'export const ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'AstraivMatrix: ServiceRegistry = {', className: 'text-blue-700 dark:text-blue-300 font-bold' },
      ],
      [
        { text: '  webDev: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '{ tech: "Next.js 15", perf: 100 },', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '  aiSolutions: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '{ engine: "Vector Vault RAG" },', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '  cloudSystems: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '{ nodes: 64, edge: "global" },', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '  uiUxDesign: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '{ tokens: "Adaptive HSL" },', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '  automation: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '{ throughput: "100k ops/s" },', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '  security: ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: '{ protocol: "TLS 1.3 / AES" },', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '};', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
  {
    filename: 'distributed_ai_mesh.py',
    lang: 'python',
    badge: 'Neural Engine v2.6',
    successMsg: '🧠 Multi-Agent Reasoning synchronized (0.6ms)',
    lines: [
      [
        { text: '@astraiv.service(cluster="ai-enterprise")', className: 'text-blue-700 dark:text-blue-400 font-semibold' },
      ],
      [
        { text: 'class ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'AstraivNeuralMesh', className: 'text-cyan-700 dark:text-cyan-300 font-bold' },
        { text: ':', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    def __init__(self, tenant_id: str):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        self.vault = astraiv.connect_vault(tenant_id)', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '        self.engine = astraiv.load_neural_router()', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    async def stream_reasoning(self, query: str):', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
      ],
      [
        { text: '        ctx = await self.vault.vector_search(query)', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '        return await self.engine.stream(ctx)', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
    ],
  },
  {
    filename: 'cloud_deployer.rs',
    lang: 'rust',
    badge: 'Edge Deployer',
    successMsg: '🌐 Global cluster active across 64 nodes',
    lines: [
      [
        { text: 'pub async fn ', className: 'text-blue-600 dark:text-blue-400 font-semibold' },
        { text: 'deploy_cluster', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '() -> Result<Mesh> {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    let edge = GlobalEdgeRouter::connect().await?;', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    let nodes = edge.sync(&["iad1", "fra1"]).await?;', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    Telemetry::verify_latency_p99("< 1.2ms")?;', className: 'text-cyan-600 dark:text-cyan-300' },
      ],
      [
        { text: '    Ok(Mesh::active(nodes.len(), SLA::High99))', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '}', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
];

/* =========================================================================
   ROBUST PERMANENT TYPEWRITER COMPONENT
   ========================================================================= */

interface LiveTypewriterPanelProps {
  snippets: CodeSnippet[];
  initialDelay?: number;
  typingSpeed?: number;
  lineDelay?: number;
  holdDelay?: number;
  fontSizeClass?: string;
  onSnippetChange?: (snippet: CodeSnippet) => void;
}

function LiveTypewriterPanel({
  snippets,
  initialDelay = 0,
  typingSpeed = 40,
  lineDelay = 280,
  holdDelay = 4000,
  fontSizeClass = 'text-[10px] sm:text-[10.5px]',
  onSnippetChange,
}: LiveTypewriterPanelProps) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [started, setStarted] = useState(initialDelay === 0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Initial delay stagger
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (initialDelay > 0 && !started) {
      const startTimer = setTimeout(() => setStarted(true), initialDelay);
      return () => clearTimeout(startTimer);
    }
  }, [initialDelay, started, prefersReducedMotion]);

  const activeSnippetIndex = snippetIndex % snippets.length;
  const snippet = snippets[activeSnippetIndex];
  const currentLine = snippet?.lines?.[lineIndex];
  const lineFullText = currentLine ? currentLine.map((t) => t.text).join('') : '';

  // Notify parent of active snippet for header updates
  useEffect(() => {
    if (snippet && onSnippetChange) {
      onSnippetChange(snippet);
    }
  }, [activeSnippetIndex, snippet, onSnippetChange]);

  // Main indestructible typing loop
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!started || !snippet) return;

    // 1. Completion state: hold success message then advance snippet
    if (isDone) {
      const resetTimer = setTimeout(() => {
        setIsDone(false);
        setLineIndex(0);
        setCharIndex(0);
        setSnippetIndex((prev) => (prev + 1) % snippets.length);
      }, holdDelay);
      return () => clearTimeout(resetTimer);
    }

    // 2. Check if we completed all lines in current snippet
    if (lineIndex >= snippet.lines.length) {
      setIsDone(true);
      return;
    }

    // 3. Typing characters within current line
    if (charIndex < lineFullText.length) {
      const charsLeft = lineFullText.length - charIndex;
      const step = charsLeft > 2 && Math.random() > 0.4 ? 2 : 1;
      const jitter = typingSpeed + (Math.random() * 14 - 7);
      
      const timer = setTimeout(() => {
        setCharIndex((prev) => Math.min(prev + step, lineFullText.length));
      }, Math.max(16, jitter));
      return () => clearTimeout(timer);
    } else {
      // 4. Line finished: pause briefly before advancing to next line
      const nextLineTimer = setTimeout(() => {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(nextLineTimer);
    }
  }, [
    started,
    isDone,
    lineIndex,
    charIndex,
    snippet,
    lineFullText,
    holdDelay,
    lineDelay,
    typingSpeed,
    snippets.length,
    prefersReducedMotion,
  ]);

  // Tab visibility listener: guarantees instant resumption if tab is switched
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Trigger a safe non-destructive re-eval
        setCharIndex((c) => c);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const renderLineContent = (tokens: CodeToken[], maxChars: number) => {
    let charsRemaining = maxChars;
    return tokens.map((tok, idx) => {
      if (charsRemaining <= 0) return null;
      const textToRender = tok.text.slice(0, charsRemaining);
      charsRemaining -= tok.text.length;
      return (
        <span key={idx} className={tok.className}>
          {textToRender}
        </span>
      );
    });
  };

  return (
    <div className={`p-3 font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden ${fontSizeClass}`}>
      {snippet.lines.map((tokens, idx) => {
        if (!prefersReducedMotion && idx > lineIndex) return null;
        const isCurrentLine = !prefersReducedMotion && idx === lineIndex && !isDone;
        const maxChars = prefersReducedMotion ? tokens.map((t) => t.text).join('').length : (isCurrentLine ? charIndex : tokens.map((t) => t.text).join('').length);

        return (
          <div key={idx} className="flex items-start gap-2 min-h-4.25">
            <span className="select-none text-slate-400/60 dark:text-slate-600/50 text-[9px] w-3.5 text-right shrink-0">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 whitespace-pre overflow-hidden text-ellipsis">
              {renderLineContent(tokens, maxChars)}
              {isCurrentLine && (
                <span className="inline-block w-1.5 h-3.5 bg-primary dark:bg-blue-400 ml-0.5 -mb-0.5 animate-pulse rounded-xs" />
              )}
            </div>
          </div>
        );
      })}

      {isDone && (
        <div className="mt-2 pt-1.5 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[9.5px]">
          <span className="text-primary dark:text-cyan-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-cyan-400 animate-ping" />
            {snippet.successMsg}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px]">live</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   MAIN TECH BACKGROUND SYSTEM
   ========================================================================= */

export function TechBackground() {
  const [activeCenterSnippet, setActiveCenterSnippet] = useState<CodeSnippet>(CENTER_ORCHESTRATOR_SNIPPETS[0]);
  const [activeAiSnippet, setActiveAiSnippet] = useState<CodeSnippet>(AI_SNIPPETS[0]);
  const [activeServerSnippet, setActiveServerSnippet] = useState<CodeSnippet>(SERVER_SNIPPETS[0]);
  const [activeRustSnippet, setActiveRustSnippet] = useState<CodeSnippet>(RUST_SNIPPETS[0]);

  return (
    <div
      aria-hidden="true"
      style={{
        contain: 'paint layout',
        transform: 'translate3d(0, 0, 0)',
      }}
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Ambient background gradient layer for depth and central reading clarity */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(248,250,252,0.6),transparent_85%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />

      {/* Floating Ambient Code Panels Container - Distributed across the entire page */}
      <div className="absolute inset-0 max-w-[1920px] mx-auto w-full h-full overflow-hidden">
        
        {/* =========================================================================
            SECTOR 1: TOP-LEFT — LIVE TYPEWRITER CONSOLE (Python AI Core)
            Speed: 36ms | Delay: 0ms | Hold: 3400ms
           ========================================================================= */}
        <div
          className="absolute -left-10 sm:left-[1%] lg:left-[2%] xl:left-[3%] top-[6%] sm:top-[8%] lg:top-[9%] w-67.5 sm:w-77.5 md:w-82.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.12] dark:opacity-[0.22] transition-opacity hover:opacity-50 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-1"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-blue-400/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 dark:bg-indigo-400/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 dark:bg-cyan-400/50" />
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                ● Live AI Engine
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium">
              {activeAiSnippet.filename}
            </span>
          </div>
          <LiveTypewriterPanel
            snippets={AI_SNIPPETS}
            initialDelay={0}
            typingSpeed={36}
            lineDelay={240}
            holdDelay={3400}
            onSnippetChange={setActiveAiSnippet}
          />
        </div>

        {/* =========================================================================
            SECTOR 2: TOP-RIGHT — TELEMETRY METRICS PAYLOAD (Static)
           ========================================================================= */}
        <div
          className="absolute -right-10 sm:right-[1%] lg:right-[2%] xl:right-[3%] top-[7%] sm:top-[9%] lg:top-[11%] w-65 sm:w-72.5 md:w-77.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.12] dark:opacity-[0.22] transition-opacity hover:opacity-50 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-2"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-blue-500/50" />
              <span className="px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                &#123; &#125; telemetry.json
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] text-blue-700 dark:text-blue-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" /> 200 OK
            </span>
          </div>
          <div className="p-3 text-[10px] sm:text-[10.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div>&#123;</div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-blue-300 font-semibold">&quot;network_status&quot;</span>: <span className="text-slate-600 dark:text-slate-300">&quot;operational&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-blue-300 font-semibold">&quot;active_clusters&quot;</span>: <span className="text-blue-800 dark:text-blue-300 font-bold">128</span>,
            </div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-blue-300 font-semibold">&quot;latency_p99&quot;</span>: <span className="text-blue-700 dark:text-blue-300">&quot;1.24ms&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-blue-300 font-semibold">&quot;uptime_sla&quot;</span>: <span className="text-blue-700 dark:text-blue-300">&quot;99.999%&quot;</span>
            </div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 3: TOP-CENTER UPPER — LIVE TERMINAL EVENT LOG STREAM
           ========================================================================= */}
        <div
          className="hidden xl:block absolute left-[37%] top-[5%] w-77.5 rounded-xl border border-slate-300/25 dark:border-slate-700/25 bg-white/55 dark:bg-slate-900/50 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-[0.10] dark:opacity-[0.18] transition-opacity hover:opacity-45 dark:hover:opacity-55 duration-700 will-change-transform animate-ambient-drift-3"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/30 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9.5px] text-blue-700 dark:text-blue-400 font-semibold">cluster_stream.log</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">STDOUT</span>
          </div>
          <div className="p-2.5 text-[9.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-700 dark:text-blue-400 font-bold">[200 OK]</span>
              <span className="text-slate-800 dark:text-slate-200">POST /v1/ai/stream -&gt; 0.9ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-700 dark:text-blue-400 font-bold">[METRIC]</span>
              <span className="text-slate-800 dark:text-slate-200">p99: 0.82ms | edge healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-700 dark:text-indigo-400 font-bold">[DEPLOY]</span>
              <span className="text-slate-800 dark:text-slate-200">Zero-downtime mesh active</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 4: MID-LEFT — TYPESCRIPT ENTERPRISE AGENT INTERFACE (Static)
           ========================================================================= */}
        <div
          className="hidden md:block absolute left-[1%] lg:left-[2%] xl:left-[3%] top-[34%] lg:top-[36%] w-70 lg:w-77.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.11] dark:opacity-[0.20] transition-opacity hover:opacity-50 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-4"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                &lt;/&gt; enterprise_agent.ts
              </span>
            </div>
            <span className="text-[9px] text-indigo-700 dark:text-indigo-400 font-semibold">v2.4.0</span>
          </div>
          <div className="p-3 text-[10px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div><span className="text-indigo-700 dark:text-indigo-400 font-semibold">export interface</span> <span className="text-blue-700 dark:text-blue-300 font-bold">EnterpriseAgent</span> &#123;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-blue-300 font-semibold">id</span>: <span className="text-indigo-600 dark:text-indigo-300 font-semibold">UUID</span>;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-blue-300 font-semibold">concurrency</span>: <span className="text-blue-700 dark:text-blue-300">&quot;ultra-high&quot;</span>;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-blue-300 font-semibold">execute</span>(task: <span className="text-slate-700 dark:text-slate-300">Task</span>): <span className="text-indigo-700 dark:text-indigo-400 font-semibold">Promise</span>&lt;<span className="text-blue-700 dark:text-blue-300">Result</span>&gt;;</div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 5: MID-RIGHT — LIVE TYPEWRITER CONSOLE (Next.js 15 Server Actions)
            Speed: 48ms | Delay: 1600ms | Hold: 4800ms
           ========================================================================= */}
        <div
          className="hidden sm:block absolute right-[1%] lg:right-[2%] xl:right-[3%] top-[35%] lg:top-[38%] w-67.5 lg:w-77.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.12] dark:opacity-[0.22] transition-opacity hover:opacity-50 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-2"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-blue-500/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600/50 dark:bg-blue-600/50" />
              <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                ● Live Server Action
              </span>
            </div>
            <span className="text-[9px] text-indigo-700 dark:text-indigo-400 font-semibold">
              {activeServerSnippet.filename}
            </span>
          </div>
          <LiveTypewriterPanel
            snippets={SERVER_SNIPPETS}
            initialDelay={1600}
            typingSpeed={48}
            lineDelay={320}
            holdDelay={4800}
            onSnippetChange={setActiveServerSnippet}
          />
        </div>

        {/* =========================================================================
            SECTOR 6: BOTTOM-LEFT — LIVE TYPEWRITER CONSOLE (Rust Stream Engine)
            Speed: 40ms | Delay: 3200ms | Hold: 5600ms
           ========================================================================= */}
        <div
          className="hidden md:block absolute left-[1%] lg:left-[2%] xl:left-[3%] bottom-[8%] lg:bottom-[10%] w-67.5 lg:w-77.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.11] dark:opacity-[0.20] transition-opacity hover:opacity-50 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-3"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                ● Live Rust Engine
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-medium">
              {activeRustSnippet.filename}
            </span>
          </div>
          <LiveTypewriterPanel
            snippets={RUST_SNIPPETS}
            initialDelay={3200}
            typingSpeed={40}
            lineDelay={200}
            holdDelay={5600}
            onSnippetChange={setActiveRustSnippet}
          />
        </div>

        {/* =========================================================================
            SECTOR 7: BOTTOM-RIGHT — KUBERNETES EDGE MESH YAML (Static)
           ========================================================================= */}
        <div
          className="hidden md:block absolute right-[1%] lg:right-[2%] xl:right-[3%] bottom-[9%] lg:bottom-[11%] w-65 lg:w-75 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.11] dark:opacity-[0.20] transition-opacity hover:opacity-50 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-4"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
              &lt;/&gt; k8s_mesh.yaml
            </span>
            <span className="text-[9px] text-slate-500 font-medium">prod-edge</span>
          </div>
          <div className="p-3 text-[10px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div><span className="text-blue-700 dark:text-blue-300 font-semibold">kind</span>: <span className="text-indigo-700 dark:text-indigo-300 font-bold">CloudClusterMesh</span></div>
            <div><span className="text-blue-700 dark:text-blue-300 font-semibold">spec</span>:</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-blue-300 font-semibold">regions</span>: [<span className="text-slate-600 dark:text-slate-300">&quot;iad1&quot;</span>, <span className="text-slate-600 dark:text-slate-300">&quot;fra1&quot;</span>]</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-blue-300 font-semibold">autoscale</span>: &#123; <span className="text-blue-700 dark:text-blue-300">max</span>: <span className="text-blue-800 dark:text-blue-300 font-bold">64</span> &#125;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-blue-300 font-semibold">zeroDowntime</span>: <span className="text-blue-700 dark:text-blue-300">true</span></div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 8: BOTTOM-CENTER — PGVECTOR SEMANTIC RAG SQL (Static)
           ========================================================================= */}
        <div
          className="hidden lg:block absolute left-[37%] bottom-[5%] w-75 rounded-xl border border-slate-300/25 dark:border-slate-700/25 bg-white/55 dark:bg-slate-900/50 shadow-[0_4px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-[0.10] dark:opacity-[0.18] transition-opacity hover:opacity-45 dark:hover:opacity-55 duration-700 will-change-transform animate-ambient-drift-1"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/30 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-300 text-[9px] font-semibold">
              &lt;/&gt; semantic_rag.sql
            </span>
            <span className="text-[9px] text-slate-500 font-medium">pgvector</span>
          </div>
          <div className="p-2.5 text-[9.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div><span className="text-indigo-700 dark:text-indigo-400 font-semibold">SELECT</span> doc_id, tenant_id,</div>
            <div className="pl-2.5"><span className="text-blue-700 dark:text-blue-300">1 - (embedding &lt;=&gt; $query)</span> <span className="text-indigo-700 dark:text-indigo-400 font-semibold">AS</span> score</div>
            <div><span className="text-indigo-700 dark:text-indigo-400 font-semibold">FROM</span> astraiv_vault <span className="text-indigo-700 dark:text-indigo-400 font-semibold">ORDER BY</span> score <span className="text-indigo-700 dark:text-indigo-400 font-semibold">DESC LIMIT</span> 5;</div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 9: CENTER TILE — ASTRAIV ENTERPRISE LIVE CODING (Compact Width, Taller Proportion)
            Speed: 32ms | Delay: 800ms | Hold: 4200ms | Fits between side tiles without overlapping
           ========================================================================= */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 top-[22%] sm:top-[23%] lg:top-[24%] w-90 sm:w-102.5 md:w-112.5 lg:w-120 xl:w-127.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 shadow-[0_8px_30px_rgba(15,23,42,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.22)] opacity-[0.10] dark:opacity-[0.18] transition-opacity hover:opacity-55 dark:hover:opacity-65 duration-700 will-change-transform animate-ambient-drift-1"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/40 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-blue-500/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 dark:bg-indigo-500/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 dark:bg-cyan-500/50" />
              </div>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 text-[9px] font-bold tracking-wide">
                ● Astraiv Hub
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium">
                {activeCenterSnippet.filename}
              </span>
              <span className="inline-flex items-center gap-1 text-[8.5px] text-blue-700 dark:text-blue-400 font-semibold px-1 py-0.5 rounded bg-blue-500/10">
                <span className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                LIVE
              </span>
            </div>
          </div>

          {/* Live Typewriter Coding Body */}
          <LiveTypewriterPanel
            snippets={CENTER_ORCHESTRATOR_SNIPPETS}
            initialDelay={800}
            typingSpeed={32}
            lineDelay={220}
            holdDelay={4200}
            fontSizeClass="text-[9.5px] sm:text-[10px] md:text-[10.5px] p-3 sm:p-3.5"
            onSnippetChange={setActiveCenterSnippet}
          />
        </div>

        {/* =========================================================================
            MICRO-ELEMENTS: Floating Code Tokens (Adjusted positions to ensure 0 collisions)
           ========================================================================= */}
        {/* Token 1: Top-Left Corridor */}
        <div className="absolute top-[24%] left-[6%] sm:left-[8%] hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/25 dark:border-slate-700/25 bg-white/60 dark:bg-slate-900/50 font-mono text-[9.5px] text-blue-700/70 dark:text-blue-300/70 opacity-[0.12] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>k8s.cluster.healthy</span>
        </div>

        {/* Token 2: Top-Right Corridor */}
        <div className="absolute top-[25%] right-[6%] sm:right-[8%] hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/25 dark:border-slate-700/25 bg-white/60 dark:bg-slate-900/50 font-mono text-[9.5px] text-indigo-700/70 dark:text-indigo-300/70 opacity-[0.12] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">λ</span>
          <span>distributed-edge: 0.8ms</span>
        </div>

        {/* Token 3: Mid-Left Corridor */}
        <div className="absolute top-[52%] left-[13%] hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/25 dark:border-slate-700/25 bg-white/60 dark:bg-slate-900/50 font-mono text-[9.5px] text-indigo-700/70 dark:text-indigo-300/70 opacity-[0.12] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-3">
          <span>Next.js 15 // Server Actions</span>
        </div>

        {/* Token 4: Mid-Right Corridor */}
        <div className="absolute top-[54%] right-[13%] hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/25 dark:border-slate-700/25 bg-white/60 dark:bg-slate-900/50 font-mono text-[9.5px] text-blue-700/70 dark:text-blue-300/70 opacity-[0.12] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          <span>TLS 1.3 // AES-GCM-256</span>
        </div>

        {/* Token 5: Bottom-Left Corridor */}
        <div className="absolute top-[75%] left-[12%] hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/25 dark:border-slate-700/25 bg-white/60 dark:bg-slate-900/50 font-mono text-[9.5px] text-blue-700/70 dark:text-blue-300/70 opacity-[0.12] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-2">
          <span>Prisma 6 // Postgres Pool</span>
        </div>

        {/* Token 6: Bottom-Right Corridor */}
        <div className="absolute top-[78%] right-[13%] hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/25 dark:border-slate-700/25 bg-white/60 dark:bg-slate-900/50 font-mono text-[9.5px] text-slate-700/70 dark:text-slate-300/70 opacity-[0.12] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-1">
          <span>0x7F4B92C...SYN/ACK</span>
        </div>

      </div>
    </div>
  );
}
