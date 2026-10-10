import React, { useState } from 'react';
import { KeywordIdea } from '../types/seo';
import { 
  KeyRound, 
  Search, 
  Download, 
  Info, 
  ArrowRight, 
  Tag, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { exportKeywordsToCsv } from '../utils/exportUtils';

interface KeywordModuleViewProps {
  keywords: KeywordIdea[];
  targetUrl: string;
}

export const KeywordModuleView: React.FC<KeywordModuleViewProps> = ({
  keywords,
  targetUrl,
}) => {
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKeywords = keywords.filter((k) => {
    if (selectedIntent !== 'all' && k.intent !== selectedIntent) return false;
    if (searchQuery.trim() && !k.keyword.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getIntentBadge = (intent: KeywordIdea['intent']) => {
    switch (intent) {
      case 'Informational':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Informational</span>;
      case 'Commercial':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Commercial</span>;
      case 'Transactional':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Transactional</span>;
      case 'Navigational':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">Navigational</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>Keyword Intelligence & Search Intent Mapping</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Topic clusters, user intent categorization, and target page alignment.
          </p>
        </div>

        <button
          onClick={() => exportKeywordsToCsv(filteredKeywords, targetUrl)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Keywords ({filteredKeywords.length})</span>
        </button>
      </div>

      {/* Strict Ethical Metrics Notice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Data Integrity Notice:</strong> Search volume, Keyword Difficulty (KD%), and CPC values are strictly not estimated or fabricated. They require connecting an external licensed data provider (Semrush, Ahrefs, Moz). The clusters below represent qualitative AI search intent modeling.
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter keywords by phrase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['all', 'Informational', 'Commercial', 'Transactional', 'Navigational'].map((intent) => (
            <button
              key={intent}
              onClick={() => setSelectedIntent(intent)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedIntent === intent
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {intent === 'all' ? 'All Intents' : intent}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Keyword Phrase</th>
                <th className="py-3 px-4">Search Intent</th>
                <th className="py-3 px-4">Target Landing Page</th>
                <th className="py-3 px-4">Recommended Content Type</th>
                <th className="py-3 px-4">Priority & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No keywords found for current filter.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-200 text-sm">
                      {k.keyword}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getIntentBadge(k.intent)}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-400 font-mono text-[11px]">
                      <a href={k.targetUrl} target="_blank" rel="noreferrer" className="hover:text-blue-400 inline-flex items-center gap-1">
                        <span className="truncate">{k.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {k.suggestedContentType}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-300 leading-snug">
                        <span className={`font-bold capitalize mr-1.5 ${
                          k.priority === 'high' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          [{k.priority}]:
                        </span>
                        {k.rationale}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
