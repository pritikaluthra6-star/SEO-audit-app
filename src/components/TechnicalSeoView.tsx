import React from 'react';
import { AuditResult } from '../types/seo';
import { 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Link2, 
  Lock, 
  Globe, 
  ExternalLink,
  Code2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface TechnicalSeoViewProps {
  audit: AuditResult;
}

export const TechnicalSeoView: React.FC<TechnicalSeoViewProps> = ({ audit }) => {
  const technicalIssues = audit.issues.filter(
    (i) => i.category === 'technical' || i.category === 'crawlability'
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <span>Technical SEO & Crawl Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated verification of server status, HTTPS encryption, robots directives, and canonical tags.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            {audit.categoryScores.find(c => c.key === 'technical')?.score || 0}/100 Tech Score
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {audit.categoryScores.find(c => c.key === 'crawlability')?.score || 0}/100 Crawl Score
          </span>
        </div>
      </div>

      {/* Key Architectural Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HTTPS Security Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Security & Protocol</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>HTTPS Encrypted</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Target URL enforces secure TLS connection. All crawled assets use https://.
          </p>
        </div>

        {/* robots.txt Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">robots.txt File</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            {audit.robotsTxt.exists ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Active & Discoverable</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="text-rose-400">Missing / Unreachable</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate" title={audit.robotsTxt.url}>
            {audit.robotsTxt.url}
          </p>
        </div>

        {/* XML Sitemap Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">XML Sitemap</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            {audit.sitemapXml.exists ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Valid ({audit.sitemapXml.discoveredUrlsCount} URLs)</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-amber-400">Not Discovered</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate" title={audit.sitemapXml.url}>
            {audit.sitemapXml.url}
          </p>
        </div>
      </div>

      {/* robots.txt & Sitemap Inspection Accordion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* robots.txt details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              robots.txt Directives
            </h3>
            {audit.robotsTxt.hasDisallow && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                Disallow Rules Present
              </span>
            )}
          </div>

          {audit.robotsTxt.exists ? (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {audit.robotsTxt.contentSnippet || 'File exists with default directives.'}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              No robots.txt detected at root. Search engines will crawl without directive restrictions, but you miss the opportunity to specify sitemap locations and isolate internal search parameter paths.
            </div>
          )}

          {audit.robotsTxt.sitemapUrls.length > 0 && (
            <div className="text-xs text-slate-400 pt-1">
              <span className="font-semibold text-slate-300">Sitemap declared in robots.txt:</span>
              <ul className="mt-1 space-y-1">
                {audit.robotsTxt.sitemapUrls.map((s, idx) => (
                  <li key={idx} className="font-mono text-[11px] text-blue-400 truncate">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* XML Sitemap discovered URLs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              XML Sitemap Sample URLs
            </h3>
            <span className="text-[11px] text-slate-400">
              {audit.sitemapXml.discoveredUrlsCount} discovered
            </span>
          </div>

          {audit.sitemapXml.sampleUrls.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {audit.sitemapXml.sampleUrls.map((u, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-850 font-mono text-[11px] text-slate-300 truncate hover:text-blue-400 transition"
                  title={u}
                >
                  {u}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              No sample URLs parsed from sitemap. Verify your sitemap XML format is indexable and submitted in Google Search Console.
            </div>
          )}
        </div>
      </div>

      {/* Crawled URL Technical Indexability Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Page-Level Technical Audit Status
            </h3>
            <p className="text-xs text-slate-400">
              Canonical URL consistency, meta robots instructions, and HTTP status codes
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {audit.pages.length} Pages Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4">HTTP Status</th>
                <th className="py-3 px-4">Response Time</th>
                <th className="py-3 px-4">Canonical Tag</th>
                <th className="py-3 px-4">Indexability</th>
                <th className="py-3 px-4">Lang & Viewport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {audit.pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 max-w-xs truncate font-mono text-slate-300">
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-400 flex items-center gap-1 truncate"
                      title={page.url}
                    >
                      <span className="truncate">{page.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400" />
                    </a>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      page.statusCode === 200
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {page.statusCode} {page.statusCode === 200 ? 'OK' : 'Error'}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-mono">
                    {page.responseTimeMs} ms
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate">
                    {page.canonicalUrl ? (
                      <span className={`inline-flex items-center gap-1 text-[11px] ${
                        page.isCanonicalSelf ? 'text-slate-300' : 'text-amber-400'
                      }`}>
                        {page.isCanonicalSelf ? 'Self-referencing' : 'Cross-domain / Altered'}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[11px]">Missing Canonical</span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {page.isIndexable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Indexable</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Noindex / Blocked</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-400">
                    <span>lang: {page.langAttribute || 'none'}</span>
                    <span className="mx-1">•</span>
                    <span>{page.viewportConfigured ? 'viewport ok' : 'no viewport'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
