import React, { useState } from 'react';
import { AuditResult, BacklinkRecord } from '../types/seo';
import { 
  Link2, 
  Upload, 
  Download, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { uploadBacklinksCsv } from '../services/api';

interface BacklinksViewProps {
  audit: AuditResult;
  onRefreshAudit: (updatedAudit: AuditResult) => void;
}

export const BacklinksView: React.FC<BacklinksViewProps> = ({
  audit,
  onRefreshAudit,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const backlinksData = audit.backlinksData;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(Boolean);
      if (lines.length < 2) {
        throw new Error('CSV file appears empty or missing data rows.');
      }

      // Simple CSV parser for standard backlink exports (Source URL, Target URL, Anchor, Rel)
      const records: BacklinkRecord[] = [];
      const header = lines[0].toLowerCase();
      
      for (let i = 1; i < lines.length && i < 200; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2) {
          const source = parts[0];
          const target = parts[1] || audit.url;
          const anchor = parts[2] || 'Brand / Naked URL';
          const rel = parts[3]?.toLowerCase().includes('nofollow') ? 'nofollow' : 'dofollow';
          
          let domain = 'unknown';
          try {
            domain = new URL(source.startsWith('http') ? source : `https://${source}`).hostname;
          } catch {}

          records.push({
            id: `bl-${i}`,
            sourceUrl: source,
            targetUrl: target,
            anchorText: anchor,
            relType: rel as any,
            referringDomain: domain,
            detectedDate: new Date().toISOString().split('T')[0],
          });
        }
      }

      const res = await uploadBacklinksCsv(audit.id, records, file.name);
      if (res && res.backlinksData) {
        onRefreshAudit({
          ...audit,
          backlinksData: res.backlinksData,
        });
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process CSV file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            <span>Backlink & Off-Page Profile Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze referring domains, dofollow/nofollow distributions, and anchor text concentration from verified datasets.
          </p>
        </div>

        {/* CSV Upload Button */}
        <div>
          <label className="cursor-pointer inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Parsing CSV...' : 'Import Backlinks CSV'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {uploadError}
        </div>
      )}

      {/* Strict Ethical Limitations Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Data Limitations & Anti-Hallucination Policy:</strong> AuditPulse never invents artificial Domain Authority scores, fake backlink counts, or toxic link penalties. Off-page insights are generated exclusively from your imported CSV exports (Ahrefs, Semrush, Moz, GSC) or authorized Google Search Console link data.
        </div>
      </div>

      {backlinksData && backlinksData.totalBacklinks > 0 ? (
        <>
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Backlinks</span>
              <span className="text-3xl font-extrabold text-white">{backlinksData.totalBacklinks}</span>
              <span className="text-[10px] text-slate-500 block mt-1">In active dataset</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Referring Domains</span>
              <span className="text-3xl font-extrabold text-blue-400">{backlinksData.referringDomains}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Unique root hosts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Dofollow Links</span>
              <span className="text-3xl font-extrabold text-emerald-400">{backlinksData.dofollowCount}</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {Math.round((backlinksData.dofollowCount / backlinksData.totalBacklinks) * 100)}% of total
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Nofollow / UGC</span>
              <span className="text-3xl font-extrabold text-amber-400">{backlinksData.nofollowCount}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Filtered signals</span>
            </div>
          </div>

          {/* Top Anchor Texts & Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anchors distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Top Anchor Text Distribution
              </h3>

              <div className="space-y-2">
                {backlinksData.topAnchors.map((anc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate max-w-[200px]" title={anc.text}>
                      "{anc.text}"
                    </span>
                    <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[11px]">
                      {anc.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Backlink Records Table */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Imported Backlink Records
                </h3>
                <span className="text-xs text-slate-400">
                  Source: {backlinksData.source}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4">Source Page</th>
                      <th className="py-2.5 px-4">Anchor Text</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Target URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {backlinksData.records.slice(0, 20).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 max-w-xs truncate font-mono text-[11px] text-slate-300">
                          <span title={r.sourceUrl}>{r.sourceUrl}</span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-200 font-medium">
                          {r.anchorText}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.relType === 'dofollow'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {r.relType}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 max-w-xs truncate font-mono text-[11px] text-slate-400">
                          {r.targetUrl}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <Link2 className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Backlinks Data Imported</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Upload a CSV export from your backlink monitoring tool (Ahrefs, Semrush, Moz, or Google Search Console) to evaluate anchor text distributions and referring domains.
            </p>
          </div>
          <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition">
            <Upload className="w-4 h-4" />
            <span>Upload Backlinks CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};
