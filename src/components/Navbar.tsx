import React from 'react';
import { 
  Activity, 
  Sparkles, 
  FileText, 
  PlusCircle, 
  Download, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AuditResult } from '../types/seo';

interface NavbarProps {
  currentAudit: AuditResult | null;
  onOpenNewAudit: () => void;
  onLoadDemo: () => void;
  onOpenAiAssistant: () => void;
  onOpenPrintReport: () => void;
  onExportCsv: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAudit,
  onOpenNewAudit,
  onLoadDemo,
  onOpenAiAssistant,
  onOpenPrintReport,
  onExportCsv,
}) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Active Audit Info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-100 tracking-tight text-lg">AuditPulse</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI Engine
              </span>
            </div>
          </div>
        </div>

        {currentAudit && (
          <div className="hidden md:flex items-center pl-4 border-l border-slate-800 space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 max-w-sm truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <a 
                href={currentAudit.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-medium text-slate-200 hover:text-blue-400 flex items-center gap-1 truncate"
                title={currentAudit.url}
              >
                {currentAudit.url}
                <ExternalLink className="w-3 h-3 inline text-slate-400 flex-shrink-0" />
              </a>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs">
              <span className="text-slate-400">Score:</span>
              <span className={`font-bold ${
                currentAudit.overallScore >= 80 ? 'text-emerald-400' :
                currentAudit.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {currentAudit.overallScore}/100
              </span>
            </div>

            {currentAudit.id.includes('demo') && (
              <span className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-medium">
                Demo Sample Data
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {!currentAudit && (
          <button
            onClick={onLoadDemo}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Load Demo Audit</span>
          </button>
        )}

        {currentAudit && (
          <>
            <button
              onClick={onExportCsv}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Export Issues & Findings to CSV"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenPrintReport}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Download Full SEO Audit PDF Report (with charts & findings)"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Download PDF</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenAiAssistant}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition shadow-sm"
          title="Open AI SEO Strategist Drawer"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Ask AI</span>
        </button>

        <button
          onClick={onOpenNewAudit}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Audit</span>
        </button>
      </div>
    </header>
  );
};
