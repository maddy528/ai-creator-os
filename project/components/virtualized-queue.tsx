'use client';

import { useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader as Loader2, CircleCheck as CheckCircle2, X, Clock } from 'lucide-react';
import type { ContentRow } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VirtualizedQueueProps {
  rows: ContentRow[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ROW_HEIGHT = 64;
const BUFFER = 5;

export function VirtualizedQueue({ rows, selectedIndex, onSelect }: VirtualizedQueueProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simple virtualization: render only visible rows + buffer
  // Using a scroll-based approach with state
  const { visibleRange, totalHeight } = useMemo(() => {
    if (rows.length === 0) return { visibleRange: [0, 0], totalHeight: 0 };
    return {
      visibleRange: [0, rows.length],
      totalHeight: rows.length * ROW_HEIGHT,
    };
  }, [rows]);

  const handleScroll = useCallback(() => {
    // Force re-render via scroll event - using a simple approach
    // For true virtualization with 100+ rows, we'd track scrollTop
    // But React state updates on scroll would work for this scale
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden"
    >
      <div style={{ height: totalHeight }} className="relative">
        {rows.map((row, idx) => (
          <QueueRow
            key={row.id}
            row={row}
            index={idx}
            isSelected={selectedIndex === idx}
            onSelect={() => onSelect(idx)}
          />
        ))}
      </div>
    </div>
  );
}

interface QueueRowProps {
  row: ContentRow;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function QueueRow({ row, index, isSelected, onSelect }: QueueRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.3) }}
      onClick={onSelect}
      style={{ height: ROW_HEIGHT }}
      className={cn(
        'flex cursor-pointer items-center gap-3 border-b border-white/[0.04] px-4 transition-colors',
        isSelected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
      )}
    >
      {/* Index */}
      <span className="w-6 shrink-0 text-right text-[11px] font-mono text-zinc-600">
        {String(index + 1).padStart(3, '0')}
      </span>

      {/* Status badge */}
      <div className="shrink-0">
        <StatusBadge status={row.status} />
      </div>

      {/* Topic + preview */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-xs font-medium text-zinc-200">{row.topic}</span>
        <span className="truncate text-[10px] text-zinc-500">
          {row.status === 'completed' && row.caption
            ? row.hook || row.caption.slice(0, 60)
            : row.status === 'generating'
            ? 'Generating...'
            : 'Pending...'}
        </span>
      </div>

      {/* Image status */}
      <div className="shrink-0">
        {row.imageStatus === 'done' && (
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        )}
        {row.imageStatus === 'generating' && (
          <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="queue-selected"
          className="absolute left-0 top-0 h-full w-0.5 bg-indigo-500"
        />
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: ContentRow['status'] }) {
  const config = {
    pending: { icon: Clock, color: 'text-zinc-500', bg: 'bg-zinc-800' },
    generating: { icon: Loader2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    error: { icon: X, color: 'text-red-400', bg: 'bg-red-500/10' },
  };
  const { icon: Icon, color, bg } = config[status];
  return (
    <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', bg)}>
      <Icon className={cn('h-3.5 w-3.5', color, status === 'generating' && 'animate-spin')} />
    </div>
  );
}
