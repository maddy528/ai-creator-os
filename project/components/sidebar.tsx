'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Factory, Share2, BarChart3, Sparkles } from 'lucide-react';
import type { ViewName } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  active: ViewName;
  onNavigate: (view: ViewName) => void;
}

const NAV_ITEMS: { id: ViewName; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'factory', label: 'Content Factory', icon: Factory },
  { id: 'distribution', label: 'Distribution Hub', icon: Share2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-zinc-925">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-100">AI Creator OS</h1>
          <p className="text-[10px] text-zinc-500">Content Operating System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">Workspace</p>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn('relative h-4 w-4', isActive && 'text-indigo-400')} />
              <span className="relative font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-5 py-4">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-zinc-400">System Online</span>
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-600">Gemini API · Pollinations.ai</p>
        </div>
      </div>
    </aside>
  );
}
