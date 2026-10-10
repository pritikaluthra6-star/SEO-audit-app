import React, { useState } from 'react';
import { AuditResult } from '../types/seo';
import { 
  Search, 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  BarChart3, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface SearchConsoleViewProps {
  audit: AuditResult;
}

export const SearchConsoleView: React.FC<SearchConsoleViewProps> = ({ audit }) => {
  const gscData = audit.searchConsoleData;
  const [demoConnected, setDemoConnected] = useState(gscData?.connected || false);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <span>Google Search Console Integration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verified first-party organic search impressions, query click-through rates, and average SERP rankings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {demoConnected ? (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GSC Property Connected</span>
            </span>
          ) : (
            <button
              onClick={() => setDemoConnected(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Connect Search Console (OAuth)</span>
            </button>
          )}
        </div>
      </div>

      {demoConnected && gscData && gscData.queries.length > 0 ? (
        <>
          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Organic Clicks</span>
              <span className="text-3xl font-extrabold text-white">
                {gscData.totalClicks.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Last 28 Days
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Impressions</span>
              <span className="text-3xl font-extrabold text-blue-400">
                {gscData.totalImpressions.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">SERP appearances</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Average CTR</span>
              <span className="text-3xl font-extrabold text-amber-400">
                {gscData.averageCtr}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Click conversion</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Average Position</span>
              <span className="text-3xl font-extrabold text-purple-400">
                {gscData.averagePosition}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Rank on Google SERP</span>
            </div>
          </div>

          {/* Queries Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Top Performing Search Queries
              </h3>
              <span className="text-xs text-slate-400">
                Property: {gscData.propertyUrl || audit.url}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Search Query</th>
                    <th className="py-2.5 px-4">Clicks</th>
                    <th className="py-2.5 px-4">Impressions</th>
                    <th className="py-2.5 px-4">CTR</th>
                    <th className="py-2.5 px-4">Avg Position</th>
                    <th className="py-2.5 px-4">Landing Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {gscData.queries.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-slate-200">
                        {q.query}
                      </td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold whitespace-nowrap">
                        {q.clicks.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 font-mono whitespace-nowrap">
                        {q.impressions.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-amber-400 font-mono whitespace-nowrap">
                        {q.ctr}%
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold whitespace-nowrap text-purple-300">
                        #{q.position}
                      </td>
                      <td className="py-2.5 px-4 max-w-xs truncate font-mono text-[11px] text-slate-400">
                        <a href={q.page} target="_blank" rel="noreferrer" className="hover:text-blue-400 inline-flex items-center gap-1">
                          <span className="truncate">{q.page}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Google Search Console Not Connected</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Connect your verified Google Search Console property to retrieve authoritative organic search impressions, query CTRs, and indexing reports without guessing.
            </p>
          </div>
          <button
            onClick={() => setDemoConnected(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
          >
            Authorize Search Console Account
          </button>
        </div>
      )}
    </div>
  );
};
