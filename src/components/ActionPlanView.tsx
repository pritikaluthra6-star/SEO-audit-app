import React, { useState } from 'react';
import { ActionPlanTask, AuditResult } from '../types/seo';
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { exportActionPlanToCsv } from '../utils/exportUtils';

interface ActionPlanViewProps {
  tasks: ActionPlanTask[];
  targetUrl: string;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  tasks: initialTasks,
  targetUrl,
}) => {
  const [tasks, setTasks] = useState<ActionPlanTask[]>(initialTasks);
  const [activeTimeframe, setActiveTimeframe] = useState<ActionPlanTask['timeframe']>('days_1_7');

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const timeframeLabels: Record<ActionPlanTask['timeframe'], { title: string; subtitle: string; badge: string }> = {
    days_1_7: {
      title: 'Days 1–7: Urgent Technical Fixes',
      subtitle: 'Immediate remediation of critical blockers, broken indexing, and core performance leaks.',
      badge: 'Sprint 1',
    },
    days_8_30: {
      title: 'Days 8–30: On-Page Optimization',
      subtitle: 'Systematic enhancements to title tags, meta descriptions, image alts, and mobile tweaks.',
      badge: 'Sprint 2',
    },
    days_31_60: {
      title: 'Days 31–60: Structural & Schema Growth',
      subtitle: 'Structured data deployment, contextual internal link hubs, and content depth expansion.',
      badge: 'Sprint 3',
    },
    days_61_90: {
      title: 'Days 61–90: Authority & Long-Term Scaling',
      subtitle: 'Topical authority clusters, evergreen guide development, and continuous crawl auditing.',
      badge: 'Sprint 4',
    },
  };

  const currentTasks = tasks.filter((t) => t.timeframe === activeTimeframe);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-indigo-400" />
            <span>90-Day Prioritized SEO Strategic Action Plan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Phased implementation roadmap grounded directly in your verified audit findings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Progress: <strong className="text-emerald-400">{completedCount}</strong> of {tasks.length} Completed
          </div>

          <button
            onClick={() => exportActionPlanToCsv(tasks, targetUrl)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Action Plan</span>
          </button>
        </div>
      </div>

      {/* Timeframe Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['days_1_7', 'days_8_30', 'days_31_60', 'days_61_90'] as ActionPlanTask['timeframe'][]).map((tf) => {
          const tfTasks = tasks.filter((t) => t.timeframe === tf);
          const tfDone = tfTasks.filter((t) => t.completed).length;
          const isActive = activeTimeframe === tf;

          return (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 mb-2 inline-block">
                  {timeframeLabels[tf].badge}
                </span>
                <div className="font-bold text-xs text-white mt-1">
                  {tf === 'days_1_7' ? 'Days 1–7' : tf === 'days_8_30' ? 'Days 8–30' : tf === 'days_31_60' ? 'Days 31–60' : 'Days 61–90'}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{tfTasks.length} Action Items</span>
                <span className={tfDone === tfTasks.length && tfTasks.length > 0 ? 'text-emerald-400 font-bold' : ''}>
                  {tfDone}/{tfTasks.length} Done
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Timeframe Content Header */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {timeframeLabels[activeTimeframe].title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {timeframeLabels[activeTimeframe].subtitle}
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {currentTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
            No specific tasks assigned for this phase. All priorities cleared!
          </div>
        ) : (
          currentTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition ${
                task.completed
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition flex-shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950 hover:border-slate-500 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : task.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {task.priority}
                      </span>

                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        Effort: {task.effort}
                      </span>

                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded capitalize">
                        {task.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-400">Diagnosis rationale:</strong> {task.reason}
                    </p>

                    {task.affectedUrl && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <span>Affected URL:</span>
                        <a href={task.affectedUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate max-w-md">
                          {task.affectedUrl}
                        </a>
                      </div>
                    )}

                    {/* Step-by-step implementation instructions */}
                    {task.steps && task.steps.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-semibold text-slate-400 mb-1">
                          Implementation Protocol:
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                          {task.steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Validation & Metric */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] text-slate-400 border-t border-slate-850">
                      <div>
                        <strong className="text-slate-300">Success metric:</strong> {task.measurementMetric}
                      </div>
                      <div className="hidden sm:inline">•</div>
                      <div>
                        <strong className="text-slate-300">Verification check:</strong> {task.validationCheck}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
