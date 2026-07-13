'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, FileText, Image as ImageIcon, Zap, ArrowUpRight } from 'lucide-react';

const STATS = [
  { label: 'Posts Generated', value: '1,247', change: '+12%', icon: FileText, color: 'text-indigo-400' },
  { label: 'Images Created', value: '892', change: '+8%', icon: ImageIcon, color: 'text-cyan-400' },
  { label: 'Avg. Processing', value: '2.3s', change: '-15%', icon: Zap, color: 'text-amber-400' },
  { label: 'Engagement Rate', value: '6.4%', change: '+2.1%', icon: TrendingUp, color: 'text-emerald-400' },
];

const RECENT = [
  { topic: 'Building a SaaS in public', platform: 'Twitter', status: 'completed' },
  { topic: '5 AI tools for creators', platform: 'Instagram', status: 'completed' },
  { topic: 'The future of content marketing', platform: 'LinkedIn', status: 'completed' },
  { topic: 'How we hit 10K followers', platform: 'TikTok', status: 'completed' },
  { topic: 'Why authenticity wins', platform: 'Twitter', status: 'completed' },
];

export function DashboardView() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Dashboard</h2>
        <p className="text-[11px] text-zinc-500">Overview of your AI content operations</p>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">{stat.value}</p>
                <p className="text-[11px] text-zinc-500">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 glass rounded-xl p-5"
        >
          <h3 className="mb-4 text-sm font-medium text-zinc-200">Recent Generations</h3>
          <div className="space-y-2">
            {RECENT.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.04] px-3 py-2.5 hover:bg-white/[0.03] transition-colors">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-200">{item.topic}</p>
                  <p className="text-[10px] text-zinc-500">{item.platform}</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">Completed</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
