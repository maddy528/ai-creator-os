'use client';

import { useState } from 'react';
import {
  Send, Calendar, Clock, CheckCircle2, Instagram, Twitter, Youtube, Linkedin,
  Zap, Settings, Plus, Filter, ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Platform, PostStatus } from '@/lib/types';
import { PLATFORM_INFO, randomStockImage } from '@/lib/data';

interface ScheduledPost {
  id: string;
  caption: string;
  platform: Platform;
  scheduledAt: string;
  status: PostStatus;
  model: string;
}

const SCHEDULED: ScheduledPost[] = [
  { id: '1', caption: '5 AI tools that will transform your content workflow in 2025', platform: 'instagram', scheduledAt: 'Today · 6:00 PM', status: 'scheduled', model: 'Gemini' },
  { id: '2', caption: 'Why automation beats manual posting — here\'s the proof', platform: 'tiktok', scheduledAt: 'Today · 8:00 PM', status: 'scheduled', model: 'GPT-4' },
  { id: '3', caption: 'The future of social media marketing is AI-powered', platform: 'linkedin', scheduledAt: 'Tomorrow · 9:00 AM', status: 'scheduled', model: 'Claude' },
  { id: '4', caption: 'AI content workflow breakdown — thread', platform: 'twitter', scheduledAt: 'Tomorrow · 12:00 PM', status: 'scheduled', model: 'Gemini' },
  { id: '5', caption: 'Best AI tools for creators 2025 — full video', platform: 'youtube', scheduledAt: 'Jul 15 · 10:00 AM', status: 'scheduled', model: 'GPT-4' },
  { id: '6', caption: 'Building a content engine with AI — case study', platform: 'instagram', scheduledAt: 'Jul 15 · 3:00 PM', status: 'draft', model: 'Claude' },
  { id: '7', caption: 'Stop posting manually. Start posting strategically.', platform: 'tiktok', scheduledAt: 'Jul 16 · 7:00 PM', status: 'scheduled', model: 'Gemini' },
];

const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'];

const STATUS_STYLES: Record<PostStatus, { label: string; color: string; dot: string }> = {
  draft: { label: 'Draft', color: 'text-zinc-400', dot: 'bg-zinc-500' },
  scheduled: { label: 'Scheduled', color: 'text-amber-400', dot: 'bg-amber-400' },
  published: { label: 'Published', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  failed: { label: 'Failed', color: 'text-red-400', dot: 'bg-red-400' },
};

const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const POST_DAYS: Record<number, number> = { 13: 2, 14: 3, 15: 2, 16: 1, 17: 1, 18: 3, 20: 1, 22: 2, 25: 1, 27: 2 };

export function DistributionHub() {
  const [filter, setFilter] = useState<'all' | PostStatus>('all');
  const [selectedDay, setSelectedDay] = useState(13);

  const filtered = filter === 'all' ? SCHEDULED : SCHEDULED.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold text-white">Distribution Hub</h2>
            <Badge className="bg-emerald-500/15 text-emerald-400">New</Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Schedule and auto-post your content across every social platform.
          </p>
        </div>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Scheduled" value="24" color="text-amber-400" />
        <StatCard icon={CheckCircle2} label="Published This Week" value="18" color="text-emerald-400" />
        <StatCard icon={Send} label="Auto-Post Active" value="5" color="text-indigo-400" />
        <StatCard icon={Zap} label="Avg. Queue Time" value="2.4h" color="text-sky-400" />
      </div>

      {/* Connected platforms */}
      <Card className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-semibold text-white">Connected Platforms</p>
          </div>
          <Badge variant="outline" className="border-white/10 text-zinc-400">5 / 5 connected</Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <div key={p} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', PLATFORM_INFO[p].bg)}>
                <PlatformIcon platform={p} className={cn('h-4 w-4', PLATFORM_INFO[p].color)} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">{PLATFORM_INFO[p].name}</p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-zinc-500">Connected</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Queue */}
        <div className="space-y-4">
          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            {(['all', 'scheduled', 'draft', 'published'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all',
                  filter === f ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Queue list */}
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <Card
                key={post.id}
                className="glass-card glass-hover group p-4 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <img src={randomStockImage(Number(post.id))} alt="" className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold', PLATFORM_INFO[post.platform].bg, PLATFORM_INFO[post.platform].color)}>
                        {PLATFORM_INFO[post.platform].name}
                      </span>
                      <span className="text-[10px] text-zinc-600">via {post.model}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_STYLES[post.status].dot)} />
                        <span className={cn('text-[10px] font-medium', STATUS_STYLES[post.status].color)}>
                          {STATUS_STYLES[post.status].label}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-zinc-200">{post.caption}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {post.scheduledAt}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="sticky top-4">
          <Card className="glass-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">July 2025</p>
              <div className="flex gap-1">
                <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-zinc-400 hover:bg-white/10">‹</button>
                <button className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-zinc-400 hover:bg-white/10">›</button>
              </div>
            </div>

            {/* Day labels */}
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-600">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {CALENDAR_DAYS.map((day) => {
                const postCount = POST_DAYS[day] || 0;
                const isSelected = selectedDay === day;
                const isToday = day === 13;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      'relative flex h-9 flex-col items-center justify-center rounded-lg text-xs transition-all',
                      isSelected ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-white/5',
                      isToday && !isSelected && 'ring-1 ring-indigo-500/30'
                    )}
                  >
                    <span>{day}</span>
                    {postCount > 0 && (
                      <span className={cn(
                        'absolute bottom-1 h-1 w-1 rounded-full',
                        isSelected ? 'bg-white' : 'bg-indigo-400'
                      )} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Day detail */}
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <p className="text-xs font-medium text-zinc-400">
                July {selectedDay} · {POST_DAYS[selectedDay] || 0} posts
              </p>
              <div className="mt-2 space-y-2">
                {(POST_DAYS[selectedDay] ? Array.from({ length: POST_DAYS[selectedDay] }) : []).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.02] p-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span className="text-[11px] text-zinc-400">Scheduled post {i + 1}</span>
                    <ArrowRight className="ml-auto h-3 w-3 text-zinc-600" />
                  </div>
                ))}
                {(!POST_DAYS[selectedDay]) && (
                  <p className="py-4 text-center text-[11px] text-zinc-600">No posts scheduled</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Calendar; label: string; value: string; color: string }) {
  return (
    <Card className="glass-card glass-hover p-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-white/5', color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">{value}</p>
          <p className="text-[11px] text-zinc-500">{label}</p>
        </div>
      </div>
    </Card>
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
