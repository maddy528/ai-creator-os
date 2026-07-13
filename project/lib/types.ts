export type ViewId =
  | 'dashboard'
  | 'content-factory'
  | 'media-library'
  | 'distribution'
  | 'analytics';

export type AIModel = 'gemini' | 'gpt-4' | 'claude';

export type Platform = 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'youtube';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface ContentRow {
  id: string;
  topic: string;
  caption: string;
  hashtags: string[];
  platform: Platform;
  model: AIModel;
  status: 'idle' | 'generating' | 'done' | 'error';
  scheduledFor?: string;
}

export interface ScheduledPost {
  id: string;
  caption: string;
  platform: Platform;
  scheduledAt: string;
  status: PostStatus;
  thumbnail: string;
  model: AIModel;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: string;
  uploadedAt: string;
}
