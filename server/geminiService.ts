import { GoogleGenAI, Type } from '@google/genai';
import { SeoIssue, CrawledPage, ActionPlanTask, KeywordIdea } from '../src/types/seo.js';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function generateAiExecutiveSummary(
  url: string,
  overallScore: number,
  pages: CrawledPage[],
  issues: SeoIssue[]
): Promise<{ overview: string; keyRisk: string; quickWin: string; strategicOutlook: string }> {
  const ai = getAiClient();
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const topIssues = issues.slice(0, 8).map(i => `- [${i.severity.toUpperCase()}] ${i.title} on ${i.pageUrl}: ${i.evidence}`);

  if (!ai) {
    return {
      overview: `Audit completed for ${url} analyzing ${pages.length} crawled page(s). Total overall health score is ${overallScore}/100 with ${criticalCount} critical and ${highCount} high-severity findings.`,
      keyRisk: criticalCount > 0 ? `${criticalCount} critical issues detected that may impede search crawler indexing or security compliance.` : 'No critical architectural blockers detected.',
      quickWin: 'Optimize missing meta descriptions and title tags across priority landing pages to elevate organic click-through rates.',
      strategicOutlook: 'Address high-impact technical items first, then implement structured data and editorial keyword expansion over the next 90 days.',
    };
  }

  try {
    const prompt = `
You are an expert technical SEO strategist. Analyze the following verified audit results for ${url}:
Overall Score: ${overallScore}/100
Pages Crawled: ${pages.length}
Critical Issues: ${criticalCount}
High Issues: ${highCount}

Top Detected Issues:
${topIssues.join('\n')}

Generate an executive summary strictly based on these verified findings. Do NOT invent backlinks, traffic statistics, or keyword ranking positions.
Respond in valid JSON with these 4 string properties:
"overview": 2-3 sentences summarizing the website's technical and on-page SEO health.
"keyRisk": the single most urgent risk identified in the findings.
"quickWin": the highest impact low-effort fix that should be tackled immediately.
"strategicOutlook": recommended strategic direction for the next 90 days.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            keyRisk: { type: Type.STRING },
            quickWin: { type: Type.STRING },
            strategicOutlook: { type: Type.STRING },
          },
          required: ['overview', 'keyRisk', 'quickWin', 'strategicOutlook'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      overview: parsed.overview || 'SEO health evaluation completed based on crawled evidence.',
      keyRisk: parsed.keyRisk || 'Ensure all critical security and crawlability directives are verified.',
      quickWin: parsed.quickWin || 'Implement descriptive title tags and meta descriptions.',
      strategicOutlook: parsed.strategicOutlook || 'Execute 90-day phased technical and content enhancement roadmap.',
    };
  } catch (err) {
    console.error('Error generating AI executive summary:', err);
    return {
      overview: `Audit analysis completed for ${url}. The website received a health score of ${overallScore}/100 across ${pages.length} analyzed page(s).`,
      keyRisk: criticalCount > 0 ? `${criticalCount} critical issue(s) require technical intervention.` : 'Monitor crawl logs and robots directives.',
      quickWin: 'Update missing meta tags and fix image alt attributes.',
      strategicOutlook: 'Focus on technical foundation before scaling content and link campaigns.',
    };
  }
}

export async function generateAiActionPlan(
  url: string,
  issues: SeoIssue[]
): Promise<ActionPlanTask[]> {
  const ai = getAiClient();
  const fallbackTasks: ActionPlanTask[] = issues.slice(0, 8).map((issue, idx) => {
    let timeframe: ActionPlanTask['timeframe'] = 'days_1_7';
    if (idx >= 2 && idx < 4) timeframe = 'days_8_30';
    else if (idx >= 4 && idx < 6) timeframe = 'days_31_60';
    else if (idx >= 6) timeframe = 'days_61_90';

    return {
      id: `task-${idx + 1}`,
      timeframe,
      title: `Resolve: ${issue.title}`,
      reason: issue.evidence,
      category: issue.category,
      priority: issue.severity === 'critical' ? 'urgent' : issue.severity === 'high' ? 'high' : 'medium',
      effort: issue.estimatedEffort === 'low' ? 'quick' : issue.estimatedEffort === 'medium' ? 'moderate' : 'involved',
      affectedUrl: issue.pageUrl,
      steps: [
        `Review the affected URL (${issue.pageUrl})`,
        issue.recommendation,
        `Validate fix: ${issue.verificationMethod}`,
      ],
      measurementMetric: 'Zero remaining instances on subsequent audit crawl',
      validationCheck: issue.verificationMethod,
      completed: false,
    };
  });

  if (!ai || issues.length === 0) {
    return fallbackTasks;
  }

  try {
    const prompt = `
You are a senior technical SEO director. Based on the following audited SEO issues detected on ${url}:
${issues.slice(0, 10).map((i, idx) => `${idx + 1}. [${i.severity.toUpperCase()}] ${i.title} (URL: ${i.pageUrl}) - Evidence: ${i.evidence} - Fix: ${i.recommendation}`).join('\n')}

Create a prioritized, realistic action plan divided into 4 phases:
- "days_1_7" (Immediate fixes: urgent technical blockers, critical security, broken indexing)
- "days_8_30" (Short-term improvements: core on-page metadata, major image alts, mobile tweaks)
- "days_31_60" (Medium-term optimizations: content enrichment, schema markup, internal link architecture)
- "days_61_90" (Long-term growth: content expansion, topical authority, routine monitoring)

Return a JSON array of 6-8 structured tasks.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timeframe: { type: Type.STRING, description: 'days_1_7 | days_8_30 | days_31_60 | days_61_90' },
              title: { type: Type.STRING },
              reason: { type: Type.STRING },
              category: { type: Type.STRING },
              priority: { type: Type.STRING, description: 'urgent | high | medium | low' },
              effort: { type: Type.STRING, description: 'quick | moderate | involved' },
              affectedUrl: { type: Type.STRING },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              measurementMetric: { type: Type.STRING },
              validationCheck: { type: Type.STRING },
            },
            required: ['timeframe', 'title', 'reason', 'category', 'priority', 'effort', 'steps', 'measurementMetric', 'validationCheck'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any, idx: number) => ({
        id: `task-ai-${idx + 1}`,
        timeframe: (['days_1_7', 'days_8_30', 'days_31_60', 'days_61_90'].includes(item.timeframe) ? item.timeframe : 'days_1_7') as any,
        title: item.title || 'Remediate detected issue',
        reason: item.reason || 'Identified during audit',
        category: (item.category || 'technical') as any,
        priority: (['urgent', 'high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium') as any,
        effort: (['quick', 'moderate', 'involved'].includes(item.effort) ? item.effort : 'moderate') as any,
        affectedUrl: item.affectedUrl || url,
        steps: Array.isArray(item.steps) ? item.steps : ['Implement recommended fix', 'Re-verify using crawler'],
        measurementMetric: item.measurementMetric || 'Resolved on crawl',
        validationCheck: item.validationCheck || 'Inspect HTML header or status',
        completed: false,
      }));
    }
    return fallbackTasks;
  } catch (err) {
    console.error('Error generating AI action plan:', err);
    return fallbackTasks;
  }
}

