import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AuditConfig } from '../types/seo';

interface AuditSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: AuditConfig) => Promise<void>;
  isSubmitting: boolean;
  statusMessage?: string;
  errorMessage?: string;
}

export const AuditSetupModal: React.FC<AuditSetupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  statusMessage,
  errorMessage,
}) => {
  const [url, setUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [targetCountry, setTargetCountry] = useState('United States (US)');
  const [targetLanguage, setTargetLanguage] = useState('English (en)');
  const [industry, setIndustry] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [competitorsText, setCompetitorsText] = useState('');
  const [auditDepth, setAuditDepth] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [enablePageSpeed, setEnablePageSpeed] = useState(true);
  const [urlError, setUrlError] = useState('');

  if (!isOpen) return null;

  const validateUrl = (input: string) => {
    let test = input.trim();
    if (!test) return 'URL cannot be empty.';
    if (!test.startsWith('http://') && !test.startsWith('https://')) {
      test = 'https://' + test;
    }
    try {
      const parsed = new URL(test);
      if (
        parsed.hostname === 'localhost' ||
        parsed.hostname.startsWith('127.') ||
        parsed.hostname.startsWith('192.168.') ||
        parsed.hostname.startsWith('10.')
      ) {
        return 'Internal and private IP destinations are blocked for SSRF security.';
      }
      return '';
    } catch {
      return 'Please enter a valid website URL (e.g., example.com).';
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUrl(url);
    if (err) {
      setUrlError(err);
      return;
    }
    setUrlError('');

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const competitors = competitorsText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const config: AuditConfig = {
      url: finalUrl,
      businessName: businessName.trim() || undefined,
      targetCountry,
      targetLanguage,
      industry: industry.trim() || undefined,
      targetKeywords: keywords,
      competitorUrls: competitors,
      auditDepth,
      maxPages: auditDepth === 'quick' ? 1 : auditDepth === 'deep' ? 12 : 5,
      device,
      enablePageSpeed,
    };

    await onSubmit(config);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Configure New SEO Audit</h2>
              <p className="text-xs text-slate-400">
                Live URL validation, multi-page crawl, and AI strategic diagnosis
              </p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isSubmitting ? (
          /* Live Progress State */
          <div className="p-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Executing Deep SEO Audit...</h3>
              <p className="text-sm text-blue-400 font-medium animate-pulse">
                {statusMessage || 'Crawling accessible pages and evaluating technical rules...'}
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Extracting HTML metadata, validating canonicals, inspecting robots.txt/sitemap, measuring PageSpeed, and querying Gemini for strategic recommendations.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-left text-xs space-y-2 max-w-md mx-auto text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SSRF security checks verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Crawler dispatching with safe depth limits</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span>PageSpeed & Gemini 3.8 Flash synthesis</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStart} className="p-6 space-y-5 text-sm">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="text-white block mb-0.5">Audit Execution Notice</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Primary URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Target Website URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  className={`w-full bg-slate-950 border px-3.5 py-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition ${
                    urlError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
              {urlError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{urlError}</span>
                </p>
              )}
            </div>

            {/* Business Name & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Business / Brand Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Industry / Niche
                </label>
                <input
                  type="text"
                  placeholder="e.g. B2B SaaS, E-Commerce"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Country & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Country
                </label>
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="United States (US)">United States (US)</option>
                  <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                  <option value="Canada (CA)">Canada (CA)</option>
                  <option value="Australia (AU)">Australia (AU)</option>
                  <option value="Germany (DE)">Germany (DE)</option>
                  <option value="France (FR)">France (FR)</option>
                  <option value="India (IN)">India (IN)</option>
                  <option value="Global">Global / International</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Preferred Language
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="English (en)">English (en)</option>
                  <option value="Spanish (es)">Spanish (es)</option>
                  <option value="German (de)">German (de)</option>
                  <option value="French (fr)">French (fr)</option>
                  <option value="Japanese (ja)">Japanese (ja)</option>
                </select>
              </div>
            </div>

            {/* Audit Depth & Device Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Audit Crawl Depth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'quick', label: 'Quick', desc: '1 page' },
                    { id: 'standard', label: 'Standard', desc: '5 pages' },
                    { id: 'deep', label: 'Deep', desc: '12 pages' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setAuditDepth(d.id as any)}
                      className={`p-2 rounded-xl text-center border transition ${
                        auditDepth === d.id
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{d.label}</div>
                      <div className="text-[10px] opacity-75">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Performance Device Target
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDevice('mobile')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border transition ${
                      device === 'mobile'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="text-xs">Mobile (Default)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDevice('desktop')}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border transition ${
                      device === 'desktop'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="text-xs">Desktop</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Keywords (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. b2b marketing agency, lead generation software"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Competitor URLs */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Competitor URLs (Up to 3, one per line)
              </label>
              <textarea
                rows={2}
                placeholder="https://competitor-one.com&#10;https://competitor-two.com"
                value={competitorsText}
                onChange={(e) => setCompetitorsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none font-mono text-xs"
              />
            </div>

            {/* PageSpeed Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Include Core Web Vitals (PageSpeed Insights)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Tests LCP, CLS, TBT, Speed Index & opportunities
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enablePageSpeed}
                onChange={(e) => setEnablePageSpeed(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center text-[11px] text-slate-400 gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Evidence-based scoring. No fabricated data.</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Live Audit</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
