import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface RequestBody {
  topic: string;
  platform: string;
  model?: string;
}

function buildImageUrl(prompt: string, platform: string): string {
  const dims =
    platform === "tiktok" ? { w: 512, h: 910 } :
    platform === "linkedin" ? { w: 768, h: 402 } :
    platform === "twitter" ? { w: 640, h: 360 } :
    { w: 640, h: 640 };

  const encoded = encodeURIComponent(prompt.slice(0, 200));
  return `https://image.pollinations.ai/prompt/${encoded}?width=${dims.w}&height=${dims.h}&nologo=true&model=flux`;
}

async function generateSingle(topic: string, platform: string, model: string): Promise<{
  hook: string;
  valuePoint: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl: string;
}> {
  const prompt = `You are an expert social media content creator. Write a ${platform} post about "${topic}".

Structure your response with clear line breaks between three sections:

1. HOOK - A scroll-stopping first line (max 15 words).
2. VALUE POINT - One concrete takeaway or insight for the reader (2-3 sentences).
3. HASHTAGS - 3-5 relevant hashtags (without the # symbol).

Return ONLY a JSON object with this exact shape, no markdown, no explanation:
{"hook":"<the hook line>","valuePoint":"<the value point>","caption":"<full post combining hook + value point with line breaks>","hashtags":["tag1","tag2","tag3"],"imagePrompt":"<a concise visual description for an image generation AI, capturing the essence of the post>"}

Rules:
- Caption should use \\n for line breaks between the hook, value point, and hashtags.
- Keep it natural and human-sounding.
- The imagePrompt should be a short, vivid description suitable for a text-to-image model (max 20 words).`;

  const geminiModel = model || "gemini-1.5-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`;

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

  let parsed: { hook: string; valuePoint: string; caption: string; hashtags: string[]; imagePrompt: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { hook: "", valuePoint: "", caption: text || "Unable to generate content.", hashtags: [], imagePrompt: topic };
  }

  const imagePrompt = parsed.imagePrompt || topic;
  return {
    hook: parsed.hook || "",
    valuePoint: parsed.valuePoint || "",
    caption: parsed.caption || text || "",
    hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
    imagePrompt,
    imageUrl: buildImageUrl(imagePrompt, platform),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json() as RequestBody;
    const { topic, platform, model } = body;

    if (!topic || typeof topic !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing required field: topic" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await generateSingle(topic, platform || "instagram", model || "gemini-1.5-flash");
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
