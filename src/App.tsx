import React, { useState, useEffect } from 'react';
import { AuditResult, AuditConfig, IssueStatus } from './types/seo';
import { DEMO_AUDIT_DATA } from './data/demoAudit';
import { startAudit, updateIssueStatus } from './services/api';
import { exportIssuesToCsv } from './utils/exportUtils';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AuditReportView } from './components/AuditReportView';
import { TechnicalSeoView } from './components/TechnicalSeoView';
import { OnPageSeoView } from './components/OnPageSeoView';
import { CoreWebVitalsView } from './components/CoreWebVitalsView';
import { IssuesTableView } from './components/IssuesTableView';
import { ActionPlanView } from './components/ActionPlanView';
import { ContentAiView } from './components/ContentAiView';
import { KeywordModuleView } from './components/KeywordModuleView';
import { CompetitorView } from './components/CompetitorView';
import { BacklinksView } from './components/BacklinksView';
import { LocalSeoView } from './components/LocalSeoView';
import { SearchConsoleView } from './components/SearchConsoleView';
import { SettingsView } from './components/SettingsView';
import { AuditSetupModal } from './components/AuditSetupModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { PrintReportView } from './components/PrintReportView';
import { LandingHero } from './components/LandingHero';

export default function App() {
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(DEMO_AUDIT_DATA);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [auditErrorMessage, setAuditErrorMessage] = useState('');

  const handleStartNewAudit = async (config: AuditConfig) => {
    setIsSubmittingAudit(true);
    setAuditErrorMessage('');
    setStatusMessage('Validating destination URL and executing SSRF safety checks...');

    try {
      setTimeout(() => setStatusMessage('Crawling pages and discovering internal link graph...'), 1500);
      setTimeout(() => setStatusMessage('Extracting HTML metadata and testing canonical consistency...'), 3500);
      setTimeout(() => setStatusMessage('Evaluating Core Web Vitals and querying Gemini 3.8 Flash...'), 5500);

      const result = await startAudit(config);
      setCurrentAudit(result);
      setActiveTab('overview');
      setIsSetupModalOpen(false);
    } catch (err: any) {
      setAuditErrorMessage(err.message || 'Audit execution failed. Please verify the domain is online and accessible.');
    } finally {
      setIsSubmittingAudit(false);
      setStatusMessage('');
    }
  };

  const handleQuickStartFromHero = (url: string) => {
    handleStartNewAudit({
      url,
      auditDepth: 'standard',
      maxPages: 5,
      device: 'mobile',
      enablePageSpeed: true,
      targetCountry: 'United States (US)',
      targetLanguage: 'English (en)',
    });
  };

  const handleUpdateIssueStatus = async (issueId: string, status: IssueStatus) => {
    if (!currentAudit) return;
    const updatedIssues = currentAudit.issues.map((i) =>
      i.id === issueId ? { ...i, status } : i
    );
    setCurrentAudit({
      ...currentAudit,
      issues: updatedIssues,
    });
    await updateIssueStatus(currentAudit.id, issueId, status);
  };

  const openIssuesCount = currentAudit
    ? currentAudit.issues.filter((i) => i.status === 'open' || i.status === 'in_progress').length
    : 0;

  const criticalIssuesCount = currentAudit
    ? currentAudit.issues.filter((i) => i.severity === 'critical' && i.status !== 'fixed').length
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentAudit={currentAudit}
        onOpenNewAudit={() => setIsSetupModalOpen(true)}
        onLoadDemo={() => {
          setCurrentAudit(DEMO_AUDIT_DATA);
          setActiveTab('overview');
        }}
        onOpenAiAssistant={() => setIsAssistantOpen(true)}
        onOpenPrintReport={() => setIsPrintReportOpen(true)}
        onExportCsv={() => {
          if (currentAudit) {
            exportIssuesToCsv(currentAudit.issues, currentAudit.url);
          }
        }}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {currentAudit ? (
          <>
            {/* Left Sidebar */}
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              openIssuesCount={openIssuesCount}
              criticalIssuesCount={criticalIssuesCount}
            />

            {/* Central Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950 max-w-7xl">
              {activeTab === 'overview' && (
                <DashboardView
                  audit={currentAudit}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenNewAudit={() => setIsSetupModalOpen(true)}
                />
              )}

              {activeTab === 'report' && (
                <AuditReportView
                  audit={currentAudit}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenPrintReport={() => setIsPrintReportOpen(true)}
                />
              )}

              {activeTab === 'technical' && (
                <TechnicalSeoView audit={currentAudit} />
              )}

              {activeTab === 'onpage' && (
                <OnPageSeoView audit={currentAudit} />
              )}

              {activeTab === 'performance' && (
                <CoreWebVitalsView
                  initialData={currentAudit.coreWebVitals}
                  targetUrl={currentAudit.url}
                />
              )}

              {activeTab === 'issues' && (
                <IssuesTableView
                  issues={currentAudit.issues}
                  targetUrl={currentAudit.url}
                  onUpdateStatus={handleUpdateIssueStatus}
                />
              )}

              {activeTab === 'action_plan' && (
                <ActionPlanView
                  tasks={currentAudit.actionPlan}
                  targetUrl={currentAudit.url}
                />
              )}

              {activeTab === 'content_ai' && (
                <ContentAiView audit={currentAudit} />
              )}

              {activeTab === 'keywords' && (
                <KeywordModuleView
                  keywords={currentAudit.keywords}
                  targetUrl={currentAudit.url}
                />
              )}

              {activeTab === 'competitors' && (
                <CompetitorView
                  competitors={currentAudit.competitors}
                  targetUrl={currentAudit.url}
                />
              )}

              {activeTab === 'backlinks' && (
                <BacklinksView
                  audit={currentAudit}
                  onRefreshAudit={(updated) => setCurrentAudit(updated)}
                />
              )}

              {activeTab === 'local_seo' && (
                <LocalSeoView audit={currentAudit} />
              )}

              {activeTab === 'search_console' && (
                <SearchConsoleView audit={currentAudit} />
              )}

              {activeTab === 'settings' && (
                <SettingsView audit={currentAudit} />
              )}
            </main>
          </>
        ) : (
          /* Empty Landing State if no audit loaded */
          <main className="flex-1 overflow-y-auto">
            <LandingHero
              onQuickStart={handleQuickStartFromHero}
              onLoadDemo={() => {
                setCurrentAudit(DEMO_AUDIT_DATA);
                setActiveTab('overview');
              }}
            />
          </main>
        )}
      </div>

      {/* Audit Setup Modal */}
      <AuditSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => {
          setIsSetupModalOpen(false);
          setAuditErrorMessage('');
        }}
        onSubmit={handleStartNewAudit}
        isSubmitting={isSubmittingAudit}
        statusMessage={statusMessage}
        errorMessage={auditErrorMessage}
      />

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        audit={currentAudit}
      />

      {/* Printable Report View */}
      {isPrintReportOpen && currentAudit && (
        <PrintReportView
          audit={currentAudit}
          onClose={() => setIsPrintReportOpen(false)}
        />
      )}
    </div>
  );
}
