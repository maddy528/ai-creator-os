import type { AIModel, Platform } from './types';
import { generateMockContent } from './data';

interface GeminiResponse {
  caption: string;
  hashtags: string[];
}

interface BulkResult {
  caption: string;
  hashtags: string[];
  error?: string;
}

function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[key.replace('NEXT_PUBLIC_', '')];
  }
  return undefined;
}

export async function generateContent(
  topic: string,
  model: AIModel,
  platform: Platform,
  index: number
): Promise<{ caption: string; hashtags: string[] }> {
  if (model !== 'gemini') {
    await new Promise((res) => setTimeout(res, 600));
    return generateMockContent(topic, model, platform, index);
  }

  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    await new Promise((res) => setTimeout(res, 600));
    return generateMockContent(topic, model, platform, index);
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/gemini-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ topic, platform }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed (${res.status})`);
    }

    const data: GeminiResponse = await res.json();
    if (!data.caption) throw new Error('No caption in response');

    return {
      caption: data.caption,
      hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
    };
  } catch (err) {
    console.error('Gemini generation failed, falling back to mock:', err);
    return generateMockContent(topic, model, platform, index);
  }
}

export async function generateContentBulk(
  rows: { topic: string; platform: Platform; model: AIModel }[]
): Promise<BulkResult[]> {
  const geminiRows = rows.filter((r) => r.model === 'gemini');
  const nonGeminiResults = new Map<number, BulkResult>();

  rows.forEach((row, i) => {
    if (row.model !== 'gemini') {
      const mock = generateMockContent(row.topic, row.model, row.platform, i);
      nonGeminiResults.set(i, { caption: mock.caption, hashtags: mock.hashtags });
    }
  });

  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey || geminiRows.length === 0) {
    const results: BulkResult[] = [];
    rows.forEach((row, i) => {
      if (nonGeminiResults.has(i)) {
        results.push(nonGeminiResults.get(i)!);
      } else {
        const mock = generateMockContent(row.topic, 'gemini', row.platform, i);
        results.push({ caption: mock.caption, hashtags: mock.hashtags });
      }
    });
    await new Promise((res) => setTimeout(res, 400));
    return results;
  }

  const geminiRowIndices = rows.map((row, i) => (row.model === 'gemini' ? i : -1)).filter((i) => i >= 0);

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/gemini-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        rows: geminiRows.map((r) => ({ topic: r.topic, platform: r.platform })),
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed (${res.status})`);
    }

    const data = await res.json();
    const bulkResults: BulkResult[] = data.results || [];

    const finalResults: BulkResult[] = [];
    let geminiIdx = 0;

    for (let i = 0; i < rows.length; i++) {
      if (nonGeminiResults.has(i)) {
        finalResults.push(nonGeminiResults.get(i)!);
      } else {
        const bulkResult = bulkResults[geminiIdx];
        geminiIdx++;
        if (bulkResult && bulkResult.caption && !bulkResult.error) {
          finalResults.push({
            caption: bulkResult.caption,
            hashtags: Array.isArray(bulkResult.hashtags) ? bulkResult.hashtags : [],
          });
        } else {
          const mock = generateMockContent(rows[i].topic, 'gemini', rows[i].platform, i);
          finalResults.push({
            caption: mock.caption,
            hashtags: mock.hashtags,
            error: bulkResult?.error,
          });
        }
      }
    }

    return finalResults;
  } catch (err) {
    console.error('Bulk Gemini generation failed, falling back to mock:', err);
    const results: BulkResult[] = [];
    rows.forEach((row, i) => {
      if (nonGeminiResults.has(i)) {
        results.push(nonGeminiResults.get(i)!);
      } else {
        const mock = generateMockContent(row.topic, 'gemini', row.platform, i);
        results.push({ caption: mock.caption, hashtags: mock.hashtags });
      }
    });
    return results;
  }
}
