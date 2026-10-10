import React, { useState } from 'react';
import { 
  SeoIssue, 
  Severity, 
  IssueStatus, 
  CategoryKey 
} from '../types/seo';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { exportIssuesToCsv } from '../utils/exportUtils';

interface IssuesTableViewProps {
  issues: SeoIssue[];
  targetUrl: string;
  onUpdateStatus: (issueId: string, status: IssueStatus) => Promise<void>;
}

export const IssuesTableView: React.FC<IssuesTableViewProps> = ({
  issues,
  targetUrl,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'technical', label: 'Technical SEO' },
    { id: 'on_page', label: 'On-Page SEO' },
    { id: 'content', label: 'Content Quality' },
    { id: 'performance', label: 'Performance' },
    { id: 'crawlability', label: 'Crawlability' },
    { id: 'structured_data', label: 'Structured Data' },
    { id: 'mobile', label: 'Mobile & Accessibility' },
    { id: 'internal_linking', label: 'Internal Linking' },
  ];

  const severities: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Severities' },
    { id: 'critical', label: 'Critical' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
    { id: 'informational', label: 'Informational' },
  ];

  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.pageUrl.toLowerCase().includes(q) ||
        issue.evidence.toLowerCase().includes(q) ||
        issue.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/30">
            Low
          </span>
        );
      case 'informational':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'open':
        return <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Open</span>;
      case 'in_progress':
        return <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">In Progress</span>;
      case 'fixed':
        return <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Fixed</span>;
      case 'ignored':
        return <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Ignored</span>;
      case 'needs_review':
        return <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">Review</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters & Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by issue title, affected URL, or finding ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Export button */}
          <button
            onClick={() => exportIssuesToCsv(filteredIssues, targetUrl)}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ({filteredIssues.length})</span>
          </button>
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {severities.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Resolution Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="fixed">Fixed</option>
              <option value="ignored">Ignored</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Issue Title & Category</th>
                <th className="py-3 px-4 hidden md:table-cell">Affected URL</th>
                <th className="py-3 px-4">Effort / Impact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-slate-200">No issues match the selected filter criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters or searching with different terms.</p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const isExpanded = expandedIssueId === issue.id;
                  return (
                    <React.Fragment key={issue.id}>
                      <tr 
                        onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                        className={`hover:bg-slate-850 cursor-pointer transition ${
                          isExpanded ? 'bg-slate-800/50' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getSeverityBadge(issue.severity)}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-200 group-hover:text-blue-400">
                            {issue.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{issue.category.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{issue.id}</span>
                            <span>•</span>
                            <span className="text-[10px] text-emerald-400 font-medium">
                              {issue.confidence === 'verified' ? 'Verified Check' : 'Inferred'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 hidden md:table-cell max-w-xs truncate text-slate-400">
                          <a
                            href={issue.pageUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-blue-400 truncate inline-flex items-center gap-1"
                            title={issue.pageUrl}
                          >
                            <span className="truncate">{issue.pageUrl}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400" />
                          </a>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-[11px] text-slate-300">
                            <span className="text-slate-400">Effort: </span>
                            <span className="font-medium capitalize">{issue.estimatedEffort}</span>
                          </div>
                          <div className="text-[11px] text-slate-300">
                            <span className="text-slate-400">Impact: </span>
                            <span className={`font-semibold capitalize ${
                              issue.potentialImpact === 'high' ? 'text-amber-400' : 'text-slate-300'
                            }`}>
                              {issue.potentialImpact}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(issue.status)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Drawer Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-y border-slate-800">
                          <td colSpan={6} className="p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Evidence Box */}
                              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Observed Evidence</span>
                                </div>
                                <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                                  {issue.evidence}
                                </p>
                              </div>

                              {/* Recommended Fix Box */}
                              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Remediation Guidance</span>
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                                  {issue.recommendation}
                                </p>
                              </div>
                            </div>

                            {/* Verification Method & Status Update controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-850">
                              <div className="text-slate-400 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                <span>
                                  <strong className="text-slate-300">Verification check:</strong> {issue.verificationMethod}
                                </span>
                              </div>

                              {/* Status update buttons */}
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="text-[11px] text-slate-400 font-medium">Set Status:</span>
                                {(['open', 'in_progress', 'fixed', 'ignored'] as IssueStatus[]).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => onUpdateStatus(issue.id, st)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition ${
                                      issue.status === st
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                  >
                                    {st.replace('_', ' ')}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
