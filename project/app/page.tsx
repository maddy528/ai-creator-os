'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/sidebar';
import { ContentFactoryView } from '@/components/views/content-factory';
import { DashboardView } from '@/components/views/dashboard';
import { DistributionView } from '@/components/views/distribution';
import { AnalyticsView } from '@/components/views/analytics';
import type { ViewName } from '@/lib/types';

export default function Page() {
  const [view, setView] = useState<ViewName>('factory');

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar active={view} onNavigate={setView} />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {view === 'dashboard' && <DashboardView />}
            {view === 'factory' && <ContentFactoryView />}
            {view === 'distribution' && <DistributionView />}
            {view === 'analytics' && <AnalyticsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
