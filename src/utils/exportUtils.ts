import { SeoIssue, CrawledPage, KeywordIdea, ActionPlanTask } from '../types/seo';

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportIssuesToCsv(issues: SeoIssue[], targetUrl: string) {
  const headers = ['Issue ID', 'Category', 'Severity', 'Title', 'URL', 'Evidence', 'Recommendation', 'Effort', 'Impact', 'Status', 'Verification Method'];
  const rows = issues.map((i) => [
    `"${i.id}"`,
    `"${i.category}"`,
    `"${i.severity}"`,
    `"${i.title.replace(/"/g, '""')}"`,
    `"${i.pageUrl}"`,
    `"${i.evidence.replace(/"/g, '""')}"`,
    `"${i.recommendation.replace(/"/g, '""')}"`,
    `"${i.estimatedEffort}"`,
    `"${i.potentialImpact}"`,
    `"${i.status}"`,
    `"${i.verificationMethod.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const sanitizedDomain = targetUrl.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
  downloadCsv(`auditpulse_issues_${sanitizedDomain}.csv`, csv);
}

export function exportPagesToCsv(pages: CrawledPage[], targetUrl: string) {
  const headers = [
    'Page ID',
    'URL',
    'HTTP Status',
    'Response Time (ms)',
    'Title',
    'Title Length',
    'Meta Description',
    'Desc Length',
    'H1 Headings',
    'H2 Count',
    'Word Count',
    'Images Total',
    'Images Missing Alt',
    'Internal Links',
    'External Links',
    'Canonical URL',
    'Self Canonical',
    'Indexable',
    'Structured Data Types',
    'Issues Count',
  ];

  const rows = pages.map((p) => [
    `"${p.id}"`,
    `"${p.url}"`,
    p.statusCode,
    p.responseTimeMs,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    p.titleLength,
    `"${(p.metaDescription || '').replace(/"/g, '""')}"`,
    p.metaDescriptionLength,
    `"${p.h1.join(' | ').replace(/"/g, '""')}"`,
    p.h2Count,
    p.wordCount,
    p.imagesTotal,
    p.imagesMissingAlt,
    p.internalLinksCount,
    p.externalLinksCount,
    `"${p.canonicalUrl || ''}"`,
    p.isCanonicalSelf ? 'Yes' : 'No',
    p.isIndexable ? 'Yes' : 'No',
    `"${p.structuredDataTypes.join(', ')}"`,
    p.issuesCount,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const sanitizedDomain = targetUrl.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
  downloadCsv(`auditpulse_crawled_pages_${sanitizedDomain}.csv`, csv);
}

export function exportKeywordsToCsv(keywords: KeywordIdea[], targetUrl: string) {
  const headers = ['Keyword', 'Search Intent', 'Target URL', 'Content Type', 'Priority', 'Rationale', 'Search Volume', 'Difficulty', 'Data Provider'];
  const rows = keywords.map((k) => [
    `"${k.keyword.replace(/"/g, '""')}"`,
    `"${k.intent}"`,
    `"${k.targetUrl}"`,
    `"${k.suggestedContentType.replace(/"/g, '""')}"`,
    `"${k.priority}"`,
    `"${k.rationale.replace(/"/g, '""')}"`,
    `"${k.searchVolume}"`,
    `"${k.difficulty}"`,
    `"${k.provider}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const sanitizedDomain = targetUrl.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
  downloadCsv(`auditpulse_keyword_plan_${sanitizedDomain}.csv`, csv);
}

export function exportActionPlanToCsv(tasks: ActionPlanTask[], targetUrl: string) {
  const headers = ['Task ID', 'Timeframe', 'Title', 'Priority', 'Effort', 'Category', 'Affected URL', 'Reason', 'Measurement Metric', 'Validation Check', 'Completed'];
  const rows = tasks.map((t) => [
    `"${t.id}"`,
    `"${t.timeframe}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.priority}"`,
    `"${t.effort}"`,
    `"${t.category}"`,
    `"${t.affectedUrl || ''}"`,
    `"${t.reason.replace(/"/g, '""')}"`,
    `"${t.measurementMetric.replace(/"/g, '""')}"`,
    `"${t.validationCheck.replace(/"/g, '""')}"`,
    t.completed ? 'Yes' : 'No',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const sanitizedDomain = targetUrl.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
  downloadCsv(`auditpulse_action_plan_${sanitizedDomain}.csv`, csv);
}
