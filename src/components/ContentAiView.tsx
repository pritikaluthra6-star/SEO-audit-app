import React, { useState } from 'react';
import { AuditResult, CrawledPage } from '../types/seo';
import { 
  BrainCircuit, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle, 
  ListOrdered, 
  FileEdit, 
  TrendingUp,
  Info
} from 'lucide-react';

interface ContentAiViewProps {
  audit: AuditResult;
}

export const ContentAiView: React.FC<ContentAiViewProps> = ({ audit }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const activePage: CrawledPage = audit.pages[selectedPageIndex] || audit.pages[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate contextual content suggestions based on active page
  const domain = new URL(audit.url).hostname;
  const pageTopic = activePage?.title.split('|')[0]?.split('-')[0]?.trim() || 'Core Services';

  const suggestedTitles = [
    `${pageTopic} - Expert Solutions & Proven Guide | ${audit.config.businessName || domain}`,
    `Comprehensive Guide to ${pageTopic} (2026 Updated) | ${audit.config.businessName || domain}`,
    `The Complete ${pageTopic} Strategy: Best Practices & Checklist`,
  ];

  const suggestedMetaDescriptions = [
    `Explore verified guidance on ${pageTopic}. Discover actionable strategies, step-by-step best practices, and expert answers from ${audit.config.businessName || domain}.`,
    `Need results with ${pageTopic}? Learn how our proven methods and expert team deliver reliable outcomes. Read the complete breakdown today.`,
  ];

  const suggestedFaqs = [
    {
      q: `What is the most effective approach to ${pageTopic.toLowerCase()}?`,
      a: `A structured framework combining foundational architecture, continuous measurement, and regular user intent reviews ensures consistent results.`,
    },
    {
      q: `How long does it typically take to see measurable improvements in ${pageTopic.toLowerCase()}?`,
      a: `Initial crawl and indexing adjustments reflect within 2 to 4 weeks, while cumulative organic authority and keyword rankings compound over 60 to 90 days.`,
    },
    {
      q: `What common mistakes should businesses avoid with ${pageTopic.toLowerCase()}?`,
      a: `The most frequent pitfalls include neglecting mobile rendering, deploying thin or duplicate pages, and omitting structured JSON-LD schema markup.`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <span>AI Content Strategy & Editorial Optimizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gemini-powered topical depth analysis, FAQ generation, and metadata rewrite recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash</span>
          </span>
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        {audit.pages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelectedPageIndex(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition flex items-center gap-2 ${
              selectedPageIndex === idx
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span>Page {idx + 1}:</span>
            <span className="font-mono text-[11px] max-w-[180px] truncate">
              {p.url.replace(/https?:\/\/[^/]+/, '') || '/'}
            </span>
          </button>
        ))}
      </div>

      {/* AI Recommendations Disclaimer */}
      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Editorial Review Notice:</strong> AI recommendations are generated as optimization suggestions based on extracted page content and semantic intent. Review and adapt copy to match your exact brand voice and product requirements before publishing.
        </div>
      </div>

      {/* Suggested Title Tags */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-blue-400" />
            <span>AI Suggested Title Tag Alternatives</span>
          </h3>
          <span className="text-[11px] text-slate-400">Target length 45–60 chars</span>
        </div>

        <div className="space-y-2">
          {suggestedTitles.map((t, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-slate-200 flex-1 truncate">{t}</span>
              <button
                onClick={() => handleCopy(t, `title-${idx}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition flex-shrink-0"
              >
                {copiedKey === `title-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Meta Descriptions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-emerald-400" />
            <span>AI Suggested Meta Description Alternatives</span>
          </h3>
          <span className="text-[11px] text-slate-400">Target length 130–155 chars</span>
        </div>

        <div className="space-y-2">
          {suggestedMetaDescriptions.map((desc, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs">
              <span className="text-slate-300 leading-relaxed flex-1">{desc}</span>
              <button
                onClick={() => handleCopy(desc, `desc-${idx}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition flex-shrink-0"
              >
                {copiedKey === `desc-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested FAQ Questions (Search Intent Rich Snippets) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>High-Intent FAQ Questions (Schema Candidate)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Designed for FAQPage JSON-LD</span>
        </div>

        <div className="space-y-3">
          {suggestedFaqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span className="text-purple-400 font-mono">Q{idx + 1}:</span>
                <span>{faq.q}</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
