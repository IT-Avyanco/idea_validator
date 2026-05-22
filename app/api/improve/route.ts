import { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { businessIdea, score, ideaTitle } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
      return Response.json(
        {
          error: true,
          message:
            "⚠️ Gemini API key is not configured. Please add your GEMINI_API_KEY to .env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const prompt = `You are a UAE business consultant. The following business idea received a viability score of ${score}/100:

Business Idea: "${businessIdea}"
Idea Title: "${ideaTitle}"

Provide exactly 3 specific, actionable improvement suggestions that would increase the score. Return ONLY valid JSON, no markdown:

{
  "improvements": [
    {
      "title": "<short action title>",
      "before": "<current state / problem>",
      "after": "<improved state / solution>",
      "impact": "<expected score increase e.g. +8 points>"
    },
    {
      "title": "<short action title>",
      "before": "<current state / problem>",
      "after": "<improved state / solution>",
      "impact": "<expected score increase>"
    },
    {
      "title": "<short action title>",
      "before": "<current state / problem>",
      "after": "<improved state / solution>",
      "impact": "<expected score increase>"
    }
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      let errBody = "";
      try {
        const errJson = await res.json();
        errBody = errJson?.error?.message ?? JSON.stringify(errJson);
      } catch {
        errBody = await res.text().catch(() => "Unknown error");
      }
      throw new Error(`Gemini API error ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json({ success: true, data: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/improve] Error:", message);

    if (message.includes("API_KEY_INVALID") || message.includes("400")) {
      return Response.json(
        {
          error: true,
          message:
            "❌ Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.local and restart the server.",
        },
        { status: 500 }
      );
    }

    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      return Response.json(
        {
          error: true,
          message:
            "⏳ Gemini API rate limit reached. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: true, message: `Could not generate improvements: ${message}` },
      { status: 500 }
    );
  }
}
