'use client';

import { motion } from 'framer-motion';
import { Share2, Send, Calendar, Clock, CircleCheck as CheckCircle2 } from 'lucide-react';

const PLATFORMS = [
  { name: 'Instagram', posts: 24, scheduled: 8, color: 'from-pink-500 to-purple-500' },
  { name: 'TikTok', posts: 18, scheduled: 5, color: 'from-zinc-700 to-black' },
  { name: 'LinkedIn', posts: 12, scheduled: 3, color: 'from-blue-600 to-blue-700' },
  { name: 'Twitter/X', posts: 31, scheduled: 12, color: 'from-zinc-700 to-zinc-900' },
];

export function DistributionView() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Distribution Hub</h2>
        <p className="text-[11px] text-zinc-500">Schedule and publish across platforms</p>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5"
            >
              <div className={`mb-3 h-10 w-10 rounded-lg bg-gradient-to-br ${p.color}`} />
              <p className="text-sm font-semibold text-zinc-100">{p.name}</p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1"><Send className="h-3 w-3" /> {p.posts} posts</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.scheduled} scheduled</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 glass rounded-xl p-5"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Clock className="h-4 w-4 text-indigo-400" />
            Upcoming Schedule
          </h3>
          <div className="space-y-2">
            {['Today 2:00 PM - Instagram Post', 'Today 6:00 PM - TikTok Reel', 'Tomorrow 9:00 AM - LinkedIn Article', 'Tomorrow 12:00 PM - Twitter Thread'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.04] px-3 py-2.5 hover:bg-white/[0.03] transition-colors">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
