import React, { useState } from 'react';
import { AuditResult, CrawledPage } from '../types/seo';
import { 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Image as ImageIcon, 
  Type, 
  Sparkles, 
  ExternalLink,
  Share2,
  ListTree,
  ChevronRight
} from 'lucide-react';

interface OnPageSeoViewProps {
  audit: AuditResult;
}

export const OnPageSeoView: React.FC<OnPageSeoViewProps> = ({ audit }) => {
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const activePage: CrawledPage | undefined = audit.pages[selectedPageIndex] || audit.pages[0];

  if (!activePage) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-slate-400">No page data available to inspect.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            <span>On-Page SEO Analyzer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Page-by-page verification of title tags, meta descriptions, heading semantics, image alt coverage, and Open Graph metadata.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            {audit.categoryScores.find(c => c.key === 'on_page')?.score || 0}/100 On-Page Score
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
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span>Page {idx + 1}:</span>
            <span className="font-mono text-[11px] max-w-[180px] truncate">
              {p.url.replace(/https?:\/\/[^/]+/, '') || '/'}
            </span>
            {p.issuesCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedPageIndex === idx ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {p.issuesCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Page Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Description, SERP Snippet Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* SERP Snippet Simulator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Google SERP Snippet Preview
              </h3>
              <span className="text-[10px] text-slate-400">Desktop Simulation</span>
            </div>

            {/* Google Search Result Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <span>{activePage.url}</span>
              </div>
              <div className="text-base font-medium text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {activePage.title || 'Untitled Document (Missing Title Tag)'}
              </div>
              <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {activePage.metaDescription || 'No meta description provided. Search engines will extract arbitrary text snippet from body copy.'}
              </div>
            </div>
          </div>

          {/* Title Tag Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  HTML Title Tag
                </h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activePage.titleLength >= 40 && activePage.titleLength <= 60
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {activePage.titleLength} / 60 Chars
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono">
              {activePage.title || <span className="text-rose-400 italic">Missing title tag</span>}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              {activePage.titleLength >= 40 && activePage.titleLength <= 60 ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Optimal title length (40–60 characters).
                </span>
              ) : activePage.titleLength > 60 ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Exceeds 60 characters; risk of SERP ellipsis cutoff.
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Shorter than 40 characters; underutilized keyword real estate.
                </span>
              )}
            </div>
          </div>

          {/* Meta Description Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Meta Description
                </h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activePage.metaDescriptionLength >= 120 && activePage.metaDescriptionLength <= 160
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : activePage.metaDescriptionLength === 0
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {activePage.metaDescriptionLength} / 160 Chars
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono">
              {activePage.metaDescription || (
                <span className="text-rose-400 italic">No meta description found in HTML head.</span>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              {activePage.metaDescriptionLength === 0 ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Urgent: Search engines will create automated text snippets.
                </span>
              ) : activePage.metaDescriptionLength >= 120 && activePage.metaDescriptionLength <= 160 ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Optimal length for mobile and desktop display.
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Recommended target is 120–160 characters.
                </span>
              )}
            </div>
          </div>

          {/* Heading Structure (H1, H2) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListTree className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Headings Hierarchy
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {activePage.h1.length} H1 Tag(s) • {activePage.h2Count} H2 Tag(s)
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400">Discovered H1 Headings:</div>
              {activePage.h1.length === 0 ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  Missing primary H1 tag. Add one main &lt;h1&gt; describing the core topic.
                </div>
              ) : (
                activePage.h1.map((h, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                    &lt;h1&gt; {h} &lt;/h1&gt;
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Checklist & Attributes */}
        <div className="space-y-6">
          {/* Content & Image Signals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              On-Page Quality Signals
            </h3>

            <div className="space-y-3 text-xs">
              {/* Word Count */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">Word Count</div>
                  <div className="text-[11px] text-slate-400">Body text volume</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white text-sm">{activePage.wordCount}</span>
                  <span className="text-[10px] text-slate-400 block">words</span>
                </div>
              </div>

              {/* Image Alt Coverage */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">Image Alt Coverage</div>
                  <div className="text-[11px] text-slate-400">{activePage.imagesTotal} total images</div>
                </div>
                <div className="text-right">
                  {activePage.imagesMissingAlt === 0 ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Valid
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400">
                      {activePage.imagesMissingAlt} Missing
                    </span>
                  )}
                </div>
              </div>

              {/* Internal / External Links */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">Hyperlink Density</div>
                  <div className="text-[11px] text-slate-400">Anchor connections</div>
                </div>
                <div className="text-right text-xs">
                  <span className="text-blue-400 font-semibold">{activePage.internalLinksCount} Internal</span>
                  <span className="text-slate-500 mx-1">•</span>
                  <span className="text-slate-400">{activePage.externalLinksCount} Ext</span>
                </div>
              </div>

              {/* Open Graph & Social Cards */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">Social Graph Tags</div>
                  <div className="text-[11px] text-slate-400">og:title, og:image, twitter</div>
                </div>
                <div className="text-right">
                  {activePage.hasOpenGraph ? (
                    <span className="text-xs font-semibold text-emerald-400">Configured</span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400">Missing</span>
                  )}
                </div>
              </div>

              {/* Structured Schema Types */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-slate-200">Detected Schema Types:</div>
                {activePage.structuredDataTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activePage.structuredDataTypes.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-400">
                    No JSON-LD structured data detected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
