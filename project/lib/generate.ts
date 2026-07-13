import type { AIModel, Platform } from './types';
import { generateMockContent } from './data';

interface BulkRowResult {
  hook: string;
  valuePoint: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl: string;
  error?: string;
}

function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[key.replace('NEXT_PUBLIC_', '')];
  }
  return undefined;
}

const MODEL_MAP: Record<AIModel, string> = {
  'gemini-pro': 'gemini-1.5-pro',
  'gemini-flash': 'gemini-1.5-flash',
};

export async function generateRow(
  topic: string,
  platform: Platform,
  model: AIModel
): Promise<BulkRowResult> {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    const mock = generateMockContent(topic, model, platform, 0);
    await new Promise((r) => setTimeout(r, 300));
    return { ...mock, imageUrl: '' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/gemini-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ topic, platform, model: MODEL_MAP[model] }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed (${res.status})`);
    }

    const data = await res.json();
    return {
      hook: data.hook || '',
      valuePoint: data.valuePoint || '',
      caption: data.caption || '',
      hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
      imagePrompt: data.imagePrompt || topic,
      imageUrl: data.imageUrl || '',
    };
  } catch (err) {
    console.error('Generation failed, using mock:', err);
    const mock = generateMockContent(topic, model, platform, 0);
    return { ...mock, imageUrl: '', error: (err as Error).message };
  }
}

export function buildPollinationsImageUrl(prompt: string, platform: Platform, seed: number): string {
  const dims =
    platform === 'tiktok' ? { w: 512, h: 910 } :
    platform === 'linkedin' ? { w: 768, h: 402 } :
    platform === 'twitter' ? { w: 640, h: 360 } :
    { w: 640, h: 640 };

  const encoded = encodeURIComponent(prompt.slice(0, 200));
  return `https://image.pollinations.ai/prompt/${encoded}?width=${dims.w}&height=${dims.h}&nologo=true&model=flux&seed=${seed}`;
}
