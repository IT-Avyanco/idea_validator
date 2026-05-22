export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
      return Response.json({ error: "Missing API key in .env.local" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.text();
      return Response.json({ status: res.status, error: err });
    }

    const data = (await res.json()) as { models?: Array<{ name?: string }> };
    const models = data.models?.map((model) => model.name).filter((name): name is string => Boolean(name)) ?? [];
    return Response.json({ success: true, models });
  } catch (err: unknown) {
    return Response.json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
}
