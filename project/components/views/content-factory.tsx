'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Wand as Wand2, Loader as Loader2, Download, FileSpreadsheet, Image as ImageIcon, ChevronLeft, ChevronRight, Sparkles, Zap, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';
import type { AIModel, Platform, ContentRow, RowStatus } from '@/lib/types';
import { MODEL_INFO, PLATFORM_INFO, PLATFORMS, MODELS } from '@/lib/data';
import { generateRow, buildPollinationsImageUrl } from '@/lib/generate';
import { Button } from '@/components/ui/button';
import { VirtualizedQueue } from '@/components/virtualized-queue';
import { SmartPreview } from '@/components/smart-preview';
import { cn } from '@/lib/utils';

function parseCSV(text: string): { topic: string; platform: Platform }[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const topicIdx = header.findIndex((h) => h === 'topic' || h === 'title' || h === 'subject');
  const platformIdx = header.findIndex((h) => h === 'platform' || h === 'channel');

  const rows: { topic: string; platform: Platform }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    const topic = cols[topicIdx >= 0 ? topicIdx : 0];
    if (!topic) continue;
    let platform: Platform = 'instagram';
    if (platformIdx >= 0 && cols[platformIdx]) {
      const p = cols[platformIdx].toLowerCase() as Platform;
      if (PLATFORMS.includes(p)) platform = p;
    }
    rows.push({ topic, platform });
  }
  return rows;
}

