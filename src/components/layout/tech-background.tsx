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

const AI_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'astraiv_ai_engine.py',
    lang: 'python',
    badge: 'AI Core v2.4',
    successMsg: '✓ Tensor batch dispatched (0.8ms)',
    lines: [
      [
        { text: 'import ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'astraiv_neural ', className: 'text-slate-800 dark:text-slate-200' },
        { text: 'as ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'ai', className: 'text-blue-700 dark:text-cyan-300 font-semibold' },
      ],
      [
        { text: '@ai.distributed_pipeline', className: 'text-blue-700 dark:text-cyan-400 font-semibold' },
        { text: '(', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'region=', className: 'text-slate-700 dark:text-slate-300' },
        { text: '"global-edge"', className: 'text-emerald-700 dark:text-emerald-300' },
        { text: ')', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: 'async def ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'stream_inference', className: 'text-blue-700 dark:text-blue-300 font-bold' },
        { text: '(tensor):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    cluster = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'await ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'ai.connect_cluster()', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    return await ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'cluster.dispatch(tensor, sla=', className: 'text-slate-700 dark:text-slate-300' },
        { text: '0.9999', className: 'text-amber-700 dark:text-amber-300 font-bold' },
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
        { text: 'class ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'AstraivReasoningAgent', className: 'text-amber-700 dark:text-amber-300 font-bold' },
        { text: ':', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    def ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: '__init__', className: 'text-blue-700 dark:text-cyan-300 font-bold' },
        { text: '(self, model_id: str):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        self.engine = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'load_optimized_weights(model_id)', className: 'text-emerald-700 dark:text-emerald-300' },
      ],
      [
        { text: '    async def ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'solve_task', className: 'text-blue-700 dark:text-cyan-300 font-bold' },
        { text: '(self, prompt):', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '        return await ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'self.engine.stream_tokens(prompt)', className: 'text-slate-800 dark:text-slate-200' },
      ],
    ],
  },
];

const SERVER_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'server_action.ts',
    lang: 'typescript',
    badge: 'Next.js 15',
    successMsg: '⚡ Zero-downtime stream active',
    lines: [
      [
        { text: "'use server';", className: 'text-purple-700 dark:text-purple-400 font-bold' },
      ],
      [
        { text: 'export async function ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'orchestratePipeline', className: 'text-blue-700 dark:text-cyan-300 font-bold' },
        { text: '() {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    const ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'session = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'await ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'auth.verify();', className: 'text-blue-700 dark:text-blue-300' },
      ],
      [
        { text: '    return await ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'astraivEngine.stream({', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '        concurrency: ', className: 'text-blue-700 dark:text-cyan-300' },
        { text: '64', className: 'text-amber-700 dark:text-amber-300 font-bold' },
        { text: ', sla: ', className: 'text-slate-700 dark:text-slate-300' },
        { text: '"ultra-low"', className: 'text-emerald-700 dark:text-emerald-300' },
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
        { text: 'export const ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'validateEdgeRequest = ', className: 'text-blue-700 dark:text-cyan-300 font-bold' },
        { text: 'async (req) => {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    const ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'token = req.headers.get("authorization");', className: 'text-slate-800 dark:text-slate-200' },
      ],
      [
        { text: '    if (!token) ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'throw new ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'UnauthorizedError();', className: 'text-rose-600 dark:text-rose-400' },
      ],
      [
        { text: '    return await ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'jwt.verify(token, process.env.SECRET);', className: 'text-emerald-700 dark:text-emerald-300' },
      ],
      [
        { text: '};', className: 'text-slate-700 dark:text-slate-300' },
      ],
    ],
  },
];

const RUST_SNIPPETS: CodeSnippet[] = [
  {
    filename: 'engine.rs',
    lang: 'rust',
    badge: 'tokio::async',
    successMsg: '🚀 Worker pool connected (64 threads)',
    lines: [
      [
        { text: 'pub async fn ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'handle_stream', className: 'text-blue-700 dark:text-cyan-300 font-bold' },
        { text: '(stream: Arc<Queue>) -> Result<()> {', className: 'text-slate-700 dark:text-slate-300' },
      ],
      [
        { text: '    let ', className: 'text-purple-700 dark:text-purple-400 font-semibold' },
        { text: 'cluster = ', className: 'text-slate-700 dark:text-slate-300' },
        { text: 'WorkerPool::bind(', className: 'text-slate-800 dark:text-slate-200' },
        { text: '"0.0.0.0:8080"', className: 'text-emerald-700 dark:text-emerald-300' },
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
];

function LiveTypewriterPanel({ snippets, initialDelay = 0 }: { snippets: CodeSnippet[]; initialDelay?: number }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [started, setStarted] = useState(initialDelay === 0);

  useEffect(() => {
    if (initialDelay > 0 && !started) {
      const startTimer = setTimeout(() => setStarted(true), initialDelay);
      return () => clearTimeout(startTimer);
    }
  }, [initialDelay, started]);

  const snippet = snippets[snippetIndex];
  const currentLine = snippet.lines[lineIndex];
  const lineFullText = currentLine ? currentLine.map((t) => t.text).join('') : '';

  useEffect(() => {
    if (!started) return;

    if (isDone) {
      const resetTimer = setTimeout(() => {
        setIsDone(false);
        setLineIndex(0);
        setCharIndex(0);
        setSnippetIndex((prev) => (prev + 1) % snippets.length);
      }, 3400);
      return () => clearTimeout(resetTimer);
    }

    if (lineIndex >= snippet.lines.length) {
      setIsDone(true);
      return;
    }

    if (charIndex < lineFullText.length) {
      const speed = Math.random() * 20 + 22; // ~22ms - 42ms
      const timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const nextLineTimer = setTimeout(() => {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 240);
      return () => clearTimeout(nextLineTimer);
    }
  }, [charIndex, lineIndex, isDone, snippet, lineFullText, started, snippets.length]);

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
    <div className="p-3 text-[10px] sm:text-[10.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
      {snippet.lines.map((tokens, idx) => {
        if (idx > lineIndex) return null;
        const isCurrentLine = idx === lineIndex && !isDone;
        const maxChars = isCurrentLine ? charIndex : tokens.map((t) => t.text).join('').length;

        return (
          <div key={idx} className="flex items-start gap-2.5 min-h-[18px]">
            <span className="select-none text-slate-400/60 dark:text-slate-600/50 text-[9px] w-3 text-right shrink-0">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 whitespace-pre">
              {renderLineContent(tokens, maxChars)}
              {isCurrentLine && (
                <span className="inline-block w-1.5 h-3.5 bg-primary dark:bg-cyan-400 ml-0.5 -mb-0.5 animate-pulse rounded-xs" />
              )}
            </div>
          </div>
        );
      })}

      {isDone && (
        <div className="mt-2 pt-1.5 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[9.5px]">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {snippet.successMsg}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px]">live</span>
        </div>
      )}
    </div>
  );
}

export function TechBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Ambient background gradient layer for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(91,95,239,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(91,95,239,0.09),transparent_70%)]" />

      {/* Subtle Technical Coordinate Grid */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#94A3B8_1px,transparent_1px),linear-gradient(to_bottom,#94A3B8_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_85%_80%_at_50%_45%,#000_75%,transparent_100%)]" />

      {/* Floating Ambient Code Panels Container - Distributed across the entire page */}
      <div className="absolute inset-0 max-w-[1920px] mx-auto w-full h-full overflow-hidden">
        
        {/* =========================================================================
            SECTOR 1: TOP-LEFT — LIVE TYPEWRITER CONSOLE (Python AI Core)
           ========================================================================= */}
        <div
          className="absolute -left-10 sm:left-[1%] lg:left-[2%] xl:left-[3%] top-[6%] sm:top-[8%] lg:top-[9%] w-[270px] sm:w-[310px] md:w-[340px] rounded-xl border border-slate-300/45 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/25 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.28] dark:opacity-[0.22] transition-opacity hover:opacity-70 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-1"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-800/25 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60 dark:bg-rose-500/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 dark:bg-amber-500/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 dark:bg-emerald-500/50" />
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                ● Live AI Engine
              </span>
            </div>
            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium">astraiv.ai.py</span>
          </div>
          <LiveTypewriterPanel snippets={AI_SNIPPETS} initialDelay={0} />
        </div>

        {/* =========================================================================
            SECTOR 2: TOP-RIGHT — TELEMETRY METRICS PAYLOAD
           ========================================================================= */}
        <div
          className="absolute -right-10 sm:right-[1%] lg:right-[2%] xl:right-[3%] top-[7%] sm:top-[9%] lg:top-[11%] w-[260px] sm:w-[290px] md:w-[320px] rounded-xl border border-slate-300/45 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/25 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.28] dark:opacity-[0.22] transition-opacity hover:opacity-70 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-2"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-800/25 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 dark:bg-blue-500/50" />
              <span className="px-1.5 py-0.5 rounded bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-semibold">
                &#123; &#125; telemetry.json
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" /> 200 OK
            </span>
          </div>
          <div className="p-3 text-[10px] sm:text-[10.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div>&#123;</div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-cyan-300 font-semibold">&quot;network_status&quot;</span>: <span className="text-emerald-700 dark:text-emerald-300">&quot;operational&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-cyan-300 font-semibold">&quot;active_clusters&quot;</span>: <span className="text-amber-700 dark:text-amber-300 font-bold">128</span>,
            </div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-cyan-300 font-semibold">&quot;latency_p99&quot;</span>: <span className="text-emerald-700 dark:text-emerald-300">&quot;1.24ms&quot;</span>,
            </div>
            <div className="pl-3">
              <span className="text-blue-700 dark:text-cyan-300 font-semibold">&quot;uptime_sla&quot;</span>: <span className="text-emerald-700 dark:text-emerald-300">&quot;99.999%&quot;</span>
            </div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 3: TOP-CENTER UPPER — LIVE TERMINAL EVENT LOG STREAM
           ========================================================================= */}
        <div
          className="hidden xl:block absolute left-[36%] top-[6%] w-[330px] rounded-xl border border-slate-300/40 dark:border-slate-700/25 bg-white/40 dark:bg-slate-900/20 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-[0.24] dark:opacity-[0.18] transition-opacity hover:opacity-65 dark:hover:opacity-55 duration-700 will-change-transform animate-ambient-drift-3"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/20 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-semibold">cluster_stream.log</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">STDOUT</span>
          </div>
          <div className="p-2.5 text-[9.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">[200 OK]</span>
              <span className="text-slate-800 dark:text-slate-200">POST /v1/ai/stream -&gt; 0.9ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-700 dark:text-cyan-400 font-bold">[METRIC]</span>
              <span className="text-slate-800 dark:text-slate-200">p99: 0.82ms | edge healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-700 dark:text-purple-400 font-bold">[DEPLOY]</span>
              <span className="text-slate-800 dark:text-slate-200">Zero-downtime mesh active</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 4: MID-LEFT — TYPESCRIPT ENTERPRISE AGENT INTERFACE
           ========================================================================= */}
        <div
          className="hidden md:block absolute left-[1%] lg:left-[2.5%] xl:left-[4%] top-[34%] lg:top-[36%] w-[290px] lg:w-[330px] rounded-xl border border-slate-300/45 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/25 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.26] dark:opacity-[0.20] transition-opacity hover:opacity-70 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-4"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-800/25 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                &lt;/&gt; enterprise_agent.ts
              </span>
            </div>
            <span className="text-[9px] text-indigo-700 dark:text-indigo-400 font-semibold">v2.4.0</span>
          </div>
          <div className="p-3 text-[10px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div><span className="text-purple-700 dark:text-purple-400 font-semibold">export interface</span> <span className="text-amber-700 dark:text-amber-300 font-bold">EnterpriseAgent</span> &#123;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-cyan-300 font-semibold">id</span>: <span className="text-emerald-700 dark:text-emerald-300 font-semibold">UUID</span>;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-cyan-300 font-semibold">concurrency</span>: <span className="text-purple-700 dark:text-purple-300">&quot;ultra-high&quot;</span>;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-cyan-300 font-semibold">execute</span>(task: <span className="text-amber-700 dark:text-amber-300">Task</span>): <span className="text-purple-700 dark:text-purple-400 font-semibold">Promise</span>&lt;<span className="text-amber-700 dark:text-amber-300">Result</span>&gt;;</div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 5: MID-RIGHT — LIVE TYPEWRITER CONSOLE (Next.js 15 Server Actions)
           ========================================================================= */}
        <div
          className="hidden sm:block absolute right-[1%] lg:right-[2.5%] xl:right-[4%] top-[35%] lg:top-[38%] w-[280px] lg:w-[330px] rounded-xl border border-slate-300/45 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/25 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.28] dark:opacity-[0.22] transition-opacity hover:opacity-70 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-2"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-800/25 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 dark:bg-blue-500/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 dark:bg-cyan-500/50" />
              <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[9px] font-semibold">
                ● Live Server Action
              </span>
            </div>
            <span className="text-[9px] text-purple-700 dark:text-purple-400 font-semibold">&apos;use server&apos;</span>
          </div>
          <LiveTypewriterPanel snippets={SERVER_SNIPPETS} initialDelay={1200} />
        </div>

        {/* =========================================================================
            SECTOR 6: BOTTOM-LEFT — LIVE TYPEWRITER CONSOLE (Rust Stream Engine)
           ========================================================================= */}
        <div
          className="hidden md:block absolute left-[1%] lg:left-[2%] xl:left-[3%] bottom-[8%] lg:bottom-[10%] w-[280px] lg:w-[330px] rounded-xl border border-slate-300/45 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/25 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.26] dark:opacity-[0.20] transition-opacity hover:opacity-70 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-3"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-800/25 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-orange-600/10 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 text-[9px] font-semibold">
                ● Live Rust Engine
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-medium">tokio::stream</span>
          </div>
          <LiveTypewriterPanel snippets={RUST_SNIPPETS} initialDelay={2400} />
        </div>

        {/* =========================================================================
            SECTOR 7: BOTTOM-RIGHT — KUBERNETES EDGE MESH YAML
           ========================================================================= */}
        <div
          className="hidden md:block absolute right-[1%] lg:right-[2%] xl:right-[3%] bottom-[9%] lg:bottom-[11%] w-[270px] lg:w-[310px] rounded-xl border border-slate-300/45 dark:border-slate-700/30 bg-white/45 dark:bg-slate-900/25 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18)] opacity-[0.26] dark:opacity-[0.20] transition-opacity hover:opacity-70 dark:hover:opacity-60 duration-700 will-change-transform animate-ambient-drift-4"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-800/25 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-amber-600/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 text-[9px] font-semibold">
              &lt;/&gt; k8s_mesh.yaml
            </span>
            <span className="text-[9px] text-slate-500 font-medium">prod-edge</span>
          </div>
          <div className="p-3 text-[10px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div><span className="text-blue-700 dark:text-cyan-300 font-semibold">kind</span>: <span className="text-amber-700 dark:text-amber-300 font-bold">CloudClusterMesh</span></div>
            <div><span className="text-blue-700 dark:text-cyan-300 font-semibold">spec</span>:</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-cyan-300 font-semibold">regions</span>: [<span className="text-emerald-700 dark:text-emerald-300">&quot;iad1&quot;</span>, <span className="text-emerald-700 dark:text-emerald-300">&quot;fra1&quot;</span>]</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-cyan-300 font-semibold">autoscale</span>: &#123; <span className="text-blue-700 dark:text-cyan-300">max</span>: <span className="text-amber-700 dark:text-amber-300 font-bold">64</span> &#125;</div>
            <div className="pl-3"><span className="text-blue-700 dark:text-cyan-300 font-semibold">zeroDowntime</span>: <span className="text-emerald-700 dark:text-emerald-300">true</span></div>
          </div>
        </div>

        {/* =========================================================================
            SECTOR 8: BOTTOM-CENTER — PGVECTOR SEMANTIC RAG SQL
           ========================================================================= */}
        <div
          className="hidden lg:block absolute left-[37%] bottom-[5%] w-[310px] rounded-xl border border-slate-300/40 dark:border-slate-700/25 bg-white/40 dark:bg-slate-900/20 backdrop-blur-[3px] shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-[0.24] dark:opacity-[0.18] transition-opacity hover:opacity-65 dark:hover:opacity-55 duration-700 will-change-transform animate-ambient-drift-1"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-800/20 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-violet-600/10 dark:bg-violet-400/10 text-violet-700 dark:text-violet-300 text-[9px] font-semibold">
              &lt;/&gt; semantic_rag.sql
            </span>
            <span className="text-[9px] text-slate-500 font-medium">pgvector</span>
          </div>
          <div className="p-2.5 text-[9.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 overflow-hidden">
            <div><span className="text-purple-700 dark:text-purple-400 font-semibold">SELECT</span> doc_id, tenant_id,</div>
            <div className="pl-2.5"><span className="text-blue-700 dark:text-cyan-300">1 - (embedding &lt;=&gt; $query)</span> <span className="text-purple-700 dark:text-purple-400 font-semibold">AS</span> score</div>
            <div><span className="text-purple-700 dark:text-purple-400 font-semibold">FROM</span> astraiv_vault <span className="text-purple-700 dark:text-purple-400 font-semibold">ORDER BY</span> score <span className="text-purple-700 dark:text-purple-400 font-semibold">DESC LIMIT</span> 5;</div>
          </div>
        </div>

        {/* =========================================================================
            MICRO-ELEMENTS: Floating Code Tokens, Syntax Badges & Digital Nodes
           ========================================================================= */}
        {/* Token 1: Top-Left Corridor */}
        <div className="absolute top-[22%] left-[12%] hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/35 dark:border-slate-700/25 bg-white/35 dark:bg-slate-900/20 backdrop-blur-[2px] font-mono text-[9.5px] text-blue-700/80 dark:text-cyan-300/70 opacity-[0.26] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span>k8s.cluster.healthy</span>
        </div>

        {/* Token 2: Top-Right Corridor */}
        <div className="absolute top-[24%] right-[14%] hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/35 dark:border-slate-700/25 bg-white/35 dark:bg-slate-900/20 backdrop-blur-[2px] font-mono text-[9.5px] text-indigo-700/80 dark:text-indigo-300/70 opacity-[0.26] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">λ</span>
          <span>distributed-edge: 0.8ms</span>
        </div>

        {/* Token 3: Mid-Center Corridor */}
        <div className="absolute top-[52%] left-[16%] hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/35 dark:border-slate-700/25 bg-white/35 dark:bg-slate-900/20 backdrop-blur-[2px] font-mono text-[9.5px] text-purple-700/80 dark:text-purple-300/70 opacity-[0.26] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-3">
          <span>Next.js 15 // Server Actions</span>
        </div>

        {/* Token 4: Mid-Right Corridor */}
        <div className="absolute top-[54%] right-[16%] hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/35 dark:border-slate-700/25 bg-white/35 dark:bg-slate-900/20 backdrop-blur-[2px] font-mono text-[9.5px] text-emerald-700/80 dark:text-emerald-300/70 opacity-[0.26] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>TLS 1.3 // AES-GCM-256</span>
        </div>

        {/* Token 5: Bottom-Left Corridor */}
        <div className="absolute top-[75%] left-[14%] hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/35 dark:border-slate-700/25 bg-white/35 dark:bg-slate-900/20 backdrop-blur-[2px] font-mono text-[9.5px] text-amber-700/80 dark:text-amber-300/70 opacity-[0.26] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-2">
          <span>Prisma 6 // Postgres Pool</span>
        </div>

        {/* Token 6: Bottom-Right Corridor */}
        <div className="absolute top-[78%] right-[15%] hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300/35 dark:border-slate-700/25 bg-white/35 dark:bg-slate-900/20 backdrop-blur-[2px] font-mono text-[9.5px] text-slate-800/80 dark:text-slate-300/70 opacity-[0.26] dark:opacity-[0.20] shadow-2xs animate-ambient-drift-1">
          <span>0x7F4B92C...SYN/ACK</span>
        </div>

        {/* Tech Coordinate Markers */}
        <div className="absolute top-[18%] left-[48%] font-mono text-[9px] text-slate-500/70 dark:text-slate-400/50 font-semibold hidden lg:block tracking-widest">
          + 28.40.AI.INFRA
        </div>
        <div className="absolute top-[48%] right-[44%] font-mono text-[9px] text-slate-500/70 dark:text-slate-400/50 font-semibold hidden lg:block tracking-widest">
          + 00.12.EDGE.LATENCY
        </div>
        <div className="absolute top-[78%] left-[45%] font-mono text-[9px] text-slate-500/70 dark:text-slate-400/50 font-semibold hidden lg:block tracking-widest">
          + 99.99.SLA.ACTIVE
        </div>

      </div>
    </div>
  );
}
