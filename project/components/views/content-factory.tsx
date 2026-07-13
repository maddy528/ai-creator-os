'use client';

import { useState, useCallback, useRef } from 'react';
import {
  UploadCloud, FileSpreadsheet, X, Sparkles, Download, Send, Loader2, CheckCircle2,
  Instagram, Twitter, Youtube, Linkedin, Cpu, Wand2, Trash2, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AIModel, Platform, ContentRow } from '@/lib/types';
import { MODEL_INFO, PLATFORM_INFO, randomStockImage } from '@/lib/data';
import { generateContentBulk } from '@/lib/generate';
import { PhonePreview } from '@/components/phone-preview';
import { ScheduleDialog } from '@/components/schedule-dialog';

const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'];
const MODELS: AIModel[] = ['gemini', 'gpt-4', 'claude'];

const SAMPLE_CSV = `topic,platform
5 AI tools for content creators,instagram
Why automation beats manual posting,tiktok
The future of social media marketing,linkedin
AI content workflow breakdown,twitter
Best AI tools for creators 2025,youtube
Building a content engine with AI,instagram`;

export function ContentFactory() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [generating, setGenerating] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const topicIdx = header.findIndex((h) => h.includes('topic'));
    const platformIdx = header.findIndex((h) => h.includes('platform'));

    const parsed: ContentRow[] = lines.slice(1).map((line, i) => {
      const cols = line.split(',').map((c) => c.trim());
      const topic = cols[topicIdx >= 0 ? topicIdx : 0] || `Topic ${i + 1}`;
      const platformStr = cols[platformIdx >= 0 ? platformIdx : 1]?.toLowerCase() as Platform;
      const platform = PLATFORMS.includes(platformStr) ? platformStr : 'instagram';
      return {
        id: `row-${i}`,
        topic,
        caption: '',
        hashtags: [],
        platform,
        model: selectedModel,
        status: 'idle',
      };
    });
    setRows(parsed);
    setPreviewIndex(0);
  };

  const loadSample = () => {
    setFileName('sample-content.csv');
    parseCSV(SAMPLE_CSV);
  };

  const generateAll = async () => {
    setGenerating(true);
    setRows((prev) => prev.map((r) => ({ ...r, status: 'generating' })));

    try {
      const results = await generateContentBulk(
        rows.map((r) => ({ topic: r.topic, platform: r.platform, model: selectedModel }))
      );
      setRows((prev) =>
        prev.map((r, idx) => {
          const result = results[idx];
          if (!result || result.error) {
            return { ...r, status: 'error' as const, model: selectedModel };
          }
          return {
            ...r,
            caption: result.caption,
            hashtags: result.hashtags,
            model: selectedModel,
            status: 'done' as const,
          };
        })
      );
    } catch {
      setRows((prev) => prev.map((r) => ({ ...r, status: 'error' as const })));
    }

    setGenerating(false);
  };

  const downloadCSV = () => {
    const header = 'topic,caption,hashtags,platform,model\n';
    const body = rows
      .map((r) => {
        const caption = r.caption.replace(/"/g, '""');
        const hashtags = r.hashtags.map((h) => `#${h}`).join(' ');
        return `"${r.topic}","${caption}","${hashtags}","${r.platform}","${r.model}"`;
      })
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateRowPlatform = (id: string, platform: Platform) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, platform } : r)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    const newRow: ContentRow = {
      id: `row-${Date.now()}`,
      topic: 'New topic',
      caption: '',
      hashtags: [],
      platform: selectedPlatform,
      model: selectedModel,
      status: 'idle',
    };
    setRows((prev) => [...prev, newRow]);
  };

  const updateTopic = (id: string, topic: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, topic } : r)));
  };

  const doneCount = rows.filter((r) => r.status === 'done').length;
  const errorCount = rows.filter((r) => r.status === 'error').length;
  const currentPreview = rows[previewIndex];
  const allDone = doneCount === rows.length && rows.length > 0;
  const hasResults = doneCount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Content Factory</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Upload a CSV, generate AI content at scale, preview, and schedule — all in one place.
          </p>
        </div>
        {rows.length > 0 && (
          <Badge variant="secondary" className="glass border-white/10">
            {rows.length} rows · {doneCount} generated
          </Badge>
        )}
      </div>

      {/* Upload + Config */}
      {rows.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'glass-card relative flex cursor-pointer flex-col items-center justify-center gap-4 p-16 text-center transition-all duration-300',
            dragOver ? 'border-indigo-500/50 bg-indigo-500/5 scale-[1.01]' : 'glass-hover'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300',
            dragOver ? 'bg-indigo-500/20 scale-110' : 'bg-white/5'
          )}>
            <UploadCloud className={cn('h-8 w-8 transition-colors', dragOver ? 'text-indigo-400' : 'text-zinc-400')} />
          </div>
          <div>
            <p className="text-base font-semibold text-white">Drop your CSV here</p>
            <p className="mt-1 text-sm text-zinc-500">or click to browse · columns: topic, platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); loadSample(); }}
              className="border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Try Sample CSV
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-600">
            <span>Supported:</span>
            <Badge variant="outline" className="border-white/10 text-zinc-400">.csv</Badge>
            <Badge variant="outline" className="border-white/10 text-zinc-400">max 1,000 rows</Badge>
          </div>
        </div>
      ) : (
        <>
          {/* Config bar */}
          <div className="glass-card flex flex-wrap items-center gap-4 p-4">
            {/* Model selector */}
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-medium text-zinc-400">Model:</span>
              <div className="flex gap-1.5">
                {MODELS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                      selectedModel === m
                        ? 'bg-gradient-to-r ' + MODEL_INFO[m].color + ' text-white shadow-lg'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    )}
                  >
                    {MODEL_INFO[m].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-white/10" />

            {/* Platform filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Default platform:</span>
              <div className="flex gap-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-all',
                      selectedPlatform === p
                        ? cn(PLATFORM_INFO[p].bg, 'ring-1 ring-white/20')
                        : 'bg-white/5 hover:bg-white/10'
                    )}
                    title={PLATFORM_INFO[p].name}
                  >
                    <PlatformIcon platform={p} className={cn('h-4 w-4', selectedPlatform === p ? PLATFORM_INFO[p].color : 'text-zinc-500')} />
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setRows([]); setFileName(null); }}
                className="border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Clear
              </Button>
              <Button
                size="sm"
                onClick={generateAll}
                disabled={generating}
                className="bg-indigo-600 text-white hover:bg-indigo-500"
              >
                {generating ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                )}
                {generating ? `Generating ${rows.length}...` : `Generate ${rows.length} posts`}
              </Button>
              {hasResults && !generating && (
                <Button
                  size="sm"
                  onClick={downloadCSV}
                  className="bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download Results
                </Button>
              )}
            </div>
          </div>

          {/* File info */}
          {fileName && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>{fileName}</span>
              <span>·</span>
              <span>{rows.length} rows loaded</span>
              {doneCount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400">{doneCount} generated</span>
                </>
              )}
              {errorCount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-red-400">{errorCount} failed</span>
                </>
              )}
            </div>
          )}

          {/* Main grid: rows + preview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            {/* Rows table */}
            <div className="glass-card overflow-hidden">
              <div className="border-b border-white/[0.06] px-4 py-3">
                <p className="text-sm font-semibold text-white">Content Queue</p>
              </div>
              <div className="scrollbar-thin max-h-[600px] overflow-y-auto">
                {rows.map((row, idx) => (
                  <div
                    key={row.id}
                    className={cn(
                      'group border-b border-white/[0.04] p-4 transition-colors',
                      previewIndex === idx ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02]'
                    )}
                    onClick={() => setPreviewIndex(idx)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status */}
                      <div className="mt-0.5 shrink-0">
                        {row.status === 'idle' && (
                          <div className="h-5 w-5 rounded-full border border-zinc-700" />
                        )}
                        {row.status === 'generating' && (
                          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                        )}
                        {row.status === 'done' && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        )}
                        {row.status === 'error' && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20">
                            <X className="h-3 w-3 text-red-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Topic input */}
                        <input
                          value={row.topic}
                          onChange={(e) => updateTopic(row.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-transparent text-sm font-medium text-white outline-none"
                          placeholder="Enter topic..."
                        />

                        {/* Caption preview */}
                        {row.status === 'done' && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                            {row.caption}
                          </p>
                        )}

                        {/* Bottom row */}
                        <div className="mt-2 flex items-center gap-2">
                          {/* Platform mini selector */}
                          <div className="flex gap-1">
                            {PLATFORMS.map((p) => (
                              <button
                                key={p}
                                onClick={(e) => { e.stopPropagation(); updateRowPlatform(row.id, p); }}
                                className={cn(
                                  'flex h-6 w-6 items-center justify-center rounded transition-all',
                                  row.platform === p ? cn(PLATFORM_INFO[p].bg, 'ring-1 ring-white/10') : 'opacity-30 hover:opacity-100'
                                )}
                              >
                                <PlatformIcon platform={p} className={cn('h-3 w-3', row.platform === p ? PLATFORM_INFO[p].color : 'text-zinc-500')} />
                              </button>
                            ))}
                          </div>

                          {row.status === 'done' && row.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {row.hashtags.slice(0, 3).map((h) => (
                                <span key={h} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-indigo-400">
                                  #{h}
                                </span>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={(e) => { e.stopPropagation(); removeRow(row.id); }}
                            className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-zinc-600 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add row */}
              <button
                onClick={addRow}
                className="flex w-full items-center justify-center gap-2 py-3 text-xs text-zinc-500 transition-colors hover:bg-white/[0.03] hover:text-zinc-300"
              >
                <Plus className="h-3.5 w-3.5" />
                Add row
              </button>
            </div>

            {/* Phone preview */}
            <div className="sticky top-4">
              <div className="glass-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <p className="text-sm font-semibold text-white">Social Preview</p>
                  </div>
                  {currentPreview && (
                    <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold', PLATFORM_INFO[currentPreview.platform].bg, PLATFORM_INFO[currentPreview.platform].color)}>
                      {PLATFORM_INFO[currentPreview.platform].name}
                    </span>
                  )}
                </div>

                {currentPreview && currentPreview.status === 'done' ? (
                  <PhonePreview
                    platform={currentPreview.platform}
                    caption={currentPreview.caption}
                    hashtags={currentPreview.hashtags}
                    index={previewIndex}
                  />
                ) : currentPreview ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                      {currentPreview.status === 'generating' ? (
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                      ) : (
                        <Wand2 className="h-8 w-8 text-zinc-600" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-500">
                      {currentPreview.status === 'generating' ? 'Generating content...' : 'Generate to see preview'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                      <Sparkles className="h-8 w-8 text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-500">Select a row to preview</p>
                  </div>
                )}

                {/* Actions */}
                {hasResults && currentPreview && (
                  <div className="mt-5 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadCSV}
                      className="flex-1 border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download Results
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setScheduleOpen(true)}
                      className="flex-1 bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Schedule Post
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Schedule dialog */}
      {currentPreview && (
        <ScheduleDialog
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          caption={currentPreview.caption}
          platform={currentPreview.platform}
          model={currentPreview.model}
        />
      )}
    </div>
  );
}

function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  switch (platform) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'tiktok':
      return <Youtube className={className} />;
    case 'twitter':
      return <Twitter className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
  }
}
