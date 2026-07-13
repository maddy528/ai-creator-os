'use client';

import {
  TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share2, Users,
  Instagram, Twitter, Youtube, Linkedin, ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Platform } from '@/lib/types';
import { PLATFORM_INFO } from '@/lib/data';

const STATS = [
  { label: 'Total Reach', value: '2.4M', change: '+24.1%', trend: 'up' as const, icon: Eye, color: 'text-sky-400' },
  { label: 'Engagement Rate', value: '6.8%', change: '+1.2%', trend: 'up' as const, icon: Heart, color: 'text-pink-400' },
  { label: 'Comments', value: '12.3K', change: '+18.5%', trend: 'up' as const, icon: MessageCircle, color: 'text-indigo-400' },
  { label: 'Shares', value: '4.7K', change: '-2.1%', trend: 'down' as const, icon: Share2, color: 'text-emerald-400' },
];

const ENGAGEMENT_DATA = [
  { month: 'Jan', value: 3.2 },
  { month: 'Feb', value: 4.1 },
  { month: 'Mar', value: 3.8 },
  { month: 'Apr', value: 5.2 },
  { month: 'May', value: 5.9 },
  { month: 'Jun', value: 6.4 },
  { month: 'Jul', value: 6.8 },
];

const PLATFORM_PERF: { platform: Platform; posts: number; engagement: number; reach: string; trend: 'up' | 'down' }[] = [
  { platform: 'instagram', posts: 248, engagement: 7.2, reach: '1.2M', trend: 'up' },
  { platform: 'tiktok', posts: 186, engagement: 8.4, reach: '890K', trend: 'up' },
  { platform: 'twitter', posts: 312, engagement: 4.1, reach: '420K', trend: 'down' },
  { platform: 'linkedin', posts: 64, engagement: 5.6, reach: '180K', trend: 'up' },
  { platform: 'youtube', posts: 42, engagement: 6.9, reach: '340K', trend: 'up' },
];

const TOP_POSTS = [
  { title: '5 AI Tools That Will Transform Your Content Workflow', platform: 'instagram' as const, likes: '24.2K', comments: '1.2K', shares: '3.4K' },
  { title: 'Why Automation Beats Manual Posting — Proof Inside', platform: 'tiktok' as const, likes: '18.7K', comments: '892', shares: '5.1K' },
  { title: 'The Future of Social Media Marketing is AI-Powered', platform: 'linkedin' as const, likes: '8.4K', comments: '624', shares: '1.8K' },
  { title: 'AI Content Workflow Breakdown — Full Thread', platform: 'twitter' as const, likes: '12.1K', comments: '438', shares: '2.9K' },
];

export function Analytics() {
  const maxEng = Math.max(...ENGAGEMENT_DATA.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Analytics</h2>
          <p className="mt-1 text-sm text-zinc-500">Track performance across every platform and campaign.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-white/10 text-zinc-400">Last 30 days</Badge>
          <Badge variant="secondary" className="glass border-white/10 text-emerald-400">
            <TrendingUp className="mr-1 h-3 w-3" />
            +24.1% vs prev
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card
              key={stat.label}
              className="glass-card glass-hover p-5 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-white/5', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn('flex items-center gap-0.5 text-xs font-semibold', stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400')}>
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

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Engagement chart */}
        <Card className="glass-card col-span-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Engagement Rate Trend</p>
              <p className="mt-0.5 text-xs text-zinc-500">Monthly average across all platforms</p>
            </div>
            <Badge variant="outline" className="border-white/10 text-indigo-400">
              <Users className="mr-1 h-3 w-3" />
              6.8% avg
            </Badge>
          </div>
          {/* Line chart */}
          <div className="relative h-56">
            <svg className="h-full w-full" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(243 75% 59%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(243 75% 59%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="white" strokeOpacity="0.05" />
              ))}
              {/* Area */}
              <path
                d={`M 0 ${200 - (ENGAGEMENT_DATA[0].value / maxEng) * 180} ${ENGAGEMENT_DATA.map((d, i) => {
                  const x = (i / (ENGAGEMENT_DATA.length - 1)) * 700;
                  const y = 200 - (d.value / maxEng) * 180;
                  return `L ${x} ${y}`;
                }).join(' ')} L 700 200 L 0 200 Z`}
                fill="url(#engGrad)"
              />
              {/* Line */}
              <path
                d={`M 0 ${200 - (ENGAGEMENT_DATA[0].value / maxEng) * 180} ${ENGAGEMENT_DATA.map((d, i) => {
                  const x = (i / (ENGAGEMENT_DATA.length - 1)) * 700;
                  const y = 200 - (d.value / maxEng) * 180;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="hsl(243 75% 59%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {ENGAGEMENT_DATA.map((d, i) => {
                const x = (i / (ENGAGEMENT_DATA.length - 1)) * 700;
                const y = 200 - (d.value / maxEng) * 180;
                return (
                  <circle key={i} cx={x} cy={y} r="4" fill="hsl(243 75% 59%)" stroke="hsl(240 6% 6%)" strokeWidth="2" className="transition-all hover:r-6" />
                );
              })}
            </svg>
            {/* Month labels */}
            <div className="mt-2 flex justify-between px-1">
              {ENGAGEMENT_DATA.map((d) => (
                <span key={d.month} className="text-[10px] text-zinc-600">{d.month}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Platform breakdown */}
        <Card className="glass-card p-6">
          <p className="mb-4 text-sm font-semibold text-white">Platform Performance</p>
          <div className="space-y-4">
            {PLATFORM_PERF.map((p) => (
              <div key={p.platform} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', PLATFORM_INFO[p.platform].bg)}>
                      <PlatformIcon platform={p.platform} className={cn('h-3.5 w-3.5', PLATFORM_INFO[p.platform].color)} />
                    </div>
                    <span className="text-xs font-medium text-white">{PLATFORM_INFO[p.platform].name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">{p.engagement}%</span>
                    {p.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all"
                    style={{ width: `${(p.engagement / 8.4) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-600">
                  <span>{p.posts} posts</span>
                  <span>{p.reach} reach</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top posts */}
      <Card className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Top Performing Posts</p>
          <button className="flex items-center gap-1 text-xs text-indigo-400 hover:underline">
            View all
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {TOP_POSTS.map((post, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]"
            >
              <span className="text-lg font-bold text-zinc-700">#{i + 1}</span>
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', PLATFORM_INFO[post.platform].bg)}>
                <PlatformIcon platform={post.platform} className={cn('h-4 w-4', PLATFORM_INFO[post.platform].color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{post.title}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">{PLATFORM_INFO[post.platform].name}</p>
              </div>
              <div className="hidden items-center gap-4 sm:flex">
                <Metric icon={Heart} value={post.likes} />
                <Metric icon={MessageCircle} value={post.comments} />
                <Metric icon={Share2} value={post.shares} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, value }: { icon: typeof Heart; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-zinc-500" />
      <span className="text-xs text-zinc-400">{value}</span>
    </div>
  );
}

function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  switch (platform) {
    case 'instagram': return <Instagram className={className} />;
    case 'tiktok': return <Youtube className={className} />;
    case 'twitter': return <Twitter className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'youtube': return <Youtube className={className} />;
  }
}
