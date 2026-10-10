export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type IssueStatus = 'open' | 'in_progress' | 'fixed' | 'ignored' | 'needs_review';
export type CategoryKey = 
  | 'technical'
  | 'on_page'
  | 'content'
  | 'performance'
  | 'crawlability'
  | 'structured_data'
  | 'mobile'
  | 'internal_linking';

export interface CategoryScore {
  key: CategoryKey;
  name: string;
  weight: number; // percentage, e.g. 25
  score: number; // 0 - 100
  evaluatedChecks: number;
  totalChecks: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  summary: string;
}

export interface SeoIssue {
  id: string;
  category: CategoryKey;
  issueType: string;
  title: string;
  severity: Severity;
  pageUrl: string;
  evidence: string;
  recommendation: string;
  estimatedEffort: 'low' | 'medium' | 'high';
  potentialImpact: 'high' | 'medium' | 'low';
  confidence: 'verified' | 'inferred';
  status: IssueStatus;
  detectedAt: string;
  verificationMethod: string;
}

export interface CrawledPage {
  id: string;
  url: string;
  statusCode: number;
  responseTimeMs: number;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  canonicalUrl?: string;
  isCanonicalSelf: boolean;
  metaRobots?: string;
  isIndexable: boolean;
  h1: string[];
  h2Count: number;
  wordCount: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  internalLinksCount: number;
  externalLinksCount: number;
  hasOpenGraph: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  hasTwitterCard: boolean;
  structuredDataTypes: string[];
  viewportConfigured: boolean;
  langAttribute?: string;
  isHttps: boolean;
  issuesCount: number;
}

export interface CoreWebVitalsData {
  url: string;
  device: 'mobile' | 'desktop';
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  fcp: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor' };
  lcp: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor' };
  cls: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor' };
  tbt: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor' };
  speedIndex: { value: number; unit: string; rating: 'good' | 'needs_improvement' | 'poor' };
  opportunities: Array<{
    title: string;
    savings: string;
    description: string;
  }>;
  diagnostics: Array<{
    title: string;
    displayValue: string;
    description: string;
  }>;
  testedAt: string;
  source: 'Google PageSpeed Insights API' | 'Lighthouse Heuristic Engine';
}

export interface ActionPlanTask {
  id: string;
  timeframe: 'days_1_7' | 'days_8_30' | 'days_31_60' | 'days_61_90';
  title: string;
  reason: string;
  category: CategoryKey;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  effort: 'quick' | 'moderate' | 'involved';
  affectedUrl?: string;
  steps: string[];
  measurementMetric: string;
  validationCheck: string;
  completed: boolean;
}

export interface AiContentAnalysis {
  pageUrl: string;
  topicSummary: string;
  searchIntentMatch: string;
  strengths: string[];
  weaknesses: string[];
  missingSubtopics: string[];
  suggestedFaqs: Array<{ question: string; suggestedAnswer: string }>;
  suggestedTitles: string[];
  suggestedMetaDescriptions: string[];
  editorialChecklist: string[];
}

export interface KeywordIdea {
  id: string;
  keyword: string;
  intent: 'Informational' | 'Navigational' | 'Commercial' | 'Transactional';
  targetUrl: string;
  suggestedContentType: string;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  searchVolume: string; // e.g. "Not available (requires Semrush/Ahrefs API)" or verified
  difficulty: string;
  cpc: string;
  provider: string;
}

export interface CompetitorComparison {
  competitorUrl: string;
  status: 'analyzed' | 'failed' | 'pending';
  statusCode?: number;
  title?: string;
  metaDescription?: string;
  h1?: string;
  wordCount?: number;
  headingsCount?: number;
  imagesAltRatio?: string;
  schemaTypes?: string[];
  estimatedSpeed?: string;
  contentGaps: string[];
  differentiationOpportunities: string[];
}

export interface BacklinkRecord {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  relType: 'dofollow' | 'nofollow' | 'ugc' | 'sponsored';
  referringDomain: string;
  detectedDate: string;
  suspiciousFlag?: boolean;
  notes?: string;
}

export interface SearchConsoleMetric {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number; // percentage
  position: number;
}

export interface AuditConfig {
  url: string;
  businessName?: string;
  targetCountry?: string;
  targetLanguage?: string;
  industry?: string;
  targetKeywords?: string[];
  competitorUrls?: string[];
  auditDepth: 'quick' | 'standard' | 'deep'; // 1 page, 5 pages, 15 pages
  maxPages: number;
  device: 'mobile' | 'desktop';
  enablePageSpeed: boolean;
}

export interface AuditResult {
  id: string;
  url: string;
  config: AuditConfig;
  startedAt: string;
  completedAt: string;
  status: 'running' | 'completed' | 'failed';
  overallScore: number;
  coveragePercentage: number;
  totalChecksEvaluated: number;
  totalChecksUnavailable: number;
  categoryScores: CategoryScore[];
  issues: SeoIssue[];
  pages: CrawledPage[];
  robotsTxt: {
    exists: boolean;
    url: string;
    hasDisallow: boolean;
    sitemapUrls: string[];
    contentSnippet?: string;
  };
  sitemapXml: {
    exists: boolean;
    url: string;
    discoveredUrlsCount: number;
    sampleUrls: string[];
  };
  coreWebVitals?: CoreWebVitalsData;
  aiExecutiveSummary?: {
    overview: string;
    keyRisk: string;
    quickWin: string;
    strategicOutlook: string;
  };
  actionPlan: ActionPlanTask[];
  keywords: KeywordIdea[];
  competitors: CompetitorComparison[];
  backlinksData?: {
    source: string;
    totalBacklinks: number;
    referringDomains: number;
    dofollowCount: number;
    nofollowCount: number;
    records: BacklinkRecord[];
    topAnchors: Array<{ text: string; count: number }>;
  };
  searchConsoleData?: {
    connected: boolean;
    propertyUrl?: string;
    totalClicks: number;
    totalImpressions: number;
    averageCtr: number;
    averagePosition: number;
    queries: SearchConsoleMetric[];
  };
  dataSources: {
    crawler: 'Verified Live HTTP/HTML Parser';
    pagespeed: string;
    ai: string;
    gsc: string;
    backlinks: string;
  };
}

export interface AuditHistorySummary {
  id: string;
  url: string;
  businessName?: string;
  completedAt: string;
  overallScore: number;
  pagesCrawled: number;
  issuesCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}
