'use client';

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform } from '@/lib/types';
import { PLATFORM_INFO, randomStockImage } from '@/lib/data';

interface PhonePreviewProps {
  platform: Platform;
  caption: string;
  hashtags: string[];
  index: number;
}

export function PhonePreview({ platform, caption, hashtags, index }: PhonePreviewProps) {
  const info = PLATFORM_INFO[platform];
  const image = randomStockImage(index);

  return (
    <div className="relative mx-auto w-[280px]">
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[3px] border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-zinc-800" />

        {/* Screen */}
        <div className="relative h-[540px] overflow-hidden rounded-[2rem] bg-black">
          {platform === 'instagram' && <InstagramUI caption={caption} hashtags={hashtags} image={image} />}
          {platform === 'tiktok' && <TikTokUI caption={caption} hashtags={hashtags} image={image} />}
          {platform === 'twitter' && <TwitterUI caption={caption} hashtags={hashtags} image={image} />}
          {platform === 'linkedin' && <LinkedInUI caption={caption} hashtags={hashtags} image={image} />}
          {platform === 'youtube' && <YouTubeUI caption={caption} hashtags={hashtags} image={image} />}
        </div>
      </div>

      {/* Platform label */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className={cn('text-xs font-semibold', info.color)}>{info.name}</span>
        <span className="text-[10px] text-zinc-600">Live Preview</span>
      </div>
    </div>
  );
}

function InstagramUI({ caption, hashtags, image }: { caption: string; hashtags: string[]; image: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 pt-8 pb-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[1.5px]">
          <div className="h-full w-full rounded-full bg-zinc-900 p-[1.5px]">
            <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-white">aicreator.os</p>
          <p className="text-[10px] text-zinc-500">Sponsored</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-white" />
      </div>

      {/* Image */}
      <div className="relative flex-1 overflow-hidden bg-zinc-900">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>

      {/* Actions */}
      <div className="px-3 pt-2.5">
        <div className="flex items-center gap-4">
          <Heart className="h-5 w-5 text-white" />
          <MessageCircle className="h-5 w-5 text-white" />
          <Send className="h-5 w-5 text-white" />
          <Bookmark className="ml-auto h-5 w-5 text-white" />
        </div>
        <p className="mt-2 text-[11px] font-semibold text-white">12,847 likes</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white">
          <span className="font-semibold">aicreator.os</span>{' '}
          {caption.length > 120 ? caption.slice(0, 120) + '...' : caption}
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-sky-400">
          {hashtags.map((h) => `#${h}`).join(' ')}
        </p>
        <p className="mt-1.5 text-[10px] text-zinc-600">View all 248 comments</p>
      </div>
    </div>
  );
}

function TikTokUI({ caption, hashtags, image }: { caption: string; hashtags: string[]; image: string }) {
  return (
    <div className="relative h-full">
      <img src={image} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Top */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-center gap-6 px-4 pt-8">
        <span className="text-xs font-medium text-white/70">Following</span>
        <span className="relative text-xs font-semibold text-white">
          For You
          <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
        </span>
      </div>

      {/* Right actions */}
      <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 ring-2 ring-white" />
        <div className="flex flex-col items-center gap-0.5">
          <Heart className="h-7 w-7 text-white" fill="white" />
          <span className="text-[10px] font-semibold text-white">128K</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MessageCircle className="h-7 w-7 text-white" fill="white" />
          <span className="text-[10px] font-semibold text-white">2.4K</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Send className="h-7 w-7 text-white" />
          <span className="text-[10px] font-semibold text-white">Share</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-12 p-3">
        <p className="text-xs font-semibold text-white">@aicreator.os</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/90">
          {caption.length > 100 ? caption.slice(0, 100) + '...' : caption}
        </p>
        <p className="mt-1 text-[11px] text-white/80">{hashtags.map((h) => `#${h}`).join(' ')}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <Music className="h-3 w-3 text-white" />
          <div className="h-2 w-32 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-1/3 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Play indicator */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Play className="h-12 w-12 text-white/30" fill="white" />
      </div>
    </div>
  );
}

function TwitterUI({ caption, hashtags, image }: { caption: string; hashtags: string[]; image: string }) {
  return (
    <div className="flex h-full flex-col pt-8">
      <div className="flex gap-2.5 px-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white">AI Creator OS</span>
            <span className="text-[11px] text-zinc-500">@aicreatoros · 2h</span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-white">
            {caption.length > 200 ? caption.slice(0, 200) + '...' : caption}
          </p>
          <p className="mt-1 text-[12px] text-sky-400">{hashtags.map((h) => `#${h}`).join(' ')}</p>
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
            <img src={image} alt="" className="h-40 w-full object-cover" />
          </div>
          <div className="mt-2.5 flex items-center gap-6">
            <span className="flex items-center gap-1 text-[11px] text-zinc-500">
              <MessageCircle className="h-3.5 w-3.5" /> 342
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Heart className="h-3.5 w-3.5" /> 4.2K
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Send className="h-3.5 w-3.5" /> 189
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedInUI({ caption, hashtags, image }: { caption: string; hashtags: string[]; image: string }) {
  return (
    <div className="flex h-full flex-col pt-8">
      <div className="flex gap-2.5 px-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <div className="flex-1">
          <p className="text-xs font-bold text-white">AI Creator OS</p>
          <p className="text-[10px] text-zinc-500">2h · 🌐</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-white">
            {caption.length > 180 ? caption.slice(0, 180) + '...' : caption}
          </p>
          <p className="mt-1 text-[12px] text-blue-400">{hashtags.map((h) => `#${h}`).join(' ')}</p>
        </div>
      </div>
      <div className="mt-2 flex-1 overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-around px-3 py-2.5 text-[11px] text-zinc-500">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>↗ Share</span>
      </div>
    </div>
  );
}

function YouTubeUI({ caption, hashtags, image }: { caption: string; hashtags: string[]; image: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="h-14 w-14 text-white/80" fill="white" />
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          8:42
        </div>
      </div>
      <div className="flex gap-2.5 p-3">
        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <div className="flex-1">
          <p className="text-[12px] font-semibold leading-tight text-white">
            {caption.length > 80 ? caption.slice(0, 80) + '...' : caption}
          </p>
          <p className="mt-1 text-[10px] text-zinc-500">AI Creator OS · 1.2M views · 2 days ago</p>
          <p className="mt-1 text-[10px] text-red-400">{hashtags.map((h) => `#${h}`).join(' ')}</p>
        </div>
      </div>
    </div>
  );
}
