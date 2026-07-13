import type { AIModel, Platform } from './types';

export const MODEL_INFO: Record<
  AIModel,
  { name: string; label: string; description: string; color: string; accent: string }
> = {
  gemini: {
    name: 'Gemini',
    label: 'Google Gemini 1.5 Pro',
    description: 'Multimodal · Fast · Cost-efficient',
    color: 'from-blue-500 to-cyan-400',
    accent: 'text-cyan-400',
  },
  'gpt-4': {
    name: 'GPT-4',
    label: 'OpenAI GPT-4 Turbo',
    description: 'High reasoning · Creative · Versatile',
    color: 'from-emerald-500 to-teal-400',
    accent: 'text-emerald-400',
  },
  claude: {
    name: 'Claude',
    label: 'Anthropic Claude 3.5 Sonnet',
    description: 'Nuanced · Safe · Long-form expert',
    color: 'from-amber-500 to-orange-400',
    accent: 'text-amber-400',
  },
};

export const PLATFORM_INFO: Record<
  Platform,
  { name: string; color: string; bg: string; maxChars: number }
> = {
  instagram: { name: 'Instagram', color: 'text-pink-400', bg: 'bg-pink-500/10', maxChars: 2200 },
  tiktok: { name: 'TikTok', color: 'text-zinc-100', bg: 'bg-zinc-500/10', maxChars: 150 },
  twitter: { name: 'Twitter / X', color: 'text-sky-400', bg: 'bg-sky-500/10', maxChars: 280 },
  linkedin: { name: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-500/10', maxChars: 3000 },
  youtube: { name: 'YouTube', color: 'text-red-400', bg: 'bg-red-500/10', maxChars: 5000 },
};

export const STOCK_IMAGES = [
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export function randomStockImage(seed: number) {
  return STOCK_IMAGES[seed % STOCK_IMAGES.length];
}

const SAMPLE_CAPTIONS = [
  '5 AI tools that will transform your content workflow in 2025. Swipe to see which ones made the cut. Which tool is your go-to?',
  'The secret to viral content isn\'t luck — it\'s systems. Here\'s how we automated 90% of our pipeline with AI. Save this post for later.',
  'Stop posting manually. Start posting strategically. This is the exact framework we use to plan 30 days of content in one afternoon.',
  'Nobody talks about this AI workflow: bulk-generate 100 posts from a CSV, preview them live, and auto-schedule across every platform.',
  'Your content calendar shouldn\'t take 40 hours a week. Here\'s the AI-powered system that cut ours to under 2 hours.',
];

const SAMPLE_HASHTAGS = [
  ['AIContent', 'ContentAutomation', 'CreatorEconomy'],
  ['SocialMediaOS', 'AICreator', 'ContentStrategy'],
  ['DigitalMarketing', 'AItools', 'Productivity'],
  ['ContentCreation', 'Automation', 'FutureOfWork'],
  ['ViralContent', 'AIWorkflow', 'CreatorTools'],
];

export function generateMockContent(topic: string, model: AIModel, platform: Platform, index: number) {
  const caption = SAMPLE_CAPTIONS[index % SAMPLE_CAPTIONS.length];
  const hashtags = SAMPLE_HASHTAGS[index % SAMPLE_HASHTAGS.length];
  return { caption, hashtags };
}
