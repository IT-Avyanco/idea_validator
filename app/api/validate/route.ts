import { NextRequest } from "next/server";
import { buildValidationPrompt, callGemini, FormData } from "@/lib/gemini";
import { getCachedValidation, setCachedValidation } from "@/lib/cache";
import { checkRateLimit, recordRequest } from "@/lib/rateLimit";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    // Basic validation
    if (!body.businessIdea || body.businessIdea.trim().length < 20) {
      return Response.json(
        {
          error: true,
          message:
            "Please provide a more detailed business idea (at least 20 characters).",
        },
        { status: 400 }
      );
    }

    // Check IP Rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";

    const rateLimitStatus = checkRateLimit(ip);
    if (!rateLimitStatus.allowed) {
      return Response.json(
        {
          error: true,
          rateLimitExceeded: true,
          message: "You've used your 3 free validations today. Book a consultation for unlimited access →",
          resetTime: rateLimitStatus.resetTime,
        },
        { status: 429 }
      );
    }

    // Check API key is configured and not a placeholder
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

    // Check Cache
    const cachedResult = getCachedValidation(body.businessIdea, body.targetEmirate);
    if (cachedResult) {
      // Record successful request for IP rate limiting
      recordRequest(ip);
      return Response.json({ success: true, data: cachedResult, cached: true });
    }

    const prompt = buildValidationPrompt(body);
    const result = await callGemini(prompt);

    // Cache the result
    setCachedValidation(body.businessIdea, body.targetEmirate, result);

    // Record successful request for IP rate limiting
    recordRequest(ip);

    return Response.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/validate] Error:", message);

    // Provide specific error messages based on what went wrong
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

    if (message.includes("GEMINI_API_KEY")) {
      return Response.json(
        {
          error: true,
          message:
            "⚠️ Gemini API key is missing. Add GEMINI_API_KEY to .env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

    // Return actual error in development for easier debugging
    return Response.json(
      {
        error: true,
        message: `Validation failed: ${message}`,
      },
      { status: 500 }
    );
  }
}
