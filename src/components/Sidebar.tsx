import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Server, 
  FileCode, 
  Zap, 
  ListFilter, 
  CalendarClock, 
  BrainCircuit, 
  KeyRound, 
  Users, 
  Link2, 
  MapPin, 
  Search,
  Settings
} from 'lucide-react';

export type NavTab = 
  | 'overview'
  | 'report'
  | 'technical'
  | 'onpage'
  | 'performance'
  | 'issues'
  | 'action_plan'
  | 'content_ai'
  | 'keywords'
  | 'competitors'
  | 'backlinks'
  | 'local_seo'
  | 'search_console'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  openIssuesCount: number;
  criticalIssuesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  openIssuesCount,
  criticalIssuesCount,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'report', label: 'Audit Report', icon: FileCheck2 },
    { id: 'issues', label: 'Issues & Tasks', icon: ListFilter, badge: openIssuesCount, badgeColor: criticalIssuesCount > 0 ? 'bg-rose-500' : 'bg-blue-600' },
    { id: 'action_plan', label: 'Action Plan (90D)', icon: CalendarClock },
    { id: 'technical', label: 'Technical SEO', icon: Server },
    { id: 'onpage', label: 'On-Page SEO', icon: FileCode },
    { id: 'performance', label: 'Core Web Vitals', icon: Zap },
    { id: 'content_ai', label: 'Content Quality AI', icon: BrainCircuit },
    { id: 'keywords', label: 'Keyword Explorer', icon: KeyRound },
    { id: 'competitors', label: 'Competitor Intel', icon: Users },
    { id: 'backlinks', label: 'Backlink Explorer', icon: Link2 },
    { id: 'local_seo', label: 'Local SEO', icon: MapPin },
    { id: 'search_console', label: 'Search Console', icon: Search },
    { id: 'settings', label: 'Settings & APIs', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0 select-none min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-slate-800/80">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          SEO Navigation
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${
                    item.badgeColor || 'bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-300">Engine v2.4</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live
          </span>
        </div>
        <p className="text-slate-400 text-[10px]">
          Verified live crawler & Gemini 3.8 intelligence.
        </p>
      </div>
    </aside>
  );
};
