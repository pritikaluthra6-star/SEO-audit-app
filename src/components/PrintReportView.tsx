import React, { useState } from 'react';
import { AuditResult } from '../types/seo';
import { 
  Printer, 
  X, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Activity,
  Zap,
  Globe,
  Loader2,
  FileText
} from 'lucide-react';
import { exportReportToPdf } from '../utils/pdfExport';

interface PrintReportViewProps {
  audit: AuditResult;
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ audit, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState('');
  const [pdfError, setPdfError] = useState('');

  const criticalCount = audit.issues.filter(i => i.severity === 'critical').length;
  const highCount = audit.issues.filter(i => i.severity === 'high').length;
  const mediumCount = audit.issues.filter(i => i.severity === 'medium').length;
  const lowCount = audit.issues.filter(i => i.severity === 'low').length;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfError('');
    try {
      const sanitizedDomain = audit.url
        .replace(/https?:\/\//, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/^_+|_+$/g, '');
      const filename = `auditpulse_report_${sanitizedDomain}_${new Date().toISOString().split('T')[0]}.pdf`;

      await exportReportToPdf('seo-audit-report-pdf-target', {
        filename,
        onProgress: (status) => setPdfProgressText(status),
      });
    } catch (err: any) {
      setPdfError(err.message || 'Failed to generate PDF. Please try again or use the Print View.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgressText('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 md:p-8 flex flex-col items-center select-none">
      {/* Top Floating Control Bar (Hidden when printing) */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 pb-6 print:hidden">
        <button
          onClick={onClose}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <X className="w-4 h-4" />
          <span>Close Preview</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            title="Use browser print dialog"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 active:scale-95"
            title="Generate high-resolution PDF with jsPDF and html2canvas"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{pdfProgressText || 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="w-full max-w-4xl mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{pdfError}</span>
          </div>
          <button
            onClick={() => setPdfError('')}
            className="text-xs text-rose-400 hover:text-rose-200 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* The Printable / PDF Target Container */}
      <div 
        id="seo-audit-report-pdf-target"
        className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8 print:p-0 print:shadow-none print:rounded-none"
      >
        {/* Document Header & Branding */}
        <div className="border-b-2 border-slate-200 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                AP
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">AuditPulse AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                Official SEO Audit Report
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Website Health & Technical SEO Performance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Target Property: <strong className="text-slate-800 font-mono text-xs">{audit.url}</strong>
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <div><strong>Audit Date:</strong> {new Date(audit.completedAt).toLocaleDateString()}</div>
            <div><strong>Audit ID:</strong> <span className="font-mono text-[11px]">{audit.id}</span></div>
            <div><strong>Pages Crawled:</strong> {audit.pages.length}</div>
            <div><strong>Coverage:</strong> {audit.coveragePercentage}%</div>
          </div>
        </div>

        {/* Executive Score & Severity Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Radial-Style Score Gauge Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Overall SEO Score
            </span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`stroke-current ${getScoreColor(audit.overallScore)}`}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * audit.overallScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${getScoreColor(audit.overallScore)}`}>
                  {audit.overallScore}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">out of 100</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Evaluated across 8 weighted technical categories
            </p>
          </div>

          {/* Issue Severity Breakdown Chart */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Issue Severity Breakdown
              </span>
              <span className="text-xs font-bold text-slate-700">
                {audit.issues.length} Total Findings
              </span>
            </div>

            {/* Visual stacked bars */}
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Critical Blockers ({criticalCount})
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {audit.issues.length > 0 ? Math.round((criticalCount / audit.issues.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${Math.min(100, (criticalCount / (audit.issues.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Priority ({highCount})
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {audit.issues.length > 0 ? Math.round((highCount / audit.issues.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${Math.min(100, (highCount / (audit.issues.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-600 font-bold">
                    Medium ({mediumCount})
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {audit.issues.length > 0 ? Math.round((mediumCount / audit.issues.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${Math.min(100, (mediumCount / (audit.issues.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-bold">
                    Low & Informational ({lowCount})
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {audit.issues.length > 0 ? Math.round((lowCount / audit.issues.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400 rounded-full" 
                    style={{ width: `${Math.min(100, (lowCount / (audit.issues.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Web Vitals Lab Findings (if available) */}
        {audit.coreWebVitals && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Core Web Vitals & Performance (Google PageSpeed Insights)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">LCP</span>
                <span className="text-xl font-black text-slate-900">{audit.coreWebVitals.lcp.value}s</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Largest Contentful</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">CLS</span>
                <span className="text-xl font-black text-slate-900">{audit.coreWebVitals.cls.value}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Layout Shift</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">FCP</span>
                <span className="text-xl font-black text-slate-900">{audit.coreWebVitals.fcp.value}s</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">First Paint</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">TBT</span>
                <span className="text-xl font-black text-slate-900">{audit.coreWebVitals.tbt.value}ms</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Blocking Time</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Speed Index</span>
                <span className="text-xl font-black text-slate-900">{audit.coreWebVitals.speedIndex.value}s</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Visual Index</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Strategic Assessment Box */}
        {audit.aiExecutiveSummary && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Gemini AI Strategic Assessment
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {audit.aiExecutiveSummary.overview}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                <strong className="text-rose-900 block mb-1">Critical Identified Risk:</strong>
                <span className="text-rose-800">{audit.aiExecutiveSummary.keyRisk}</span>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <strong className="text-emerald-900 block mb-1">High-Impact Quick Win:</strong>
                <span className="text-emerald-800">{audit.aiExecutiveSummary.quickWin}</span>
              </div>
            </div>
          </div>
        )}

        {/* 8 SEO Pillar Scores Table with Progress Bars */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            SEO Pillar Breakdown & Heuristic Weights
          </h2>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Visual Score</th>
                <th className="p-3">Score</th>
                <th className="p-3">Critical / High</th>
                <th className="p-3">Diagnostic Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {audit.categoryScores.map((cat) => (
                <tr key={cat.key}>
                  <td className="p-3 font-semibold text-slate-900">{cat.name}</td>
                  <td className="p-3 text-slate-600 font-mono">{cat.weight}%</td>
                  <td className="p-3 w-36">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getScoreBg(cat.score)}`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{cat.score}/100</td>
                  <td className="p-3 font-medium text-slate-800">
                    {cat.criticalIssues + cat.highIssues} issues
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">{cat.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Priority Findings & Actionable Remediation */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Priority Action Items (Urgent & High Severity Findings)
          </h2>
          <div className="space-y-3">
            {audit.issues
              .filter((i) => i.severity === 'critical' || i.severity === 'high')
              .slice(0, 8)
              .map((issue) => (
                <div key={issue.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      [{issue.severity.toUpperCase()}] {issue.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{issue.id}</span>
                  </div>
                  <div className="text-slate-600 font-mono text-[11px] truncate">
                    URL: {issue.pageUrl}
                  </div>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Observed Evidence:</strong> {issue.evidence}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Recommended Fix:</strong> {issue.recommendation}
                  </p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    Verification Method: {issue.verificationMethod}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Action Plan Roadmap Highlights */}
        {audit.actionPlan && audit.actionPlan.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recommended 90-Day Roadmap Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {(['days_1_7', 'days_8_30', 'days_31_60', 'days_61_90'] as const).map((tf) => {
                const tfTasks = audit.actionPlan.filter(t => t.timeframe === tf);
                const title = tf === 'days_1_7' ? 'Sprint 1 (Days 1–7)' : tf === 'days_8_30' ? 'Sprint 2 (Days 8–30)' : tf === 'days_31_60' ? 'Sprint 3 (Days 31–60)' : 'Sprint 4 (Days 61–90)';
                return (
                  <div key={tf} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">{title}</span>
                    <span className="text-slate-500 text-[11px]">{tfTasks.length} planned items</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Data Limitations Disclaimer Footer */}
        <div className="border-t-2 border-slate-200 pt-6 text-[11px] text-slate-500 space-y-1">
          <p>
            <strong>AuditPulse Methodology Notice:</strong> Scores reflect heuristic technical and content evaluations. They do not represent official Google algorithmic ranking scores.
          </p>
          <p>
            Crawler Engine: {audit.dataSources.crawler} | AI Analysis: {audit.dataSources.ai} | Core Web Vitals: {audit.dataSources.pagespeed}
          </p>
        </div>
      </div>
    </div>
  );
};
