'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader as Loader2, Heart, MessageCircle, Send, Bookmark, MoveHorizontal as MoreHorizontal, ThumbsUp, MessageSquare, Share, Repeat2, Music, Volume2 } from 'lucide-react';
import type { Platform, ContentRow } from '@/lib/types';
import { PLATFORMS, PLATFORM_INFO } from '@/lib/data';
import { PlatformIcon } from '@/components/platform-icon';
import { cn } from '@/lib/utils';

interface SmartPreviewProps {
  row: ContentRow;
  previewPlatform: Platform;
  onPlatformChange: (p: Platform) => void;
}

export function SmartPreview({ row, previewPlatform, onPlatformChange }: SmartPreviewProps) {
  return (
    <div className="flex h-full flex-col items-center">
      {/* Platform selector */}
      <div className="mb-6 flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
        {PLATFORMS.map((p) => (
          <PlatformIcon
            key={p}
            platform={p}
            size={16}
            active={previewPlatform === p}
            onClick={() => onPlatformChange(p)}
          />
        ))}
      </div>

      {/* Phone frame */}
      <div className="phone-3d relative">
        {/* Outer frame */}
        <div className="relative h-[560px] w-[280px] rounded-[2.5rem] border-[3px] border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-zinc-950">
            {/* Notch */}
            <div className="absolute left-1/2 top-0 z-50 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

            {/* Platform content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={previewPlatform}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full"
              >
                <PlatformContent row={row} platform={previewPlatform} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side buttons */}
          <div className="absolute -right-[3px] top-24 h-12 w-[3px] rounded-r bg-zinc-700" />
          <div className="absolute -right-[3px] top-40 h-16 w-[3px] rounded-r bg-zinc-700" />
          <div className="absolute -left-[3px] top-28 h-16 w-[3px] rounded-l bg-zinc-700" />
        </div>

        {/* Glow underneath */}
        <div className="absolute -bottom-8 left-1/2 h-12 w-48 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-2xl" />
      </div>

      {/* Platform label */}
      <p className="mt-8 text-[11px] font-medium text-zinc-500">
        {PLATFORM_INFO[previewPlatform].name} · {PLATFORM_INFO[previewPlatform].label}
      </p>
    </div>
  );
}