function downloadCSV(rows: ContentRow[]) {
  const header = 'Topic,Platform,Model,Hook,Value Point,Caption,Hashtags,Image URL\n';
  const body = rows
    .filter((r) => r.status === 'completed')
    .map((r) => {
      const esc = (s: string) => `"${(s || '').replace(/"/g, '""')}"`;
      return [esc(r.topic), esc(r.platform), esc(r.model), esc(r.hook), esc(r.valuePoint), esc(r.caption), esc(r.hashtags.join(', ')), esc(r.imageUrl || '')].join(',');
    })
    .join('\n');
  const blob = new Blob([header + body], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-creator-os-results.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function ContentFactoryView() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-flash');
  const [generating, setGenerating] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>('instagram');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      const newRows: ContentRow[] = parsed.map((r, i) => ({
        id: `row-${i}`,
        index: i,
        topic: r.topic,
        platform: r.platform,
        model: 'gemini-flash',
        status: 'pending' as RowStatus,
        caption: '',
        hashtags: [],
        hook: '',
        valuePoint: '',
        imageUrl: null,
        imageStatus: 'idle' as const,
        imagePrompt: '',
      }));
      setRows(newRows);
      if (newRows.length > 0) {
        setSelectedIndex(0);
        setPreviewPlatform(newRows[0].platform);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
      handleFile(file);
    }
  };

  const updateRow = (index: number, updates: Partial<ContentRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
  };

  // Parallel processing: process rows concurrently with a concurrency limit
  const generateAll = async () => {
    setGenerating(true);

    // Mark all as generating
    setRows((prev) => prev.map((r) => ({ ...r, status: 'generating' as RowStatus })));

    const concurrencyLimit = 5;
    const indices = rows.map((_, i) => i);

    // Process in batches for concurrency control
    for (let i = 0; i < indices.length; i += concurrencyLimit) {
      const batch = indices.slice(i, i + concurrencyLimit);
      await Promise.all(
        batch.map(async (idx) => {
          const row = rows[idx];
          try {
            const result = await generateRow(row.topic, row.platform, selectedModel);
            updateRow(idx, {
              hook: result.hook,
              valuePoint: result.valuePoint,
              caption: result.caption,
              hashtags: result.hashtags,
              imagePrompt: result.imagePrompt,
              imageUrl: result.imageUrl || null,
              imageStatus: result.imageUrl ? 'done' : 'idle',
              status: 'completed' as RowStatus,
              model: selectedModel,
            });
          } catch {
            updateRow(idx, { status: 'error' as RowStatus });
          }
        })
      );
    }

    setGenerating(false);
  };

  const generateAllImages = async () => {
    setGeneratingImages(true);
    const doneRows = rows.filter((r) => r.status === 'completed' && !r.imageUrl);
    if (doneRows.length === 0) {
      setGeneratingImages(false);
      return;
    }

    setRows((prev) => prev.map((r) => (r.status === 'completed' && !r.imageUrl ? { ...r, imageStatus: 'generating' as const } : r)));

    const batchSize = 5;
    for (let i = 0; i < doneRows.length; i += batchSize) {
      const batch = doneRows.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (row) => {
          const prompt = row.imagePrompt || row.hook || row.topic;
          const seed = row.index;
          const url = buildPollinationsImageUrl(prompt, row.platform, seed);
          await new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          });
          setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, imageUrl: url, imageStatus: 'done' as const } : r)));
        })
      );
    }
    setGeneratingImages(false);
  };

  const completedCount = rows.filter((r) => r.status === 'completed').length;
  const errorCount = rows.filter((r) => r.status === 'error').length;
  const generatingCount = rows.filter((r) => r.status === 'generating').length;
  const pendingCount = rows.filter((r) => r.status === 'pending').length;
  const imageDoneCount = rows.filter((r) => r.imageStatus === 'done').length;
  const currentRow = rows[selectedIndex];
  const hasResults = completedCount > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Content Factory</h2>
          <p className="text-[11px] text-zinc-500">Bulk AI content generation with visual engine</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Model selector */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-1">
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  selectedModel === m
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {MODEL_INFO[m].name}
              </button>
            ))}
          </div>

          {/* Global Generate button with glow */}
          <Button
            variant="glow"
            size="lg"
            onClick={generateAll}
            disabled={generating || rows.length === 0}
            className="relative"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Global Generate
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Stats bar */}
      {rows.length > 0 && (
        <div className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-2">
          {fileName && (
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <FileSpreadsheet className="h-3 w-3 text-emerald-400" />
              <span>{fileName}</span>
              <span>·</span>
              <span>{rows.length} rows</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-3 text-[11px]">
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 text-zinc-500"><Clock className="h-3 w-3" /> {pendingCount} pending</span>
            )}
            {generatingCount > 0 && (
              <span className="flex items-center gap-1 text-indigo-400"><Loader2 className="h-3 w-3 animate-spin" /> {generatingCount} generating</span>
            )}
            {completedCount > 0 && (
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> {completedCount} done</span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-red-400"><AlertCircle className="h-3 w-3" /> {errorCount} failed</span>
            )}
            {imageDoneCount > 0 && (
              <span className="flex items-center gap-1 text-cyan-400"><ImageIcon className="h-3 w-3" /> {imageDoneCount} images</span>
            )}
          </div>
        </div>
      )}

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Upload + Queue */}
        <div className="flex w-[400px] shrink-0 flex-col border-r border-white/[0.06]">
          {rows.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <motion.div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all',
                  dragOver
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-white/[0.08] hover:border-white/[0.12] hover:bg-white/[0.02]'
                )}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/20">
                  <Upload className="h-6 w-6 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-zinc-200">Upload CSV to begin</p>
                <p className="mt-1 text-[11px] text-zinc-500">Drag & drop or click to browse</p>
                <p className="mt-0.5 text-[10px] text-zinc-600">Columns: topic, platform</p>
                <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </motion.div>
            </div>
          ) : (
            <>
              {/* Action bar */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <Button size="sm" onClick={generateAllImages} disabled={generatingImages || !hasResults} className="bg-purple-600 text-white hover:bg-purple-500">
                  {generatingImages ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <ImageIcon className="mr-1.5 h-3 w-3" />}
                  {generatingImages ? 'Generating...' : 'Generate All Images'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadCSV(rows)} disabled={!hasResults} className="border-white/[0.08]">
                  <Download className="mr-1.5 h-3 w-3" />
                  Export
                </Button>
              </div>

              {/* Queue header */}
              <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                <Zap className="h-3 w-3" />
                Processing Queue
              </div>

              {/* Virtualized queue */}
              <VirtualizedQueue
                rows={rows}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
              />
            </>
          )}
        </div>

        {/* Right: Smart Preview */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-925 p-6">
          {currentRow ? (
            <>
              {/* Navigation */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => { const p = (selectedIndex - 1 + rows.length) % rows.length; setSelectedIndex(p); setPreviewPlatform(rows[p].platform); }}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-zinc-500">{selectedIndex + 1} / {rows.length}</span>
                <button
                  onClick={() => { const n = (selectedIndex + 1) % rows.length; setSelectedIndex(n); setPreviewPlatform(rows[n].platform); }}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <SmartPreview row={currentRow} previewPlatform={previewPlatform} onPlatformChange={setPreviewPlatform} />

              {/* Structured content cards */}
              {currentRow.status === 'completed' && (
                <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-2">
                  <div className="glass rounded-lg p-2.5">
                    <p className="text-[9px] uppercase tracking-wide text-indigo-400">Hook</p>
                    <p className="mt-1 line-clamp-2 text-[10px] text-zinc-300">{currentRow.hook || '—'}</p>
                  </div>
                  <div className="glass rounded-lg p-2.5">
                    <p className="text-[9px] uppercase tracking-wide text-emerald-400">Value</p>
                    <p className="mt-1 line-clamp-2 text-[10px] text-zinc-300">{currentRow.valuePoint || '—'}</p>
                  </div>
                  <div className="glass rounded-lg p-2.5">
                    <p className="text-[9px] uppercase tracking-wide text-cyan-400">Tags</p>
                    <p className="mt-1 line-clamp-2 text-[10px] text-blue-400">{currentRow.hashtags.map((t) => `#${t}`).join(' ') || '—'}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-600">
              <Sparkles className="h-8 w-8" />
              <p className="text-xs">Upload a CSV to see live preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
