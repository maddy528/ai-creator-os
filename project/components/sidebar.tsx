'use client';

import { LayoutDashboard, Factory, Image, Send, BarChart3, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/lib/types';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content-factory', label: 'Content Factory', icon: Factory, badge: 'AI' },
  { id: 'media-library', label: 'Media Library', icon: Image },
  { id: 'distribution', label: 'Distribution Hub', icon: Send, badge: 'New' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

interface SidebarProps {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 glow-primary">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-base font-bold tracking-tight text-white">
            AI Creator OS
          </h1>
          <p className="text-[11px] text-zinc-500">Content Automation Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                isActive
                  ? 'bg-indigo-500/10 text-white ring-1 ring-indigo-500/20'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              )}
            >
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
                )}
              />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                    item.badge === 'New'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-indigo-500/15 text-indigo-400'
                  )}
                >
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />}
            </button>
          );
        })}
      </nav>

      {/* Usage card */}
      <div className="px-3 pb-4">
        <div className="glass-card overflow-hidden p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">Credits</span>
            <span className="text-xs text-indigo-400">2,450 / 5,000</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all"
              style={{ width: '49%' }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-zinc-500">Resets in 12 days</p>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-sm font-semibold text-white">
          AC
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-200">Alex Chen</p>
          <p className="text-[11px] text-zinc-500">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
}
