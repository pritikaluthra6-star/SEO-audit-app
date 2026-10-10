import { CrawlResult } from './crawler.js';
import { SeoIssue, CategoryScore, CategoryKey, Severity, CrawledPage, CoreWebVitalsData } from '../src/types/seo.js';

export interface AnalysisOutput {
  overallScore: number;
  coveragePercentage: number;
  totalChecksEvaluated: number;
  totalChecksUnavailable: number;
  categoryScores: CategoryScore[];
  issues: SeoIssue[];
  pages: CrawledPage[];
}

export function analyzeCrawlResults(
  crawl: CrawlResult,
  coreWebVitals?: CoreWebVitalsData
): AnalysisOutput {
  const issues: SeoIssue[] = [];
  let issueCounter = 1;

  const addIssue = (
    category: CategoryKey,
    issueType: string,
    title: string,
    severity: Severity,
    pageUrl: string,
    evidence: string,
    recommendation: string,
    estimatedEffort: 'low' | 'medium' | 'high',
    potentialImpact: 'high' | 'medium' | 'low',
    verificationMethod: string,
    confidence: 'verified' | 'inferred' = 'verified'
  ) => {
    issues.push({
      id: `ISSUE-${issueCounter++}`,
      category,
      issueType,
      title,
      severity,
      pageUrl,
      evidence,
      recommendation,
      estimatedEffort,
      potentialImpact,
      confidence,
      status: 'open',
      detectedAt: new Date().toISOString(),
      verificationMethod,
    });
  };

  // 1. Crawlability & Indexability Checks
  if (!crawl.robotsTxt.exists) {
    addIssue(
      'crawlability',
      'missing_robots_txt',
      'Missing robots.txt File',
      'medium',
      crawl.robotsTxt.url,
      'HTTP request to /robots.txt returned 404 or connection error.',
      'Create and deploy a valid robots.txt at the root of the domain to give explicit crawling instructions to search engines.',
      'low',
      'medium',
      'Request https://domain.com/robots.txt and verify status 200.'
    );
  }

  if (!crawl.sitemapXml.exists) {
    addIssue(
      'crawlability',
      'missing_sitemap_xml',
      'XML Sitemap Not Found',
      'high',
      crawl.sitemapXml.url,
      'No sitemap.xml was detected at the standard root path or referenced in robots.txt.',
      'Generate a comprehensive XML sitemap containing all canonical URLs and submit it to Google Search Console.',
      'medium',
      'high',
      'Inspect /sitemap.xml and verify XML validation in GSC.'
    );
  }

  // 2. Per-Page Checks
  for (const page of crawl.pages) {
    let pageIssueCount = 0;

    // HTTP Status & Security
    if (page.statusCode !== 200) {
      pageIssueCount++;
      addIssue(
        'technical',
        'http_status_error',
        `Non-200 HTTP Response (${page.statusCode})`,
        page.statusCode >= 500 ? 'critical' : 'high',
        page.url,
        `Server returned HTTP ${page.statusCode} for requested page.`,
        'Ensure the URL returns HTTP 200 OK or appropriate 301 permanent redirect if moved.',
        'medium',
        'high',
        'Check server access logs and HTTP status header.'
      );
    }

    if (!page.isHttps) {
      pageIssueCount++;
      addIssue(
        'technical',
        'insecure_protocol',
        'Page Not Served Over HTTPS',
        'critical',
        page.url,
        'URL uses unencrypted HTTP protocol instead of HTTPS.',
        'Install an SSL/TLS certificate and configure 301 redirects from HTTP to HTTPS across the entire domain.',
        'medium',
        'high',
        'Test HTTPS response and redirect header (Strict-Transport-Security).'
      );
    }

    // Title Tag
    if (!page.title) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'missing_title_tag',
        'Missing HTML Title Tag',
        'critical',
        page.url,
        'The <title> element is missing or empty in the document <head>.',
        'Add a unique, descriptive <title> tag between 40 and 60 characters incorporating primary page keywords.',
        'low',
        'high',
        'Inspect the HTML <head> element for <title> presence.'
      );
    } else {
      if (page.titleLength < 25) {
        pageIssueCount++;
        addIssue(
          'on_page',
          'short_title_tag',
          'Title Tag Is Too Short',
          'low',
          page.url,
          `Title length is ${page.titleLength} characters ("${page.title}"). Recommended length is 40–60 characters.`,
          'Expand the title tag with targeted keywords and brand qualifier to maximize SERP click-through rate.',
          'low',
          'medium',
          'Verify title tag character length in SERP preview simulators.'
        );
      } else if (page.titleLength > 65) {
        pageIssueCount++;
        addIssue(
          'on_page',
          'long_title_tag',
          'Title Tag May Be Truncated in SERPs',
          'medium',
          page.url,
          `Title length is ${page.titleLength} characters. Titles over 60 characters frequently get truncated by search engines.`,
          'Refine the title tag to keep primary keywords within the first 60 characters.',
          'low',
          'medium',
          'Simulate SERP pixel width display (< 600px).'
        );
      }
    }

    // Meta Description
    if (!page.metaDescription) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'missing_meta_description',
        'Missing Meta Description Tag',
        'high',
        page.url,
        'No <meta name="description"> tag was found in the HTML source.',
        'Craft a compelling, unique meta description between 120 and 160 characters with a clear call-to-action.',
        'low',
        'high',
        'Check HTML head for <meta name="description" content="...">.'
      );
    } else if (page.metaDescriptionLength < 70) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'short_meta_description',
        'Meta Description Is Too Brief',
        'low',
        page.url,
        `Meta description is ${page.metaDescriptionLength} characters. Under 70 characters provides insufficient context for searchers.`,
        'Expand the description to 120–160 characters detailing the page proposition and encouraging searcher clicks.',
        'low',
        'low',
        'Review meta description length.'
      );
    } else if (page.metaDescriptionLength > 165) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'long_meta_description',
        'Meta Description Exceeds SERP Snippet Limit',
        'low',
        page.url,
        `Meta description is ${page.metaDescriptionLength} characters. It is likely to be truncated on mobile and desktop snippets.`,
        'Trim description to 150–160 characters while retaining value proposition and keywords.',
        'low',
        'low',
        'Inspect Google mobile and desktop snippet previews.'
      );
    }

    // H1 Headings
    if (page.h1.length === 0) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'missing_h1_heading',
        'Missing Primary H1 Heading',
        'high',
        page.url,
        'No <h1> heading element exists on the page.',
        'Add a single prominent <h1> heading that clearly communicates the primary topic of the page.',
        'low',
        'high',
        'Inspect DOM for <h1> element.'
      );
    } else if (page.h1.length > 1) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'multiple_h1_headings',
        'Multiple H1 Headings Detected',
        'informational',
        page.url,
        `Found ${page.h1.length} H1 tags: ${page.h1.map(t => `"${t}"`).slice(0, 3).join(', ')}.`,
        'While HTML5 allows multiple H1s, best practice for SEO clarity is a single main H1 with semantic H2/H3 subsections.',
        'low',
        'low',
        'Inspect DOM headings hierarchy.'
      );
    }

    // Canonical Tag
    if (!page.canonicalUrl) {
      pageIssueCount++;
      addIssue(
        'technical',
        'missing_canonical_url',
        'Missing Canonical URL Declaration',
        'medium',
        page.url,
        'No <link rel="canonical"> tag was specified on this page.',
        'Add a self-referencing canonical tag to prevent potential duplicate content ambiguity across URL parameter variations.',
        'low',
        'medium',
        'Check for <link rel="canonical" href="..."> in head.'
      );
    }

    // Images & Alt Text
    if (page.imagesMissingAlt > 0) {
      pageIssueCount++;
      addIssue(
        'mobile',
        'missing_image_alt',
        `Images Missing Alt Text (${page.imagesMissingAlt}/${page.imagesTotal})`,
        page.imagesMissingAlt > 5 ? 'high' : 'medium',
        page.url,
        `${page.imagesMissingAlt} out of ${page.imagesTotal} <img> tags do not have an alt attribute or have an empty alt.`,
        'Provide descriptive alternative text for all informational images to enhance accessibility and image search indexing.',
        'medium',
        'medium',
        'Inspect <img> attributes in rendered HTML.'
      );
    }

    // Content Depth Heuristic
    if (page.wordCount > 0 && page.wordCount < 200 && page.statusCode === 200) {
      pageIssueCount++;
      addIssue(
        'content',
        'thin_content_detected',
        'Potentially Thin Content Detected',
        'medium',
        page.url,
        `Page contains approximately ${page.wordCount} words of body text.`,
        'Evaluate whether the page adequately satisfies search intent. Consider enriching with comprehensive details, FAQs, or structured examples.',
        'high',
        'medium',
        'Analyze on-page copy depth and user satisfaction signals.',
        'inferred'
      );
    }

    // Open Graph
    if (!page.hasOpenGraph) {
      pageIssueCount++;
      addIssue(
        'on_page',
        'missing_open_graph',
        'Missing Open Graph Metadata',
        'low',
        page.url,
        'No Open Graph tags (og:title, og:description, og:image) were detected in <head>.',
        'Add Open Graph tags to ensure rich preview cards when the page is shared across social media and messaging channels.',
        'low',
        'low',
        'Test URL using Facebook Sharing Debugger or Twitter Card Validator.'
      );
    }

    // Structured Data
    if (page.structuredDataTypes.length === 0) {
      pageIssueCount++;
      addIssue(
        'structured_data',
        'missing_structured_data',
        'No Schema.org Structured Data Found',
        'medium',
        page.url,
        'No JSON-LD or Microdata structured data detected on this page.',
        'Implement JSON-LD structured data appropriate for the page type (e.g., Organization, WebSite, Article, Product, BreadcrumbList).',
        'medium',
        'medium',
        'Validate via Google Rich Results Test tool.'
      );
    }

    // Mobile Viewport
    if (!page.viewportConfigured) {
      pageIssueCount++;
      addIssue(
        'mobile',
        'missing_viewport_meta',
        'Missing Mobile Viewport Meta Tag',
        'critical',
        page.url,
        'No <meta name="viewport" content="width=device-width, initial-scale=1"> found.',
        'Add the viewport meta tag to enable responsive rendering across mobile and tablet screens.',
        'low',
        'high',
        'Inspect <meta name="viewport"> tag in head.'
      );
    }

    // Language Attribute
    if (!page.langAttribute) {
      pageIssueCount++;
      addIssue(
        'technical',
        'missing_html_lang',
        'Missing HTML lang Attribute',
        'low',
        page.url,
        'The root <html> tag does not specify a lang attribute (e.g., <html lang="en">).',
        'Add the lang attribute to the <html> tag to declare the page language for screen readers and search engines.',
        'low',
        'low',
        'Inspect <html lang="..."> attribute.'
      );
    }

    // Internal links
    if (page.internalLinksCount === 0 && crawl.pages.length > 1) {
      pageIssueCount++;
      addIssue(
        'internal_linking',
        'no_internal_links',
        'Page Contains No Internal Outgoing Links',
        'medium',
        page.url,
        'Zero internal links were found on this page, creating a potential dead end for crawlers and visitors.',
        'Incorporate relevant internal navigation or in-content contextual links to related website pages.',
        'low',
        'medium',
        'Check on-page anchor elements pointing to the same host.'
      );
    }

    page.issuesCount = pageIssueCount;
  }

  // 3. Evaluate Performance Issues if CWV available
  if (coreWebVitals) {
    if (coreWebVitals.performanceScore < 50) {
      addIssue(
        'performance',
        'poor_lighthouse_performance',
        `Poor Performance Score (${coreWebVitals.performanceScore}/100)`,
        'critical',
        coreWebVitals.url,
        `Google PageSpeed lab score is ${coreWebVitals.performanceScore}/100 on ${coreWebVitals.device}.`,
        'Address critical render-blocking resources, optimize uncompressed images, and reduce JavaScript execution time.',
        'high',
        'high',
        'Re-run Google PageSpeed Insights.'
      );
    } else if (coreWebVitals.performanceScore < 85) {
      addIssue(
        'performance',
        'moderate_lighthouse_performance',
        `Moderate Performance Score (${coreWebVitals.performanceScore}/100)`,
        'medium',
        coreWebVitals.url,
        `PageSpeed score is ${coreWebVitals.performanceScore}/100.`,
        'Follow PageSpeed opportunities to reduce LCP and layout shifts.',
        'medium',
        'medium',
        'Re-run Google PageSpeed Insights.'
      );
    }

    if (coreWebVitals.lcp.rating === 'poor') {
      addIssue(
        'performance',
        'poor_lcp',
        `Largest Contentful Paint (LCP) Exceeds Threshold (${coreWebVitals.lcp.value}${coreWebVitals.lcp.unit})`,
        'high',
        coreWebVitals.url,
        `LCP measured at ${coreWebVitals.lcp.value}${coreWebVitals.lcp.unit} (standard is < 2.5s).`,
        'Preload hero images, implement modern WebP/AVIF formats, and prioritize critical CSS.',
        'medium',
        'high',
        'Test with Chrome DevTools Performance panel.'
      );
    }

    if (coreWebVitals.cls.rating === 'poor') {
      addIssue(
        'performance',
        'poor_cls',
        `Cumulative Layout Shift (CLS) Exceeds Standard (${coreWebVitals.cls.value})`,
        'high',
        coreWebVitals.url,
        `CLS measured at ${coreWebVitals.cls.value} (target is < 0.1).`,
        'Set explicit width and height attributes on all image and iframe elements to reserve space.',
        'medium',
        'medium',
        'Measure layout shifts during page load.'
      );
    }
  }

  // 4. Calculate Category Scores based on master prompt weights:
  // Technical: 25%
  // On-page: 20%
  // Content: 15%
  // Performance: 15%
  // Crawlability: 10%
  // Structured data: 5%
  // Mobile: 5%
  // Internal linking: 5%

  const categoryDefinitions: Array<{ key: CategoryKey; name: string; weight: number; baseChecks: number }> = [
    { key: 'technical', name: 'Technical SEO', weight: 25, baseChecks: crawl.pages.length * 4 },
    { key: 'on_page', name: 'On-Page SEO', weight: 20, baseChecks: crawl.pages.length * 5 },
    { key: 'content', name: 'Content Quality', weight: 15, baseChecks: crawl.pages.length * 2 },
    { key: 'performance', name: 'Website Performance', weight: 15, baseChecks: coreWebVitals ? 6 : 2 },
    { key: 'crawlability', name: 'Crawlability & Indexability', weight: 10, baseChecks: 3 + crawl.pages.length },
    { key: 'structured_data', name: 'Structured Data', weight: 5, baseChecks: crawl.pages.length },
    { key: 'mobile', name: 'Mobile Usability & Accessibility', weight: 5, baseChecks: crawl.pages.length * 2 },
    { key: 'internal_linking', name: 'Internal Linking', weight: 5, baseChecks: crawl.pages.length },
  ];

  const categoryScores: CategoryScore[] = categoryDefinitions.map((cat) => {
    const catIssues = issues.filter((i) => i.category === cat.key);
    const critical = catIssues.filter((i) => i.severity === 'critical').length;
    const high = catIssues.filter((i) => i.severity === 'high').length;
    const medium = catIssues.filter((i) => i.severity === 'medium').length;
    const low = catIssues.filter((i) => i.severity === 'low').length;

    // Deduct points based on severity impact
    // Max penalty capped at 100
    const penalty = critical * 25 + high * 15 + medium * 8 + low * 3;
    const rawScore = Math.max(0, Math.min(100, 100 - penalty));

    let summary = 'Optimal configuration detected.';
    if (critical > 0) {
      summary = `${critical} critical issue(s) require immediate remediation.`;
    } else if (high > 0) {
      summary = `${high} high-priority issue(s) impacting crawl/ranking potential.`;
    } else if (medium > 0) {
      summary = `${medium} medium-priority optimization opportunity(ies) identified.`;
    } else if (low > 0) {
      summary = 'Minor best-practice refinements recommended.';
    }

    return {
      key: cat.key,
      name: cat.name,
      weight: cat.weight,
      score: rawScore,
      evaluatedChecks: cat.baseChecks,
      totalChecks: cat.baseChecks,
      criticalIssues: critical,
      highIssues: high,
      mediumIssues: medium,
      lowIssues: low,
      summary,
    };
  });

  // Weighted overall score
  let totalWeightedScore = 0;
  let totalWeights = 0;
  for (const cs of categoryScores) {
    totalWeightedScore += cs.score * cs.weight;
    totalWeights += cs.weight;
  }
  const overallScore = totalWeights > 0 ? Math.round(totalWeightedScore / totalWeights) : 0;

  const totalChecksEvaluated = categoryScores.reduce((acc, c) => acc + c.evaluatedChecks, 0);
  const totalChecksUnavailable = coreWebVitals ? 0 : 4; // Notes untested external checks
  const totalChecksAll = totalChecksEvaluated + totalChecksUnavailable;
  const coveragePercentage = totalChecksAll > 0 ? Math.round((totalChecksEvaluated / totalChecksAll) * 100) : 100;

  return {
    overallScore,
    coveragePercentage,
    totalChecksEvaluated,
    totalChecksUnavailable,
    categoryScores,
    issues,
    pages: crawl.pages,
  };
}
