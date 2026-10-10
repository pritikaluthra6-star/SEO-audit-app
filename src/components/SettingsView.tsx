import React from 'react';
import { Settings, ShieldCheck, Key, Lock, Globe, Server, Info, ExternalLink } from 'lucide-react';
import { AuditResult } from '../types/seo';

interface SettingsViewProps {
  audit: AuditResult | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ audit }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>API Integrations & Crawler Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Server-side secret status, security boundaries, and external provider connections.
        </p>
      </div>

      {/* API Integrations Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gemini API */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Gemini 3.8 Flash SDK</h3>
                <span className="text-[10px] text-slate-400">Server-side Intelligence</span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Configured
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Initialized via server-side <code className="text-indigo-300 font-mono">process.env.GEMINI_API_KEY</code>. Powers executive strategic synthesis, editorial content briefs, search intent classification, and the interactive SEO advisor.
          </p>

          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
            Model: <strong className="text-slate-400">gemini-3.8-flash</strong> • Client telemetry: <strong className="text-slate-400">aistudio-build</strong>
          </div>
        </div>

        {/* PageSpeed Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Google PageSpeed Insights API</h3>
                <span className="text-[10px] text-slate-400">Lighthouse v12 Performance</span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Active
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Measures Core Web Vitals (LCP, CLS, FCP, TBT, Speed Index) under mobile and desktop network throttling profiles via Google's official public API runner.
          </p>

          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
            Endpoint: <code className="text-slate-400">pagespeedonline/v5/runPagespeed</code>
          </div>
        </div>

        {/* Google Search Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Google Search Console</h3>
                <span className="text-[10px] text-slate-400">1st-Party Verified Search Data</span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              OAuth 2.0 Ready
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Enables retrieval of authentic search query impressions, CTR, and landing page performance. In demo mode, verified sample property statistics are visualized.
          </p>
        </div>

        {/* Crawler Safety & SSRF */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Crawler Security & Safety</h3>
                <span className="text-[10px] text-slate-400">SSRF & Concurrency Protection</span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Hardened
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Enforces strict hostname resolution against private IP ranges (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, link-local, cloud metadata services). Applies request timeouts and HTML memory caps.
          </p>
        </div>
      </div>
    </div>
  );
};
