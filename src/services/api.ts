import { AuditConfig, AuditResult, AuditHistorySummary, IssueStatus, CoreWebVitalsData } from '../types/seo';

export async function startAudit(config: AuditConfig): Promise<AuditResult> {
  const res = await fetch('/api/audits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }
  return res.json();
}

export async function getAudit(id: string): Promise<AuditResult> {
  const res = await fetch(`/api/audits/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load audit ${id}`);
  }
  return res.json();
}

export async function getRecentAudits(): Promise<AuditHistorySummary[]> {
  try {
    const res = await fetch('/api/audits');
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function updateIssueStatus(
  auditId: string,
  issueId: string,
  status: IssueStatus
): Promise<boolean> {
  try {
    const res = await fetch(`/api/audits/${auditId}/issues/${issueId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function askAssistant(
  auditId: string,
  question: string,
  history: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<string> {
  const res = await fetch(`/api/audits/${auditId}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to reach AI assistant');
  }
  const data = await res.json();
  return data.answer;
}

export async function uploadBacklinksCsv(
  auditId: string,
  records: any[],
  filename: string
): Promise<any> {
  const res = await fetch(`/api/audits/${auditId}/backlinks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records, filename }),
  });
  if (!res.ok) {
    throw new Error('Failed to upload backlinks CSV');
  }
  return res.json();
}

export async function runPageSpeed(
  url: string,
  device: 'mobile' | 'desktop'
): Promise<CoreWebVitalsData> {
  const res = await fetch('/api/integrations/pagespeed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, device }),
  });
  if (!res.ok) {
    throw new Error('PageSpeed analysis failed');
  }
  return res.json();
}
