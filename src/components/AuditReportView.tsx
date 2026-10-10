import React from 'react';
import { AuditResult } from '../types/seo';
import { 
  FileCheck2, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Download
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { exportIssuesToCsv } from '../utils/exportUtils';

interface AuditReportViewProps {
  audit: AuditResult;
  onNavigateTab: (tab: NavTab) => void;
  onOpenPrintReport?: () => void;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({
  audit,
  onNavigateTab,
  onOpenPrintReport,
}) => {
  const critical = audit.issues.filter(i => i.severity === 'critical').length;
  const high = audit.issues.filter(i => i.severity === 'high').length;
  const medium = audit.issues.filter(i => i.severity === 'medium').length;
  const low = audit.issues.filter(i => i.severity === 'low').length;
  const informational = audit.issues.filter(i => i.severity === 'informational').length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-400" />
            <span>Comprehensive SEO Audit Report</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete assessment of technical foundations, Core Web Vitals, content depth, and indexing directives.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenPrintReport && (
            <button
              onClick={onOpenPrintReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition active:scale-95"
              title="Download Full SEO Audit PDF Report (with charts & findings)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>
          )}

          <button
            onClick={() => exportIssuesToCsv(audit.issues, audit.url)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Score & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Health Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Weighted Overall Health
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Circular Ring SVG */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`stroke-current ${getScoreColor(audit.overallScore)} transition-all duration-1000`}
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * audit.overallScore) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold ${getScoreColor(audit.overallScore)}`}>
                {audit.overallScore}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">out of 100</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 max-w-xs">
            Evaluated {audit.totalChecksEvaluated} automated checks with {audit.coveragePercentage}% testing coverage.
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Issue Severity Distribution
            </h3>
            <p className="text-xs text-slate-400">
              {audit.issues.length} total findings detected across {audit.pages.length} crawled pages.
            </p>
          </div>

          {/* Bar graphs */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Critical ({critical})
                </span>
                <span className="text-slate-400 text-[11px]">Immediate blocker</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${Math.min(100, (critical / (audit.issues.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High ({high})
                </span>
                <span className="text-slate-400 text-[11px]">Significant impact</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${Math.min(100, (high / (audit.issues.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  Medium ({medium})
                </span>
                <span className="text-slate-400 text-[11px]">Optimization opportunity</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min(100, (medium / (audit.issues.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  Low & Informational ({low + informational})
                </span>
                <span className="text-slate-400 text-[11px]">Best practice tweak</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-600 rounded-full" 
                  style={{ width: `${Math.min(100, ((low + informational) / (audit.issues.length || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Manage issue resolutions:</span>
            <button
              onClick={() => onNavigateTab('issues')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Open Issues Table</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8 Category Scores Detailed Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Individual SEO Category Scores & Weights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.categoryScores.map((cat) => (
            <div
              key={cat.key}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                  <span className="text-[11px] text-slate-400">Heuristic Weight: {cat.weight}%</span>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${getScoreColor(cat.score)}`}>
                    {cat.score}
                  </span>
                  <span className="text-slate-500 text-xs">/100</span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreBg(cat.score)}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {cat.summary}
              </p>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{cat.evaluatedChecks} checks evaluated</span>
                <span className="font-medium text-slate-300">
                  {cat.criticalIssues} critical • {cat.highIssues} high
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Transparent Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Scoring Methodology Notice:</strong> The overall score is calculated as a weighted average across 8 transparent technical and content categories (Technical 25%, On-Page 20%, Content 15%, Performance 15%, Crawlability 10%, Structured Data 5%, Mobile 5%, Internal Linking 5%). It represents our automated technical diagnostic health score and is not an official Google ranking score or prediction of specific search rank positions.
        </div>
      </div>
    </div>
  );
};