function PlatformContent({ row, platform }: { row: ContentRow; platform: Platform }) {
  const caption = row.caption || 'Your generated content will appear here...';
  const hashtags = row.hashtags.length > 0 ? row.hashtags.map((t) => `#${t}`).join(' ') : '';

  const renderImage = (aspectClass: string) => {
    if (row.imageStatus === 'generating') {
      return (
        <div className={cn('relative w-full', aspectClass)}>
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        </div>
      );
    }
    if (row.imageUrl) {
      return (
        <div className={cn('relative w-full', aspectClass)}>
          <Image src={row.imageUrl} alt={row.topic} fill className="object-cover" unoptimized sizes="280px" />
        </div>
      );
    }
    return (
      <div className={cn('relative w-full', aspectClass)}>
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
          <span className="text-[10px] text-zinc-600">No image</span>
        </div>
      </div>
    );
  };

  // Instagram: square + caption
  if (platform === 'instagram') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 px-3 pt-7 pb-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500" />
          <span className="text-[11px] font-semibold text-zinc-200">your_brand</span>
          <MoreHorizontal className="ml-auto h-4 w-4 text-zinc-500" />
        </div>
        {renderImage('aspect-square')}
        <div className="flex items-center gap-3.5 px-3 py-2">
          <Heart className="h-4 w-4 text-zinc-300" />
          <MessageCircle className="h-4 w-4 text-zinc-300" />
          <Send className="h-4 w-4 text-zinc-300" />
          <Bookmark className="ml-auto h-4 w-4 text-zinc-300" />
        </div>
        <div className="px-3 pb-3">
          <p className="whitespace-pre-line text-[10px] leading-relaxed text-zinc-300">
            {caption}
            {hashtags && <span className="mt-1 block text-blue-400">{hashtags}</span>}
          </p>
        </div>
      </div>
    );
  }

  // TikTok: vertical 9:16 reel
  if (platform === 'tiktok') {
    return (
      <div className="relative h-full w-full bg-black">
        {row.imageStatus === 'generating' ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        ) : row.imageUrl ? (
          <Image src={row.imageUrl} alt={row.topic} fill className="object-cover" unoptimized sizes="280px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
            <span className="text-[10px] text-zinc-600">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        {/* Top bar */}
        <div className="absolute top-7 left-0 right-0 flex items-center justify-center gap-4 text-[11px] text-white/80">
          <span>Following</span>
          <span className="font-semibold text-white border-b-2 border-white pb-0.5">For You</span>
        </div>
        {/* Right side actions */}
        <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3.5">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 ring-2 ring-white/20" />
            <div className="-mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">+</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Heart className="h-6 w-6 text-white" />
            <span className="text-[8px] text-white">12.4K</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="text-[8px] text-white">847</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Share className="h-5 w-5 text-white" />
            <span className="text-[8px] text-white">Share</span>
          </div>
        </div>
        {/* Bottom caption */}
        <div className="absolute bottom-3 left-3 right-12">
          <p className="text-[10px] font-semibold text-white">@yourbrand</p>
          <p className="mt-1 whitespace-pre-line text-[10px] leading-snug text-white/90">
            {row.hook || caption}
            {hashtags && <span className="mt-1 block text-cyan-300">{hashtags}</span>}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-white/70">
            <Music className="h-2.5 w-2.5" />
            <span className="text-[8px]">Original audio · Creator OS</span>
          </div>
        </div>
        {/* Volume indicator */}
        <div className="absolute right-2 top-14">
          <Volume2 className="h-3.5 w-3.5 text-white/60" />
        </div>
      </div>
    );
  }

  // LinkedIn: desktop card style
  if (platform === 'linkedin') {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center gap-2 px-3 pt-7 pb-2">
          <div className="h-8 w-8 rounded-full bg-blue-600" />
          <div>
            <p className="text-[11px] font-bold text-zinc-900">Your Brand</p>
            <p className="text-[8px] text-zinc-500">2h · 1st · 🌐</p>
          </div>
          <MoreHorizontal className="ml-auto h-4 w-4 text-zinc-400" />
        </div>
        <div className="px-3 pb-2">
          <p className="whitespace-pre-line text-[10px] leading-relaxed text-zinc-700">
            {row.hook || caption}
            {row.valuePoint && (
              <span className="mt-1 block text-zinc-600">{row.valuePoint}</span>
            )}
            {hashtags && <span className="mt-1 block text-blue-600">{hashtags}</span>}
          </p>
          <button className="mt-1 text-[10px] font-medium text-zinc-500 hover:text-zinc-700">...see more</button>
        </div>
        {row.imageUrl && (
          <div className="relative aspect-[1.91/1] w-full">
            <Image src={row.imageUrl} alt={row.topic} fill className="object-cover" unoptimized sizes="280px" />
          </div>
        )}
        <div className="flex items-center justify-around px-3 py-2 border-t border-zinc-100">
          <span className="flex items-center gap-1 text-[9px] text-zinc-500"><ThumbsUp className="h-3 w-3" /> Like</span>
          <span className="flex items-center gap-1 text-[9px] text-zinc-500"><MessageSquare className="h-3 w-3" /> Comment</span>
          <span className="flex items-center gap-1 text-[9px] text-zinc-500"><Share className="h-3 w-3" /> Share</span>
        </div>
      </div>
    );
  }

  // Twitter/X: minimalist feed card
  if (platform === 'twitter') {
    return (
      <div className="flex h-full flex-col bg-zinc-950">
        <div className="flex gap-2.5 px-3 pt-7">
          <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-700" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-zinc-100">Your Brand</span>
              <svg className="h-3 w-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-1.58-.85-2.95-2.11-3.69.12-.34.19-.7.19-1.08 0-1.79-1.45-3.24-3.24-3.24-.39 0-.76.07-1.1.2A3.7 3.7 0 0 0 12 3c-1.4 0-2.62.78-3.24 1.93a3.24 3.24 0 0 0-1.1-.2c-1.79 0-3.24 1.45-3.24 3.24 0 .38.07.74.19 1.08A4.3 4.3 0 0 0 2.5 12.5c0 1.58.85 2.95 2.11 3.69-.12.34-.19.7-.19 1.08 0 1.79 1.45 3.24 3.24 3.24.39 0 .76-.07 1.1-.2A3.7 3.7 0 0 0 12 22c1.4 0 2.62-.78 3.24-1.93.34.13.71.2 1.1.2 1.79 0 3.24-1.45 3.24-3.24 0-.38-.07-.74-.19-1.08A4.3 4.3 0 0 0 22.5 12.5z" /></svg>
              <span className="text-[10px] text-zinc-500">@yourbrand · 2h</span>
            </div>
            <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-zinc-200">
              {caption}
              {hashtags && <span className="mt-1 block text-blue-400">{hashtags}</span>}
            </p>
            {row.imageUrl && (
              <div className="relative mt-2 aspect-[1.5/1] overflow-hidden rounded-lg border border-white/[0.08]">
                <Image src={row.imageUrl} alt={row.topic} fill className="object-cover" unoptimized sizes="280px" />
              </div>
            )}
            <div className="mt-2.5 flex items-center gap-5 text-zinc-500">
              <span className="flex items-center gap-1 text-[10px]"><MessageSquare className="h-3.5 w-3.5" /> 48</span>
              <span className="flex items-center gap-1 text-[10px]"><Repeat2 className="h-3.5 w-3.5" /> 129</span>
              <span className="flex items-center gap-1 text-[10px]"><Heart className="h-3.5 w-3.5" /> 842</span>
              <span className="flex items-center gap-1 text-[10px]"><Share className="h-3.5 w-3.5" /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
