'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Search, Grid3x3, List, Trash2, Download, MoreHorizontal, Folder } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STOCK_IMAGES } from '@/lib/data';

const MEDIA = [
  { id: '1', name: 'AI-workflow-hero.jpg', type: 'image' as const, url: STOCK_IMAGES[0], size: '2.4 MB', uploadedAt: '2 hours ago' },
  { id: '2', name: 'content-automation.mp4', type: 'video' as const, url: STOCK_IMAGES[1], size: '48.2 MB', uploadedAt: '5 hours ago' },
  { id: '3', name: 'social-template-1.jpg', type: 'image' as const, url: STOCK_IMAGES[2], size: '1.8 MB', uploadedAt: '1 day ago' },
  { id: '4', name: 'creator-dashboard.jpg', type: 'image' as const, url: STOCK_IMAGES[3], size: '3.1 MB', uploadedAt: '2 days ago' },
  { id: '5', name: 'tiktok-preview.mp4', type: 'video' as const, url: STOCK_IMAGES[4], size: '32.7 MB', uploadedAt: '3 days ago' },
  { id: '6', name: 'analytics-cover.jpg', type: 'image' as const, url: STOCK_IMAGES[5], size: '2.0 MB', uploadedAt: '4 days ago' },
  { id: '7', name: 'batch-generation.jpg', type: 'image' as const, url: STOCK_IMAGES[0], size: '1.5 MB', uploadedAt: '5 days ago' },
  { id: '8', name: 'scheduling-demo.mp4', type: 'video' as const, url: STOCK_IMAGES[2], size: '56.3 MB', uploadedAt: '1 week ago' },
];

const FOLDERS = [
  { name: 'All Media', count: 142, active: true },
  { name: 'Instagram Posts', count: 48 },
  { name: 'TikTok Videos', count: 32 },
  { name: 'Twitter Cards', count: 24 },
  { name: 'LinkedIn Articles', count: 18 },
  { name: 'YouTube Thumbnails', count: 20 },
];

export function MediaLibrary() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const filtered = MEDIA.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Media Library</h2>
          <p className="mt-1 text-sm text-zinc-500">Store and organize all your generated and uploaded media assets.</p>
        </div>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Folders sidebar */}
        <div className="space-y-1">
          {FOLDERS.map((folder, i) => (
            <button
              key={folder.name}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all',
                folder.active
                  ? 'bg-indigo-500/10 text-white ring-1 ring-indigo-500/20'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              )}
            >
              <Folder className={cn('h-4 w-4', folder.active ? 'text-indigo-400' : 'text-zinc-500')} />
              <span className="flex-1 text-left font-medium">{folder.name}</span>
              <span className="text-xs text-zinc-600">{folder.count}</span>
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media..."
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none ring-indigo-500 placeholder:text-zinc-500 focus:ring-2"
              />
            </div>
            <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setView('grid')}
                className={cn('flex h-8 w-8 items-center justify-center rounded-md transition-colors', view === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500')}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('flex h-8 w-8 items-center justify-center rounded-md transition-colors', view === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            className={cn(
              'flex items-center justify-center gap-3 rounded-xl border border-dashed py-4 text-sm transition-all',
              dragOver ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 text-zinc-500'
            )}
          >
            <UploadCloud className={cn('h-4 w-4', dragOver && 'text-indigo-400')} />
            <span>Drag and drop files here, or click to upload</span>
          </div>

          {/* Media grid/list */}
          {view === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item, i) => (
                <Card
                  key={item.id}
                  className="glass-card glass-hover group relative overflow-hidden p-0 animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={item.url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                          <Video className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-red-500/30">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-medium text-white">{item.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">{item.size}</span>
                      <Badge variant="outline" className="border-white/10 text-[9px] text-zinc-400">
                        {item.type === 'image' ? <ImageIcon className="mr-1 h-2.5 w-2.5" /> : <Video className="mr-1 h-2.5 w-2.5" />}
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card overflow-hidden">
              <div className="border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <div className="grid grid-cols-[1fr_80px_80px_100px_40px] gap-4">
                  <span>Name</span><span>Type</span><span>Size</span><span>Uploaded</span><span></span>
                </div>
              </div>
              {filtered.map((item) => (
                <div key={item.id} className="group grid grid-cols-[1fr_80px_80px_100px_40px] items-center gap-4 border-b border-white/[0.04] px-4 py-3 transition-colors hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg">
                      <img src={item.url} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="truncate text-sm text-white">{item.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{item.type}</span>
                  <span className="text-xs text-zinc-400">{item.size}</span>
                  <span className="text-xs text-zinc-500">{item.uploadedAt}</span>
                  <button className="opacity-0 transition-opacity group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
