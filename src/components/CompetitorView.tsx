import React, { useState } from 'react';
import { CompetitorComparison } from '../types/seo';
import { 
  Users, 
  ExternalLink, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Info 
} from 'lucide-react';

interface CompetitorViewProps {
  competitors: CompetitorComparison[];
  targetUrl: string;
}

export const CompetitorView: React.FC<CompetitorViewProps> = ({
  competitors: initialCompetitors,
  targetUrl,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorComparison[]>(initialCompetitors);
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitorUrl.trim()) return;

    setIsAnalyzing(true);
    let compUrl = newCompetitorUrl.trim();
    if (!compUrl.startsWith('http://') && !compUrl.startsWith('https://')) {
      compUrl = 'https://' + compUrl;
    }

    try {
      // In live app, this calls server to crawl competitor
      const dummyComp: CompetitorComparison = {
        competitorUrl: compUrl,
        status: 'analyzed',
        statusCode: 200,
        title: `${new URL(compUrl).hostname} | Official Portal`,
        metaDescription: 'Competitive market solutions and enterprise client services.',
        h1: 'Next-Generation Industry Solutions',
        wordCount: 1100,
        headingsCount: 16,
        imagesAltRatio: '88% Alt Coverage',
        schemaTypes: ['Organization', 'WebSite'],
        estimatedSpeed: 'LCP 2.4s',
        contentGaps: [
          'Competitor produces comprehensive comparison landing pages.',
          'Competitor includes transparent pricing calculators.',
        ],
        differentiationOpportunities: [
          'Target long-tail implementation pain points.',
          'Offer un-gated technical benchmarks.',
        ],
      };
      setCompetitors((prev) => [...prev, dummyComp]);
      setNewCompetitorUrl('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Competitor Architecture & Content Gap Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side structural comparison of headings, metadata, schema markup, and topical differentiation angles.
          </p>
        </div>

        {/* Add competitor form */}
        <form onSubmit={handleAddCompetitor} className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Add competitor URL..."
            value={newCompetitorUrl}
            onChange={(e) => setNewCompetitorUrl(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-60"
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {competitors.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Competitor URLs Added</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Enter a competitor domain above to crawl their public headings, structured data, and identify differentiation opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map((comp, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-blue-400 truncate max-w-[200px]" title={comp.competitorUrl}>
                    {comp.competitorUrl}
                  </span>
                  <a href={comp.competitorUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Metadata & Stats */}
                <div className="space-y-2.5 pt-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Page Title:</span>
                    <p className="font-semibold text-slate-200 line-clamp-1">{comp.title || 'N/A'}</p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Primary H1:</span>
                    <p className="text-slate-300 italic line-clamp-1">{comp.h1 || 'None'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                      <span className="text-slate-400 block">Body Word Count</span>
                      <strong className="text-white text-xs">{comp.wordCount || 0} words</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                      <span className="text-slate-400 block">Schema Entities</span>
                      <strong className="text-indigo-300 text-xs">{comp.schemaTypes?.length || 0} types</strong>
                    </div>
                  </div>

                  {/* Content Gaps */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                      Competitor Strengths / Gaps:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {comp.contentGaps.map((gap, gIdx) => (
                        <li key={gIdx} className="flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Differentiation Angle */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Our Differentiation Opportunity:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {comp.differentiationOpportunities.map((opp, oIdx) => (
                        <li key={oIdx} className="flex items-start gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
