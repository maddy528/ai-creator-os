'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

const METRICS = [
  { label: 'Total Reach', value: '142K', icon: Eye, color: 'text-indigo-400' },
  { label: 'Engagements', value: '28.4K', icon: Heart, color: 'text-pink-400' },
  { label: 'Comments', value: '3,210', icon: MessageCircle, color: 'text-cyan-400' },
  { label: 'Shares', value: '1,847', icon: Share2, color: 'text-emerald-400' },
];

const TOP_CONTENT = [
  { topic: '5 AI tools every creator needs', platform: 'Twitter', reach: '24.5K', engagement: '8.2%' },
  { topic: 'Building a SaaS in public', platform: 'LinkedIn', reach: '18.3K', engagement: '6.1%' },
  { topic: 'How we hit 10K followers', platform: 'TikTok', reach: '31.2K', engagement: '12.4%' },
  { topic: 'The future of content', platform: 'Instagram', reach: '15.7K', engagement: '5.8%' },
];

export function AnalyticsView() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Analytics</h2>
        <p className="text-[11px] text-zinc-500">Performance insights across all platforms</p>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-4">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <Icon className={`h-4 w-4 ${m.color}`} />
                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">{m.value}</p>
                <p className="text-[11px] text-zinc-500">{m.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 glass rounded-xl p-5"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-200">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Top Performing Content
          </h3>
          <div className="space-y-2">
            {TOP_CONTENT.map((item, i) => (
              <div key={i} className="grid grid-cols-4 items-center gap-3 rounded-lg border border-white/[0.04] px-3 py-2.5 hover:bg-white/[0.03] transition-colors">
                <span className="text-xs font-medium text-zinc-200">{item.topic}</span>
                <span className="text-[11px] text-zinc-500">{item.platform}</span>
                <span className="text-[11px] text-indigo-400">{item.reach} reach</span>
                <span className="text-[11px] text-emerald-400">{item.engagement} engagement</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
