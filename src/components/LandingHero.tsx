import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Server, 
  Zap, 
  CalendarClock, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface LandingHeroProps {
  onQuickStart: (url: string) => void;
  onLoadDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onQuickStart,
  onLoadDemo,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    if (!target) {
      setErrorMsg('Please enter a website URL to audit.');
      return;
    }
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    try {
      new URL(target);
      setErrorMsg('');
      onQuickStart(target);
    } catch {
      setErrorMsg('Please enter a valid website URL (e.g. example.com).');
    }
  };

  return (
    <div className="py-12 md:py-20 px-4 max-w-5xl mx-auto space-y-16">
      {/* Hero Header & URL Input */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Technical SEO & Gemini AI Diagnostics</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Audit Your Website's SEO with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Precision & Evidence</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Uncover critical crawlability blockers, Core Web Vitals bottlenecks, metadata oversights, and content gaps. Transform raw diagnostic data into a clear 90-day prioritized action plan.
        </p>

        {/* Quick URL Input Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl focus-within:border-blue-500 transition">
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Globe className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter website URL (e.g., yoursite.com)"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-1.5 active:scale-95 flex-shrink-0"
            >
              <span>Run Free SEO Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}

          <div className="pt-2 flex items-center justify-center space-x-3 text-xs text-slate-400">
            <span>Want to test without a crawl?</span>
            <button
              type="button"
              onClick={onLoadDemo}
              className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-blue-500/50 underline-offset-4"
            >
              Load Verified Sample Audit &rarr;
            </button>
          </div>
        </form>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Live Crawler & Technical SEO</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Safe multi-page crawling, robots.txt directives, sitemap verification, canonical declarations, and HTTP status diagnostics.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Core Web Vitals & PageSpeed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Official Google PageSpeed Insights measuring LCP, CLS, TBT, Speed Index, and opportunities for mobile and desktop.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <CalendarClock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Gemini 3.8 Strategic Action Plan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI executive synthesis, 7/30/90 day prioritized roadmap, content rewrite briefs, and evidence-grounded SEO chat assistant.
          </p>
        </div>
      </div>
    </div>
  );
};
