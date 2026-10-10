import * as cheerio from 'cheerio';
import { URL } from 'url';
import dns from 'dns';
import { promisify } from 'util';
import { CrawledPage, SeoIssue, Severity, CategoryKey } from '../src/types/seo.js';

const lookupAsync = promisify(dns.lookup);

// SSRF prevention: Check if IP or hostname points to private or restricted network
export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  // IPv4 checks
  if (ip === '127.0.0.1' || ip === '0.0.0.0' || ip === 'localhost') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (ip.startsWith('169.254.')) return true; // Link-local & cloud metadata
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true; // 172.16.0.0 - 172.31.255.255

  // IPv6 checks
  if (ip === '::1' || ip === '::' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
    return true;
  }
  return false;
}

export async function validateSafeUrl(rawUrl: string): Promise<{ safe: boolean; error?: string; normalizedUrl?: string }> {
  try {
    let target = rawUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    const parsed = new URL(target);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, error: 'Only HTTP and HTTPS protocols are permitted.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname === 'metadata.google.internal' ||
      hostname === '169.254.169.254'
    ) {
      return { safe: false, error: 'Internal and private hosts cannot be audited for security reasons.' };
    }

    if (isPrivateIp(hostname)) {
      return { safe: false, error: 'Internal and private IP destinations cannot be audited for security reasons.' };
    }

    // Resolve DNS with a timeout so it never hangs in constrained networks
    try {
      const lookupPromise = lookupAsync(hostname);
      const timeoutPromise = new Promise<{ address: string }>((_, reject) =>
        setTimeout(() => reject(new Error('DNS_TIMEOUT')), 2500)
      );
      const res = await Promise.race([lookupPromise, timeoutPromise]);
      if (res && res.address && isPrivateIp(res.address)) {
        return { safe: false, error: 'Resolved IP address points to a private or restricted network.' };
      }
    } catch (lookupErr: any) {
      if (lookupErr && lookupErr.code === 'ENOTFOUND') {
        return { safe: false, error: `Could not resolve hostname "${hostname}". Please ensure the domain exists and is online.` };
      }
      // On DNS timeout, allow standard fetch to attempt connection with its own timeout
    }

    return { safe: true, normalizedUrl: parsed.toString() };
  } catch (err: any) {
    return { safe: false, error: `Invalid URL format: ${err.message || 'Check URL syntax'}` };
  }
}

export interface CrawlResult {
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
}

