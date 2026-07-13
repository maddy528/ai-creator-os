import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY secret is not configured.");
}

interface RowInput {
  topic: string;
  platform: string;
}

interface RowResult {
  caption: string;
  hashtags: string[];
}

async function generateSingle(topic: string, platform: string): Promise<RowResult> {
  const prompt = `You are a social media content creator. Write a single ${platform} post about "${topic}".
Tone: engaging.
Return ONLY a JSON object with this exact shape, no markdown, no explanation:
{"caption":"<the post caption>","hashtags":["tag1","tag2","tag3"]}
Rules:
- Caption should be optimized for ${platform}.
- Include 3-5 relevant hashtags (without the # symbol).
- Keep it natural and human-sounding.
- Do not include the topic verbatim unless it fits naturally.`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const geminiRes = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    throw new Error(`Gemini API ${geminiRes.status}: ${errText.slice(0, 200)}`);
  }

  const geminiData = await geminiRes.json();
  const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const parsed = JSON.parse(text);
    return {
      caption: parsed.caption || text || "Unable to generate content.",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
    };
  } catch {
    return { caption: text || "Unable to generate content.", hashtags: [] };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured. Add GEMINI_API_KEY as an edge function secret in your Supabase project settings." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Bulk mode: { rows: [{ topic, platform }, ...] }
    if (Array.isArray(body.rows)) {
      const rows = body.rows as RowInput[];
      if (rows.length === 0) {
        return new Response(
          JSON.stringify({ error: "No rows provided." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const results: (RowResult | { error: string })[] = [];
      for (const row of rows) {
        if (!row.topic || typeof row.topic !== "string") {
          results.push({ error: "Missing topic" });
          continue;
        }
        try {
          const result = await generateSingle(row.topic, row.platform || "instagram");
          results.push(result);
        } catch (err) {
          results.push({ error: err.message || "Generation failed" });
        }
      }

      return new Response(
        JSON.stringify({ results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Single mode: { topic, platform }
    const { topic, platform } = body as { topic?: string; platform?: string };
    if (!topic || typeof topic !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing required field: topic" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await generateSingle(topic, platform || "instagram");
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
