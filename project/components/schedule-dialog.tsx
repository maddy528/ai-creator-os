'use client';

import { useState } from 'react';
import { Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Platform, AIModel } from '@/lib/types';
import { PLATFORM_INFO, MODEL_INFO } from '@/lib/data';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caption: string;
  platform: Platform;
  model: AIModel;
}

const TIME_SLOTS = [
  '09:00', '12:00', '15:00', '18:00', '21:00',
];

export function ScheduleDialog({ open, onOpenChange, caption, platform, model }: ScheduleDialogProps) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('12:00');
  const [autoPost, setAutoPost] = useState(true);
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = () => {
    setScheduled(true);
    setTimeout(() => {
      setScheduled(false);
      onOpenChange(false);
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 bg-zinc-950/95 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Send className="h-4 w-4 text-indigo-400" />
            Schedule Post
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Pick a date and time to auto-publish your content.
          </DialogDescription>
        </DialogHeader>

        {scheduled ? (
          <div className="flex flex-col items-center gap-3 py-8 animate-scale-in">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <p className="text-sm font-medium text-white">Post scheduled successfully</p>
            <p className="text-xs text-zinc-500">
              {date} at {time} · {PLATFORM_INFO[platform].name}
            </p>
          </div>
        ) : (
          <>
            {/* Preview info */}
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold', PLATFORM_INFO[platform].bg, PLATFORM_INFO[platform].color)}>
                  {PLATFORM_INFO[platform].name}
                </span>
                <span className="text-[10px] text-zinc-500">via {MODEL_INFO[model].name}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-zinc-400">{caption}</p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none ring-indigo-500 focus:ring-2"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                <Clock className="h-3.5 w-3.5 text-indigo-400" /> Time
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-900">
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t} className="text-white focus:bg-indigo-500/10">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-post toggle */}
            <button
              onClick={() => setAutoPost(!autoPost)}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/[0.08]"
            >
              <div className="text-left">
                <p className="text-xs font-medium text-white">Auto-post</p>
                <p className="text-[11px] text-zinc-500">Publish automatically at scheduled time</p>
              </div>
              <div className={cn('relative h-5 w-9 rounded-full transition-colors', autoPost ? 'bg-indigo-500' : 'bg-zinc-700')}>
                <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', autoPost ? 'left-4' : 'left-0.5')} />
              </div>
            </button>

            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleSchedule} className="bg-indigo-600 text-white hover:bg-indigo-500">
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Confirm Schedule
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
