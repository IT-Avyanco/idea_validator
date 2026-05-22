/**
 * lib/gemini.ts
 * Builds the Gemini prompt and calls the REST API via the @google/generative-ai SDK.
 * This file is imported ONLY from server-side API routes — never from client components.
 */

export interface FormData {
  businessIdea: string;
  targetEmirate: string;
  category: string[];
  budget: string;
  targetAudience: string;
  uniqueValue: string;
}

export interface ValidationResult {
  ideaTitle: string;
  overallScore: number;
  verdict: string;
  executiveSummary: string;
  metrics: {
    marketSize: string;
    growthRate: string;
    targetAudience: string;
    setupTimeline: string;
  };
  competitors: Array<{
    name: string;
    strength: number;
    weakness: string;
    gap: string;
  }>;
  license: {
    primary: string;
    alternatives: string[];
    estimatedCost: string;
    timeline: string;
    bestMatch: string;
    avyancoLink: string;
  };
  opportunities: string[];
  redFlags: Array<{
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    issue: string;
  }>;
  avyancoServices: string[];
  nextSteps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
}

export function buildValidationPrompt(data: FormData): string {
  return `You are a UAE business consultant. Validate this business idea for the UAE market.
Idea: ${data.businessIdea}
Emirate: ${data.targetEmirate}
Category: ${data.category.join(", ")}
Budget: ${data.budget}
Audience: ${data.targetAudience}
UVP: ${data.uniqueValue}

Return ONLY a valid JSON object matching this schema. No markdown wrappers or extra text:
{
  "ideaTitle": "catchy business name, 3-6 words",
  "overallScore": 1-100,
  "verdict": "Highly Viable|Viable|Needs Refinement|High Risk",
  "executiveSummary": "2-3 sentences on UAE viability",
  "metrics": {
    "marketSize": "e.g. AED 2.4B",
    "growthRate": "e.g. 12.4% CAGR",
    "targetAudience": "e.g. 180,000 customers",
    "setupTimeline": "e.g. 3-4 weeks"
  },
  "competitors": [
    {
      "name": "competitor name",
      "strength": 1-100,
      "weakness": "main weakness",
      "gap": "market gap you exploit"
    }
  ],
  "license": {
    "primary": "e.g. Professional License - DMCC",
    "alternatives": ["alt 1", "alt 2"],
    "estimatedCost": "e.g. AED 15,000 - 25,000",
    "timeline": "e.g. 2-3 weeks",
    "bestMatch": "why this license fits",
    "avyancoLink": "https://avyanco.com/contact/"
  },
  "opportunities": ["op 1", "op 2", "op 3", "op 4"],
  "redFlags": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "issue": "specific risk"
    }
  ],
  "avyancoServices": [
    "Business Setup & Licensing",
    "PRO Services",
    "Visa Processing",
    "Bank Account Opening",
    "Office Space Solutions",
    "Trademark Registration"
  ],
  "nextSteps": [
    {"step": "01", "title": "action 1", "description": "1 sentence"},
    {"step": "02", "title": "action 2", "description": "1 sentence"},
    {"step": "03", "title": "action 3", "description": "1 sentence"}
  ]
}
Be specific and realistic about the UAE market. Provide 3 competitors, 4 opportunities, and 3-4 red flags. Monetary values in AED.`;
}

/**
 * Cleans common AI JSON formatting glitches before parsing.
 */
function sanitiseJson(raw: string): string {
  return (
    raw
      // Remove trailing commas before ] or }
      .replace(/,\s*([\]}])/g, "$1")
      // Replace smart/curly quotes with straight quotes
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      // Remove literal \r and stray \t outside JSON strings (best-effort)
      .replace(/\r/g, "")
  );
}

export async function callGemini(prompt: string): Promise<ValidationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    // Try to parse the error JSON for a more specific message
    let errBody = "";
    try {
      const errJson = await response.json();
      errBody = errJson?.error?.message ?? JSON.stringify(errJson);
    } catch {
      errBody = await response.text().catch(() => "Unknown error");
    }
    throw new Error(`Gemini API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Extract JSON — strip possible markdown code fences
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No valid JSON found in Gemini response");
  }

  const raw = sanitiseJson(jsonMatch[0]);

  let parsed: ValidationResult;
  try {
    parsed = JSON.parse(raw);
  } catch (firstErr) {
    // Last-resort: try stripping any remaining control characters
    try {
      const stripped = raw.replace(/[\u0000-\u0009\u000b\u000c\u000e-\u001f]/g, "");
      parsed = JSON.parse(stripped);
    } catch {
      throw new Error(
        `JSON parse failed after sanitisation: ${firstErr instanceof Error ? firstErr.message : String(firstErr)}`
      );
    }
  }
  return parsed;
}
