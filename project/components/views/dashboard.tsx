'use client';

import {
  TrendingUp, TrendingDown, FileText, Send, Eye, Heart, ArrowUpRight,
  Sparkles, Clock, Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/lib/types';
import { PLATFORM_INFO, randomStockImage } from '@/lib/data';

interface DashboardProps {
  onNavigate: (view: ViewId) => void;
}

const STATS = [
  { label: 'Content Generated', value: '1,284', change: '+12.5%', trend: 'up', icon: FileText, color: 'text-indigo-400' },
  { label: 'Posts Published', value: '847', change: '+8.2%', trend: 'up', icon: Send, color: 'text-emerald-400' },
  { label: 'Total Reach', value: '2.4M', change: '+24.1%', trend: 'up', icon: Eye, color: 'text-sky-400' },
  { label: 'Avg. Engagement', value: '6.8%', change: '-1.3%', trend: 'down', icon: Heart, color: 'text-pink-400' },
];

const RECENT_ACTIVITY = [
  { action: 'Generated 50 posts via CSV', time: '2 min ago', type: 'generate' },
  { action: 'Scheduled 12 posts for Instagram', time: '15 min ago', type: 'schedule' },
  { action: 'Published 3 posts on TikTok', time: '1 hour ago', type: 'publish' },
  { action: 'Uploaded 8 new media assets', time: '3 hours ago', type: 'upload' },
  { action: 'Generated 25 posts via CSV', time: '5 hours ago', type: 'generate' },
];

const UPCOMING = [
  { platform: 'instagram' as const, time: 'Today · 6:00 PM', title: '5 AI Tools for Content Creators' },
  { platform: 'tiktok' as const, time: 'Today · 8:00 PM', title: 'Why Automation Beats Manual Posting' },
  { platform: 'linkedin' as const, time: 'Tomorrow · 9:00 AM', title: 'The Future of Social Media Marketing' },
  { platform: 'twitter' as const, time: 'Tomorrow · 12:00 PM', title: 'AI Content Workflow Breakdown' },
];

const WEEK_DATA = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 68 },
  { day: 'Wed', value: 52 },
  { day: 'Thu', value: 84 },
  { day: 'Fri', value: 96 },
  { day: 'Sat', value: 72 },
  { day: 'Sun', value: 61 },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const maxVal = Math.max(...WEEK_DATA.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-zinc-500">Your content automation overview at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="glass border-white/10 text-zinc-300">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            All systems operational
          </Badge>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card
              key={stat.label}
              className="glass-card glass-hover group p-5 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-white/5', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  'flex items-center gap-0.5 text-xs font-semibold',
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                )}>
                  <TrendIcon className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly chart */}
        <Card className="glass-card col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Content Output This Week</p>
              <p className="mt-0.5 text-xs text-zinc-500">Posts generated per day</p>
            </div>
            <Badge variant="outline" className="border-white/10 text-zinc-400">
              <Zap className="mr-1 h-3 w-3 text-indigo-400" />
              478 total
            </Badge>
          </div>
          <div className="flex h-48 items-end justify-between gap-3">
            {WEEK_DATA.map((d, i) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="group relative w-full overflow-hidden rounded-t-lg bg-gradient-to-t from-indigo-600/40 to-indigo-400 transition-all duration-500 hover:from-indigo-500/60 hover:to-indigo-300"
                    style={{ height: `${(d.value / maxVal) * 100}%`, animationDelay: `${i * 80}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
                <span className="text-[11px] text-zinc-500">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming */}
        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-semibold text-white">Upcoming Posts</p>
          </div>
          <div className="space-y-3">
            {UPCOMING.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', PLATFORM_INFO[item.platform].bg)}>
                  <PlatformDot platform={item.platform} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('distribution')}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-indigo-400 transition-colors hover:bg-indigo-500/10"
          >
            View all scheduled
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-semibold text-white">Quick Actions</p>
          </div>
          <div className="space-y-2">
            <ActionRow label="New CSV Generation" icon={FileText} onClick={() => onNavigate('content-factory')} />
            <ActionRow label="Schedule Posts" icon={Send} onClick={() => onNavigate('distribution')} />
            <ActionRow label="View Analytics" icon={TrendingUp} onClick={() => onNavigate('analytics')} />
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="glass-card col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent Activity</p>
            <button className="text-xs text-indigo-400 hover:underline">View all</button>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/[0.02]">
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  activity.type === 'generate' && 'bg-indigo-500/10',
                  activity.type === 'schedule' && 'bg-amber-500/10',
                  activity.type === 'publish' && 'bg-emerald-500/10',
                  activity.type === 'upload' && 'bg-sky-500/10',
                )}>
                  <div className={cn(
                    'h-2 w-2 rounded-full',
                    activity.type === 'generate' && 'bg-indigo-400',
                    activity.type === 'schedule' && 'bg-amber-400',
                    activity.type === 'publish' && 'bg-emerald-400',
                    activity.type === 'upload' && 'bg-sky-400',
                  )} />
                </div>
                <p className="flex-1 text-sm text-zinc-300">{activity.action}</p>
                <span className="text-xs text-zinc-600">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Storage */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Media Storage</p>
              <p className="text-xs text-zinc-500">12.4 GB of 50 GB used</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('media-library')}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:underline"
          >
            Manage
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="mt-4">
          <Progress value={24.8} className="h-2 bg-white/5" />
        </div>
      </Card>
    </div>
  );
}

function ActionRow({ label, icon: Icon, onClick }: { label: string; icon: typeof FileText; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-indigo-500/20 hover:bg-indigo-500/5"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-indigo-400 transition-colors group-hover:bg-indigo-500/10">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-left text-sm text-zinc-300 group-hover:text-white">{label}</span>
      <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-indigo-400" />
    </button>
  );
}

function PlatformDot({ platform }: { platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'youtube' }) {
  return (
    <div className={cn('h-2.5 w-2.5 rounded-full', PLATFORM_INFO[platform].color.replace('text-', 'bg-'))} />
  );
}
