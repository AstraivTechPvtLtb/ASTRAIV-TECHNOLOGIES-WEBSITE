'use client';

import React from 'react';

export function TechBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Ambient background gradient layer for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(91,95,239,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(91,95,239,0.12),transparent_70%)]" />

      {/* Subtle Global Technical Coordinate Grid */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.055] bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)]" />

      {/* Floating Ambient Code Panels Container with gentle organic animations */}
      <div className="absolute inset-0 max-w-[1920px] mx-auto w-full h-full overflow-hidden">
        
        {/* =========================================================================
            PANEL 1: Python AI Stream Kernel (Top-Left / Hero & Stats flank)
           ========================================================================= */}
        <div
          className="absolute -top-4 -left-12 sm:left-[3%] lg:left-[4%] xl:left-[6%] top-[8%] sm:top-[12%] lg:top-[14%] w-[290px] sm:w-[340px] md:w-[390px] rounded-xl border border-slate-300/80 dark:border-slate-700/25 bg-white/75 dark:bg-slate-900/20 backdrop-blur-[4px] dark:backdrop-blur-[2px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-75 dark:opacity-40 transition-opacity hover:opacity-95 dark:hover:opacity-75 duration-700 will-change-transform animate-ambient-drift-1"
        >
          {/* Header Tab Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-800/20 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500/70 dark:bg-rose-500/30" />
              <span className="w-2 h-2 rounded-full bg-amber-500/70 dark:bg-amber-500/30" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/70 dark:bg-emerald-500/30" />
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[10px] font-medium tracking-wide">
                &lt;/&gt; python
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-500/60 tracking-wider">astraiv_ai_engine.py</span>
          </div>
          {/* Code Body */}
          <div className="p-3.5 text-[11px] sm:text-[11.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-400/75 overflow-hidden">
            <div className="flex gap-3">
              <span className="select-none text-slate-400 dark:text-slate-600/50 text-[10px]">01</span>
              <div><span className="text-purple-700 font-medium dark:text-purple-400/80">import</span> <span className="text-slate-800 font-medium dark:text-slate-200/80">astraiv_neural</span> <span className="text-purple-700 font-medium dark:text-purple-400/80">as</span> <span className="text-slate-800 font-medium dark:text-slate-200/80">ai</span></div>
            </div>
            <div className="flex gap-3">
              <span className="select-none text-slate-400 dark:text-slate-600/50 text-[10px]">02</span>
              <div><span className="text-blue-700 font-medium dark:text-cyan-400/80">@ai.distributed_pipeline</span>(region=<span className="text-emerald-700 dark:text-emerald-300/80">&quot;global-edge&quot;</span>)</div>
            </div>
            <div className="flex gap-3">
              <span className="select-none text-slate-400 dark:text-slate-600/50 text-[10px]">03</span>
              <div><span className="text-purple-700 font-medium dark:text-purple-400/80">async def</span> <span className="text-blue-700 font-semibold dark:text-blue-300/80">stream_inference</span>(tensor_batch):</div>
            </div>
            <div className="flex gap-3">
              <span className="select-none text-slate-400 dark:text-slate-600/50 text-[10px]">04</span>
              <div className="pl-3"><span className="text-slate-800 dark:text-slate-300/80">cluster</span> = <span className="text-purple-700 font-medium dark:text-purple-400/80">await</span> ai.connect_cluster()</div>
            </div>
            <div className="flex gap-3">
              <span className="select-none text-slate-400 dark:text-slate-600/50 text-[10px]">05</span>
              <div className="pl-3"><span className="text-purple-700 font-medium dark:text-purple-400/80">return await</span> cluster.dispatch(tensor_batch, sla=<span className="text-amber-700 font-medium dark:text-amber-300/80">0.9999</span>)</div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 2: JSON Distributed Telemetry Payload (Top-Right / Hero flank)
           ========================================================================= */}
        <div
          className="absolute -top-4 -right-12 sm:right-[3%] lg:right-[4%] xl:right-[6%] top-[10%] sm:top-[15%] lg:top-[18%] w-[280px] sm:w-[320px] md:w-[360px] rounded-xl border border-slate-300/80 dark:border-slate-700/25 bg-white/75 dark:bg-slate-900/20 backdrop-blur-[4px] dark:backdrop-blur-[2px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-75 dark:opacity-40 transition-opacity hover:opacity-95 dark:hover:opacity-75 duration-700 will-change-transform animate-ambient-drift-2"
        >
          {/* Header Tab Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-800/20 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500/70 dark:bg-blue-500/40" />
              <span className="px-2 py-0.5 rounded bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium tracking-wide">
                &#123; &#125; telemetry.json
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium dark:text-emerald-400/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 200 OK
            </span>
          </div>
          {/* Code Body */}
          <div className="p-3.5 text-[11px] sm:text-[11.5px] font-mono leading-relaxed text-slate-700 dark:text-slate-400/75 overflow-hidden">
            <div>&#123;</div>
            <div className="pl-3.5">
              <span className="text-blue-700 font-medium dark:text-cyan-300/80">&quot;network_status&quot;</span>: <span className="text-emerald-700 dark:text-emerald-300/80">&quot;operational&quot;</span>,
            </div>
            <div className="pl-3.5">
              <span className="text-blue-700 font-medium dark:text-cyan-300/80">&quot;active_clusters&quot;</span>: <span className="text-amber-700 font-medium dark:text-amber-300/80">128</span>,
            </div>
            <div className="pl-3.5">
              <span className="text-blue-700 font-medium dark:text-cyan-300/80">&quot;latency_p99&quot;</span>: <span className="text-emerald-700 dark:text-emerald-300/80">&quot;1.24ms&quot;</span>,
            </div>
            <div className="pl-3.5">
              <span className="text-blue-700 font-medium dark:text-cyan-300/80">&quot;uptime_sla&quot;</span>: <span className="text-emerald-700 dark:text-emerald-300/80">&quot;99.999%&quot;</span>
            </div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 3: TypeScript Enterprise Agent Interface (Mid-Left / Services & Why)
           ========================================================================= */}
        <div
          className="hidden md:block absolute left-[2%] lg:left-[5%] xl:left-[8%] top-[48%] lg:top-[50%] w-[320px] lg:w-[370px] rounded-xl border border-slate-300/80 dark:border-slate-700/25 bg-white/75 dark:bg-slate-900/20 backdrop-blur-[4px] dark:backdrop-blur-[2px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-70 dark:opacity-35 transition-opacity hover:opacity-95 dark:hover:opacity-75 duration-700 will-change-transform animate-ambient-drift-3"
        >
          {/* Header Tab Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-800/20 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 text-[10px] font-medium tracking-wide">
                &lt;/&gt; typescript
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500/60">agent.ts</span>
            </div>
            <span className="text-[10px] text-indigo-700 font-medium dark:text-indigo-400/70">v2.4.0</span>
          </div>
          {/* Code Body */}
          <div className="p-3.5 text-[11px] font-mono leading-relaxed text-slate-700 dark:text-slate-400/75 overflow-hidden">
            <div><span className="text-purple-700 font-medium dark:text-purple-400/80">export interface</span> <span className="text-amber-700 font-semibold dark:text-amber-300/80">EnterpriseAgent</span> &#123;</div>
            <div className="pl-3.5"><span className="text-blue-700 font-medium dark:text-cyan-300/80">id</span>: <span className="text-emerald-700 dark:text-emerald-300/80">UUID</span>;</div>
            <div className="pl-3.5"><span className="text-blue-700 font-medium dark:text-cyan-300/80">concurrency</span>: <span className="text-purple-700 font-medium dark:text-purple-300/80">&quot;ultra-high&quot;</span>;</div>
            <div className="pl-3.5"><span className="text-blue-700 font-medium dark:text-cyan-300/80">execute</span>(task: <span className="text-amber-700 font-medium dark:text-amber-300/80">EnterpriseTask</span>): <span className="text-purple-700 font-medium dark:text-purple-400/80">Promise</span>&lt;<span className="text-amber-700 font-medium dark:text-amber-300/80">JobResult</span>&gt;;</div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 4: Go Concurrency Engine / API Gateway (Mid-Right / Process & Pricing)
           ========================================================================= */}
        <div
          className="hidden sm:block absolute right-[2%] lg:right-[4%] xl:right-[7%] top-[55%] lg:top-[58%] w-[310px] lg:w-[360px] rounded-xl border border-slate-300/80 dark:border-slate-700/25 bg-white/75 dark:bg-slate-900/20 backdrop-blur-[4px] dark:backdrop-blur-[2px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-70 dark:opacity-35 transition-opacity hover:opacity-95 dark:hover:opacity-75 duration-700 will-change-transform animate-ambient-drift-1"
        >
          {/* Header Tab Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-800/20 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-cyan-600/10 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 text-[10px] font-medium tracking-wide">
                &lt;/&gt; go
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500/60">worker_pool.go</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium dark:text-emerald-400/70">sync.WaitGroup</span>
          </div>
          {/* Code Body */}
          <div className="p-3.5 text-[11px] font-mono leading-relaxed text-slate-700 dark:text-slate-400/75 overflow-hidden">
            <div><span className="text-purple-700 font-medium dark:text-purple-400/80">func</span> <span className="text-blue-700 font-semibold dark:text-blue-300/80">SpawnWorker</span>(ctx context.Context, job *Job) &#123;</div>
            <div className="pl-3.5"><span className="text-purple-700 font-medium dark:text-purple-400/80">go func</span>() &#123;</div>
            <div className="pl-7"><span className="text-slate-800 dark:text-slate-300/80">workerPool</span>.Submit(job.Execute)</div>
            <div className="pl-3.5">&#125;()</div>
            <div>&#125;</div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 5: Vector DB / Semantic Search Embeddings (Bottom-Left / Process flank)
           ========================================================================= */}
        <div
          className="hidden lg:block absolute left-[4%] xl:left-[8%] bottom-[8%] w-[330px] rounded-xl border border-slate-300/80 dark:border-slate-700/25 bg-white/75 dark:bg-slate-900/20 backdrop-blur-[4px] dark:backdrop-blur-[2px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-65 dark:opacity-30 transition-opacity hover:opacity-95 dark:hover:opacity-75 duration-700 will-change-transform animate-ambient-drift-2"
        >
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-800/20 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-violet-600/10 dark:bg-violet-400/10 text-violet-700 dark:text-violet-300 text-[10px] font-medium tracking-wide">
              &lt;/&gt; vectordb
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-500/60">cosine_sim.sql</span>
          </div>
          <div className="p-3.5 text-[11px] font-mono leading-relaxed text-slate-700 dark:text-slate-400/75 overflow-hidden">
            <div><span className="text-purple-700 font-medium dark:text-purple-400/80">SELECT</span> doc_id, title,</div>
            <div className="pl-3.5"><span className="text-blue-700 font-medium dark:text-cyan-300/80">1 - (embedding &lt;=&gt; query_vector)</span> <span className="text-purple-700 font-medium dark:text-purple-400/80">AS</span> similarity</div>
            <div><span className="text-purple-700 font-medium dark:text-purple-400/80">FROM</span> astraiv_knowledge_base</div>
            <div><span className="text-purple-700 font-medium dark:text-purple-400/80">ORDER BY</span> similarity <span className="text-purple-700 font-medium dark:text-purple-400/80">DESC LIMIT</span> 5;</div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 6: Cloud Native Deployment cURL / Gateway (Bottom-Right / Pricing flank)
           ========================================================================= */}
        <div
          className="hidden md:block absolute right-[4%] xl:right-[9%] bottom-[12%] w-[330px] rounded-xl border border-slate-300/80 dark:border-slate-700/25 bg-white/75 dark:bg-slate-900/20 backdrop-blur-[4px] dark:backdrop-blur-[2px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-65 dark:opacity-30 transition-opacity hover:opacity-95 dark:hover:opacity-75 duration-700 will-change-transform animate-ambient-drift-3"
        >
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-800/20 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-amber-600/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 text-[10px] font-medium tracking-wide">
              &lt;/&gt; curl
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-500/60">POST /v1/orchestrate</span>
          </div>
          <div className="p-3.5 text-[11px] font-mono leading-relaxed text-slate-700 dark:text-slate-400/75 overflow-hidden">
            <div><span className="text-emerald-700 font-medium dark:text-emerald-300/80">curl</span> -X POST https://api.astraiv.com/v1/deploy \</div>
            <div className="pl-3.5">-H <span className="text-amber-700 font-medium dark:text-amber-300/80">&quot;Authorization: Bearer $ASTRA_KEY&quot;</span> \</div>
            <div className="pl-3.5">-d <span className="text-blue-700 font-medium dark:text-cyan-300/80">&#39;&#123;&quot;autoscale&quot;: true, &quot;k8s&quot;: &quot;prod-01&quot;&#125;&#39;</span></div>
          </div>
        </div>

        {/* =========================================================================
            MICRO-ELEMENTS: Floating Code Tokens, Syntax Badges & Digital Nodes
           ========================================================================= */}
        {/* Token 1 */}
        <div className="absolute top-[28%] left-[18%] hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300/80 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/15 backdrop-blur-[2px] font-mono text-[10px] text-blue-700 dark:text-cyan-400/50 opacity-70 dark:opacity-35 shadow-xs animate-ambient-drift-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          <span>k8s.cluster.healthy</span>
        </div>

        {/* Token 2 */}
        <div className="absolute top-[35%] right-[16%] hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300/80 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/15 backdrop-blur-[2px] font-mono text-[10px] text-indigo-700 dark:text-indigo-400/50 opacity-70 dark:opacity-35 shadow-xs animate-ambient-drift-1">
          <span className="text-indigo-600 dark:text-indigo-400/70 font-semibold">λ</span>
          <span>distributed-edge: 0.8ms</span>
        </div>

        {/* Token 3 */}
        <div className="absolute top-[72%] left-[14%] hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300/80 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/15 backdrop-blur-[2px] font-mono text-[10px] text-emerald-700 dark:text-emerald-400/50 opacity-65 dark:opacity-30 shadow-xs animate-ambient-drift-3">
          <span>TLS 1.3 // AES-GCM-256</span>
        </div>

        {/* Token 4 */}
        <div className="absolute top-[82%] right-[22%] hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300/80 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/15 backdrop-blur-[2px] font-mono text-[10px] text-slate-700 dark:text-slate-400/40 opacity-65 dark:opacity-30 shadow-xs animate-ambient-drift-1">
          <span>0x7F4B92C...SYN</span>
        </div>

        {/* Tech Coordinate Markers */}
        <div className="absolute top-[22%] left-[45%] font-mono text-[9px] text-slate-500/70 dark:text-slate-600/40 hidden lg:block tracking-widest">
          + 28.40.AI.INFRA
        </div>
        <div className="absolute top-[68%] right-[42%] font-mono text-[9px] text-slate-500/70 dark:text-slate-600/40 hidden lg:block tracking-widest">
          + 99.99.SLA.ACTIVE
        </div>

      </div>
    </div>
  );
}