export async function generateAiKeywordOpportunities(
  url: string,
  seedKeywords: string[] = [],
  industry: string = ''
): Promise<KeywordIdea[]> {
  const ai = getAiClient();
  const domain = new URL(url).hostname;

  if (!ai) {
    return [
      {
        id: 'kw-1',
        keyword: seedKeywords[0] || `${domain} services`,
        intent: 'Commercial',
        targetUrl: url,
        suggestedContentType: 'Service / Landing Page',
        priority: 'high',
        rationale: 'Primary brand and topical offering match.',
        searchVolume: 'Not available (requires connected data provider)',
        difficulty: 'Not available',
        cpc: 'Not available',
        provider: 'AI Intent Analyzer',
      },
      {
        id: 'kw-2',
        keyword: `best ${industry || 'solutions'} guide`,
        intent: 'Informational',
        targetUrl: `${url}/blog`,
        suggestedContentType: 'Long-form Pillar Article',
        priority: 'medium',
        rationale: 'Top-of-funnel educational query to capture organic traffic.',
        searchVolume: 'Not available (requires connected data provider)',
        difficulty: 'Not available',
        cpc: 'Not available',
        provider: 'AI Intent Analyzer',
      },
    ];
  }

  try {
    const prompt = `
Generate 6 strategic keyword opportunities and topic ideas for the website: ${url}
Seeds provided: ${seedKeywords.join(', ') || 'None specified'}
Industry / Niche: ${industry || 'Extracted from domain'}

Rule: Do NOT invent search volume numbers, CPC dollar amounts, or keyword difficulty scores. Mark metrics as "Not available (requires data provider)". Focus on qualitative search intent, target page mapping, and content rationale.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              intent: { type: Type.STRING, description: 'Informational | Navigational | Commercial | Transactional' },
              suggestedContentType: { type: Type.STRING },
              priority: { type: Type.STRING, description: 'high | medium | low' },
              rationale: { type: Type.STRING },
            },
            required: ['keyword', 'intent', 'suggestedContentType', 'priority', 'rationale'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    return parsed.map((item: any, idx: number) => ({
      id: `kw-${idx + 1}`,
      keyword: item.keyword,
      intent: (['Informational', 'Navigational', 'Commercial', 'Transactional'].includes(item.intent) ? item.intent : 'Informational') as any,
      targetUrl: url,
      suggestedContentType: item.suggestedContentType,
      priority: (['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium') as any,
      rationale: item.rationale,
      searchVolume: 'Not available (requires connected data provider)',
      difficulty: 'Not available',
      cpc: 'Not available',
      provider: 'Gemini Intent Intelligence',
    }));
  } catch (err) {
    console.error('Error generating keywords:', err);
    return [];
  }
}

export async function askAiSeoAssistant(
  question: string,
  auditContext: {
    url: string;
    overallScore: number;
    pages: CrawledPage[];
    issues: SeoIssue[];
  },
  chatHistory: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    return 'The AI assistant requires GEMINI_API_KEY to be configured. You can still inspect all verified audit data, issues table, and technical findings in the dashboard.';
  }

  try {
    const summaryIssues = auditContext.issues.slice(0, 15).map(i => `[${i.id}] (${i.severity}) ${i.title} on ${i.pageUrl}. Evidence: ${i.evidence}. Fix: ${i.recommendation}`);
    const summaryPages = auditContext.pages.map(p => `${p.url} (status: ${p.statusCode}, title: "${p.title}", words: ${p.wordCount}, imagesNoAlt: ${p.imagesMissingAlt}, schema: ${p.structuredDataTypes.join(',') || 'none'})`);

    const systemInstruction = `
You are the AuditPulse Senior SEO Advisor. You are assisting an engineer or SEO specialist with the audit of ${auditContext.url}.
Current Audit Overview:
- Overall Score: ${auditContext.overallScore}/100
- Analyzed Pages:
${summaryPages.join('\n')}

- Top Verified Issues:
${summaryIssues.join('\n')}

STRICT RULES:
1. Always cite specific URLs, measured values, or finding IDs (e.g., [ISSUE-1]) from the audit data whenever applicable.
2. Clearly distinguish verified technical findings from AI recommendations.
3. NEVER invent backlink counts, ranking numbers, traffic metrics, or metrics not present in the audit.
4. Keep advice clear, actionable, professional, and grounded in modern search engine documentation and Core Web Vitals standards.
`;

    const contents = [
      ...chatHistory.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: question }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || 'No response generated from the model.';
  } catch (err: any) {
    console.error('Error in askAiSeoAssistant:', err);
    return `An error occurred while analyzing with Gemini: ${err.message || 'Please check service status'}`;
  }
}
