'use client';

import { useState } from 'react';
import { Search, Bell, Command } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Dashboard } from '@/components/views/dashboard';
import { ContentFactory } from '@/components/views/content-factory';
import { MediaLibrary } from '@/components/views/media-library';
import { DistributionHub } from '@/components/views/distribution-hub';
import { Analytics } from '@/components/views/analytics';
import type { ViewId } from '@/lib/types';

const VIEW_TITLES: Record<ViewId, string> = {
  dashboard: 'Overview',
  'content-factory': 'Bulk CSV Generation',
  'media-library': 'Storage',
  distribution: 'Social Media Scheduling & Auto-Post',
  analytics: 'Performance Tracking',
};

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] rounded-full bg-indigo-700/5 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar active={activeView} onNavigate={setActiveView} />
      </div>

      {/* Main */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/[0.06] px-8 py-4 backdrop-blur-xl">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-600">
              {VIEW_TITLES[activeView]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                placeholder="Search..."
                className="h-9 w-56 rounded-lg border border-white/10 bg-white/5 pl-10 pr-12 text-sm text-white outline-none ring-indigo-500 placeholder:text-zinc-500 focus:ring-2"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-background" />
            </button>

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-semibold text-white">
              AC
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="scrollbar-thin flex-1 overflow-y-auto p-8">
          <div key={activeView} className="animate-fade-in">
            {activeView === 'dashboard' && <Dashboard onNavigate={setActiveView} />}
            {activeView === 'content-factory' && <ContentFactory />}
            {activeView === 'media-library' && <MediaLibrary />}
            {activeView === 'distribution' && <DistributionHub />}
            {activeView === 'analytics' && <Analytics />}
          </div>
        </main>
      </div>
    </div>
  );
}