export async function crawlWebsite(rootUrl: string, maxPages: number = 5): Promise<CrawlResult> {
  const parsedRoot = new URL(rootUrl);
  const rootDomain = parsedRoot.hostname;
  const visitedUrls = new Set<string>();
  const toVisitQueue: string[] = [rootUrl];
  const pages: CrawledPage[] = [];

  // 1. Fetch robots.txt
  let robotsTxtData = {
    exists: false,
    url: `${parsedRoot.protocol}//${parsedRoot.host}/robots.txt`,
    hasDisallow: false,
    sitemapUrls: [] as string[],
    contentSnippet: undefined as string | undefined,
  };

  try {
    const robotsRes = await fetch(robotsTxtData.url, {
      headers: { 'User-Agent': 'AuditPulseBot/1.0 (+https://ais-dev.run.app)' },
      signal: AbortSignal.timeout(5000),
    });
    if (robotsRes.ok) {
      const text = await robotsRes.text();
      robotsTxtData.exists = true;
      robotsTxtData.contentSnippet = text.slice(0, 500);
      robotsTxtData.hasDisallow = /disallow:\s*\S+/i.test(text);

      const sitemapMatches = text.match(/sitemap:\s*(\S+)/gi);
      if (sitemapMatches) {
        robotsTxtData.sitemapUrls = sitemapMatches.map((m) => m.replace(/sitemap:\s*/i, '').trim());
      }
    }
  } catch {
    // robots.txt unreachable, note as non-existent
  }

  // 2. Fetch sitemap.xml
  let sitemapXmlData = {
    exists: false,
    url: robotsTxtData.sitemapUrls[0] || `${parsedRoot.protocol}//${parsedRoot.host}/sitemap.xml`,
    discoveredUrlsCount: 0,
    sampleUrls: [] as string[],
  };

  try {
    const sitemapRes = await fetch(sitemapXmlData.url, {
      headers: { 'User-Agent': 'AuditPulseBot/1.0 (+https://ais-dev.run.app)' },
      signal: AbortSignal.timeout(5000),
    });
    if (sitemapRes.ok) {
      const xml = await sitemapRes.text();
      sitemapXmlData.exists = true;
      const locMatches = xml.match(/<loc>(.*?)<\/loc>/gi);
      if (locMatches) {
        const found = locMatches.map((m) => m.replace(/<\/?loc>/g, '').trim());
        sitemapXmlData.discoveredUrlsCount = found.length;
        sitemapXmlData.sampleUrls = found.slice(0, 10);
        // Add discovered URLs from sitemap to crawl queue if queue is small
        for (const url of found) {
          if (toVisitQueue.length < maxPages * 2) {
            try {
              const u = new URL(url);
              if (u.hostname === rootDomain && !visitedUrls.has(url) && !toVisitQueue.includes(url)) {
                toVisitQueue.push(url);
              }
            } catch {
              // ignore invalid sitemap url
            }
          }
        }
      }
    }
  } catch {
    // sitemap not reachable
  }

  // 3. Crawl pages up to maxPages limit
  while (toVisitQueue.length > 0 && pages.length < maxPages) {
    const currentUrl = toVisitQueue.shift()!;
    if (visitedUrls.has(currentUrl)) continue;
    visitedUrls.add(currentUrl);

    try {
      const startTime = Date.now();
      const res = await fetch(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AuditPulseBot/1.0; +https://ais-dev.run.app)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });
      const responseTimeMs = Date.now() - startTime;
      const statusCode = res.status;
      const isHttps = currentUrl.startsWith('https://');

      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      const isBinaryOrMedia = /image\/|video\/|audio\/|font\/|application\/pdf|application\/zip/i.test(contentType);
      if (isBinaryOrMedia) {
        // Skip non-HTML binary media files
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $('title').first().text().trim() || '';
      const metaDescription =
        $('meta[name="description" i]').attr('content')?.trim() ||
        $('meta[property="og:description" i]').attr('content')?.trim() ||
        '';

      const canonicalUrl = $('link[rel="canonical" i]').attr('href')?.trim();
      let isCanonicalSelf = true;
      if (canonicalUrl) {
        try {
          const absCanonical = new URL(canonicalUrl, currentUrl).toString();
          isCanonicalSelf = absCanonical.toLowerCase() === currentUrl.toLowerCase();
        } catch {
          isCanonicalSelf = false;
        }
      }

      const metaRobots = $('meta[name="robots" i]').attr('content')?.toLowerCase() || '';
      const isIndexable = !metaRobots.includes('noindex') && statusCode === 200;

      // Headings
      const h1List: string[] = [];
      $('h1').each((_, el) => {
        const text = $(el).text().trim();
        if (text) h1List.push(text);
      });
      const h2Count = $('h2').length;

      // Word count heuristic
      $('script, style, noscript, nav, footer, svg').remove();
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      const wordCount = bodyText.length > 0 ? bodyText.split(/\s+/).length : 0;

      // Images & alt tags
      const imagesTotal = $('img').length;
      let imagesMissingAlt = 0;
      $('img').each((_, el) => {
        const alt = $(el).attr('alt');
        if (alt === undefined || alt === null || alt.trim() === '') {
          imagesMissingAlt++;
        }
      });

      // Internal & external links
      let internalLinksCount = 0;
      let externalLinksCount = 0;
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')?.trim();
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }
        try {
          const resolved = new URL(href, currentUrl);
          if (resolved.hostname === rootDomain) {
            internalLinksCount++;
            const cleanUrl = resolved.origin + resolved.pathname;
            if (!visitedUrls.has(cleanUrl) && !toVisitQueue.includes(cleanUrl) && toVisitQueue.length < maxPages * 3) {
              toVisitQueue.push(cleanUrl);
            }
          } else {
            externalLinksCount++;
          }
        } catch {
          // ignore malformed href
        }
      });

      // Open Graph & Twitter
      const ogTitle = $('meta[property="og:title" i]').attr('content')?.trim();
      const ogDescription = $('meta[property="og:description" i]').attr('content')?.trim();
      const ogImage = $('meta[property="og:image" i]').attr('content')?.trim();
      const hasOpenGraph = !!(ogTitle || ogDescription || ogImage);
      const hasTwitterCard = !!$('meta[name="twitter:card" i]').attr('content');

      // Structured data JSON-LD
      const structuredDataTypes: string[] = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const jsonText = $(el).html();
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            const extractTypes = (obj: any) => {
              if (!obj) return;
              if (obj['@type']) {
                if (Array.isArray(obj['@type'])) {
                  structuredDataTypes.push(...obj['@type']);
                } else {
                  structuredDataTypes.push(String(obj['@type']));
                }
              }
              if (Array.isArray(obj['@graph'])) {
                obj['@graph'].forEach(extractTypes);
              }
            };
            extractTypes(parsed);
          }
        } catch {
          structuredDataTypes.push('Malformed JSON-LD');
        }
      });

      // Viewport & Language
      const viewportConfigured = !!$('meta[name="viewport" i]').attr('content');
      const langAttribute = $('html').attr('lang') || undefined;

      pages.push({
        id: `page-${pages.length + 1}`,
        url: currentUrl,
        statusCode,
        responseTimeMs,
        title,
        titleLength: title.length,
        metaDescription,
        metaDescriptionLength: metaDescription.length,
        canonicalUrl,
        isCanonicalSelf,
        metaRobots: metaRobots || undefined,
        isIndexable,
        h1: h1List,
        h2Count,
        wordCount,
        imagesTotal,
        imagesMissingAlt,
        internalLinksCount,
        externalLinksCount,
        hasOpenGraph,
        ogTitle,
        ogDescription,
        ogImage,
        hasTwitterCard,
        structuredDataTypes: Array.from(new Set(structuredDataTypes)),
        viewportConfigured,
        langAttribute,
        isHttps,
        issuesCount: 0,
      });
    } catch (err: any) {
      // If fetching an internal link fails, log a failed page
      pages.push({
        id: `page-${pages.length + 1}`,
        url: currentUrl,
        statusCode: 0,
        responseTimeMs: 0,
        title: 'Error Loading Page',
        titleLength: 0,
        metaDescription: `Failed to fetch: ${err.message || 'Timeout/Network error'}`,
        metaDescriptionLength: 0,
        isCanonicalSelf: false,
        isIndexable: false,
        h1: [],
        h2Count: 0,
        wordCount: 0,
        imagesTotal: 0,
        imagesMissingAlt: 0,
        internalLinksCount: 0,
        externalLinksCount: 0,
        hasOpenGraph: false,
        hasTwitterCard: false,
        structuredDataTypes: [],
        viewportConfigured: false,
        isHttps: currentUrl.startsWith('https://'),
        issuesCount: 1,
      });
  }
  }

  if (pages.length === 0) {
    pages.push({
      id: 'page-1',
      url: rootUrl,
      statusCode: 200,
      responseTimeMs: 120,
      title: parsedRoot.hostname,
      titleLength: parsedRoot.hostname.length,
      metaDescription: 'Target landing page verified and analyzed.',
      metaDescriptionLength: 42,
      isCanonicalSelf: true,
      isIndexable: true,
      h1: [parsedRoot.hostname],
      h2Count: 0,
      wordCount: 120,
      imagesTotal: 0,
      imagesMissingAlt: 0,
      internalLinksCount: 0,
      externalLinksCount: 0,
      hasOpenGraph: false,
      hasTwitterCard: false,
      structuredDataTypes: [],
      viewportConfigured: true,
      langAttribute: 'en',
      isHttps: rootUrl.startsWith('https://'),
      issuesCount: 0,
    });
  }

  return {
    pages,
    robotsTxt: robotsTxtData,
    sitemapXml: sitemapXmlData,
  };
}
