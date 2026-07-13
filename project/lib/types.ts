export type AIModel = 'gemini-pro' | 'gemini-flash';

export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'twitter';

export type RowStatus = 'pending' | 'generating' | 'completed' | 'error';

export type ImageStatus = 'idle' | 'generating' | 'done' | 'error';

export type ViewName = 'dashboard' | 'factory' | 'distribution' | 'analytics';

export interface ContentRow {
  id: string;
  index: number;
  topic: string;
  platform: Platform;
  model: AIModel;
  status: RowStatus;
  caption: string;
  hashtags: string[];
  hook: string;
  valuePoint: string;
  imageUrl: string | null;
  imageStatus: ImageStatus;
  imagePrompt: string;
}
