import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Activity, 
  Clock, 
  FileCode2, 
  Layers, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { AuditResult } from '../types/seo';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  audit: AuditResult;
  onNavigateTab: (tab: NavTab) => void;
  onOpenNewAudit: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  audit,
  onNavigateTab,
  onOpenNewAudit,
}) => {
  const criticalCount = audit.issues.filter((i) => i.severity === 'critical').length;
  const highCount = audit.issues.filter((i) => i.severity === 'high').length;
  const mediumCount = audit.issues.filter((i) => i.severity === 'medium').length;
  const lowCount = audit.issues.filter((i) => i.severity === 'low').length;
  const totalOpen = audit.issues.filter((i) => i.status === 'open' || i.status === 'in_progress').length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreBar = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Critical Issues exist */}
      {criticalCount > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900/60 flex items-center justify-center flex-shrink-0 text-rose-400 border border-rose-700/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {criticalCount} Critical Technical Issue{criticalCount > 1 ? 's' : ''} Detected
              </h3>
              <p className="text-xs text-rose-300">
                These issues may impede crawler indexing, cause HTTP failures, or trigger Core Web Vitals penalties.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('issues')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-900/40 transition flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Review Critical Fixes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall SEO Health Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">SEO Health Score</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              {audit.coveragePercentage}% Coverage
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className={`text-4xl font-extrabold ${getScoreColor(audit.overallScore).split(' ')[0]}`}>
              {audit.overallScore}
            </span>
            <span className="text-slate-400 text-sm font-medium">/ 100</span>
          </div>

          <div className="mt-3">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getScoreBar(audit.overallScore)}`}
                style={{ width: `${audit.overallScore}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Based on {audit.totalChecksEvaluated} automated tests across 8 categories.
            </p>
          </div>
        </div>

        {/* Crawled Pages */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Crawled Pages</span>
            <FileCode2 className="w-4 h-4 text-blue-400" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white">{audit.pages.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {audit.pages.filter(p => p.isIndexable).length} indexable pages verified
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateTab('onpage')}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>Inspect Pages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">
              Avg {Math.round(audit.pages.reduce((a, b) => a + b.responseTimeMs, 0) / (audit.pages.length || 1))}ms
            </span>
          </div>
        </div>

        {/* Total Issues Found */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Active Issues</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white">{totalOpen}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-rose-400 font-bold">{criticalCount} critical</span>,{' '}
              <span className="text-amber-400 font-bold">{highCount} high</span>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateTab('issues')}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>View Issue Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">{audit.issues.length} total</span>
          </div>
        </div>

        {/* Core Web Vitals Lab */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">PageSpeed Performance</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>

          {audit.coreWebVitals ? (
            <div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-extrabold ${getScoreColor(audit.coreWebVitals.performanceScore).split(' ')[0]}`}>
                  {audit.coreWebVitals.performanceScore}
                </span>
                <span className="text-slate-400 text-xs">
                  ({audit.coreWebVitals.device})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                LCP: {audit.coreWebVitals.lcp.value}s | CLS: {audit.coreWebVitals.cls.value}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-lg font-bold text-slate-400">Not Evaluated</div>
              <p className="text-xs text-slate-400 mt-1">Run PageSpeed in Settings</p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateTab('performance')}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>Lighthouse Vitals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">Lab Data</span>
          </div>
        </div>
      </div>

      {/* AI Strategic Synthesis & Action Highlight */}
      {audit.aiExecutiveSummary && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Gemini Strategic Executive Assessment</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    AI Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Synthesized directly from verified crawl data, status codes, and DOM attributes
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('action_plan')}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition"
            >
              <span>View 90-Day Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 mb-5">
            {audit.aiExecutiveSummary.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Primary Risk</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {audit.aiExecutiveSummary.keyRisk}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Highest-Impact Quick Win</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {audit.aiExecutiveSummary.quickWin}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Strategic Horizon</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {audit.aiExecutiveSummary.strategicOutlook}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8 Category Scores Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-white">SEO Pillar Performance</h3>
            <p className="text-xs text-slate-400">
              Calculated using transparent heuristic weights (Total 100%)
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('report')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Full Category Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audit.categoryScores.map((cat) => (
            <div
              key={cat.key}
              onClick={() => {
                if (cat.key === 'technical') onNavigateTab('technical');
                else if (cat.key === 'on_page') onNavigateTab('onpage');
                else if (cat.key === 'content') onNavigateTab('content_ai');
                else if (cat.key === 'performance') onNavigateTab('performance');
                else if (cat.key === 'crawlability') onNavigateTab('technical');
                else onNavigateTab('report');
              }}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition truncate">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Weight {cat.weight}%
                  </span>
                </div>

                <div className="flex items-baseline space-x-2 my-1">
                  <span className={`text-2xl font-extrabold ${getScoreColor(cat.score).split(' ')[0]}`}>
                    {cat.score}
                  </span>
                  <span className="text-slate-400 text-xs">/ 100</span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full ${getScoreBar(cat.score)}`}
                    style={{ width: `${cat.score}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>{cat.criticalIssues + cat.highIssues} urgent issues</span>
                <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crawl Verification & Data Provenance */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Audit Provenance & Sources
          </h4>
          <span className="text-[11px] text-slate-400">
            Audit ID: <code className="text-slate-400">{audit.id}</code>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">HTTP Parser</span>
            <span className="font-semibold text-slate-200">{audit.dataSources.crawler}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Core Web Vitals</span>
            <span className="font-semibold text-slate-200">{audit.dataSources.pagespeed}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">AI Engine</span>
            <span className="font-semibold text-indigo-300">{audit.dataSources.ai}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Search Console</span>
            <span className="font-semibold text-slate-300">{audit.dataSources.gsc}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Backlink Data</span>
            <span className="font-semibold text-slate-300">{audit.dataSources.backlinks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
