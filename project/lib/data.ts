import type { AIModel, Platform } from './types';

export const MODEL_INFO: Record<
  AIModel,
  { name: string; label: string; description: string; accent: string }
> = {
  'gemini-pro': {
    name: 'Gemini 1.5 Pro',
    label: 'Google Gemini 1.5 Pro',
    description: 'High reasoning - Complex tasks - Best quality',
    accent: 'text-indigo-400',
  },
  'gemini-flash': {
    name: 'Gemini 1.5 Flash',
    label: 'Google Gemini 1.5 Flash',
    description: 'Fast - Cost-efficient - High volume',
    accent: 'text-cyan-400',
  },
};

export const PLATFORM_INFO: Record<
  Platform,
  { name: string; color: string; aspect: string; label: string; dims: { w: number; h: number } }
> = {
  instagram: { name: 'Instagram', color: 'from-pink-500 to-purple-500', aspect: 'square', label: '1:1 Square', dims: { w: 640, h: 640 } },
  tiktok: { name: 'TikTok', color: 'from-zinc-700 to-black', aspect: 'vertical', label: '9:16 Vertical', dims: { w: 512, h: 910 } },
  linkedin: { name: 'LinkedIn', color: 'from-blue-600 to-blue-700', aspect: 'wide', label: '1.91:1 Card', dims: { w: 768, h: 402 } },
  twitter: { name: 'Twitter/X', color: 'from-zinc-700 to-zinc-900', aspect: 'text', label: '16:9 Feed', dims: { w: 640, h: 360 } },
};

export const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'linkedin', 'twitter'];
export const MODELS: AIModel[] = ['gemini-pro', 'gemini-flash'];

const MOCK_HOOKS = [
  'Stop scrolling. This changed everything about how we think about growth.',
  'The secret nobody tells you about building in public.',
  "I spent 90 days testing this. Here's what actually works.",
  "Your audience doesn't want more content. They want THIS.",
  "The 3-step framework that 10x'd our engagement overnight.",
];

const MOCK_VALUE_POINTS = [
  'Here are 3 key takeaways you can apply today.',
  'The data shows a clear pattern: consistency beats intensity every time.',
  'Start small, ship fast, and let your audience guide the direction.',
  'Focus on one platform, master it, then expand strategically.',
  'The best content doesn\'t sell - it teaches, inspires, and connects.',
];

const MOCK_HASHTAGS = [
  ['growth', 'marketing', 'strategy'],
  ['content', 'creator', 'viral'],
  ['startup', 'building', 'community'],
  ['socialmedia', 'engagement', 'tips'],
  ['branding', 'storytelling', 'authentic'],
];

export function generateMockContent(
  _topic: string,
  model: AIModel,
  _platform: Platform,
  index: number
): { caption: string; hashtags: string[]; hook: string; valuePoint: string; imagePrompt: string } {
  const i = index % MOCK_HOOKS.length;
  const hook = MOCK_HOOKS[i];
  const valuePoint = MOCK_VALUE_POINTS[i];
  const hashtags = MOCK_HASHTAGS[i];
  const caption = `${hook}\n\n${valuePoint}\n\n${hashtags.map((t) => `#${t}`).join(' ')}`;
  const imagePrompt = `professional social media illustration about ${_topic}, modern, clean design`;
  return { caption, hashtags, hook, valuePoint, imagePrompt };
}
