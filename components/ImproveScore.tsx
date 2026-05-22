"use client";

import { useState } from "react";
import { ChevronDown, Loader2, TrendingUp } from "lucide-react";

interface Improvement {
  title: string;
  before: string;
  after: string;
  impact: string;
}

interface Props {
  businessIdea: string;
  score: number;
  ideaTitle: string;
}

export default function ImproveScore({ businessIdea, score, ideaTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [improvements, setImprovements] = useState<Improvement[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setOpen((prev) => !prev);
    if (!open && !improvements && !loading) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/improve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessIdea, score, ideaTitle }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.message);
        setImprovements(json.data.improvements);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load improvements";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Accordion header */}
      <button
        id="improve-score-toggle"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#eef1fb" }}
          >
            <TrendingUp size={18} style={{ color: "#2c3e7d" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#1a1f36" }}>
              How to Improve My Score
            </p>
            <p className="text-xs text-gray-500">
              Get AI-powered actionable suggestions
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className="text-gray-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Accordion body */}
      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? "800px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 size={20} className="animate-spin" style={{ color: "#2c3e7d" }} />
              <span className="text-sm text-gray-500">
                Analysing your idea for improvements…
              </span>
            </div>
          )}

          {error && (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: "#fee2e2", color: "#b91c1c" }}
            >
              {error}
            </div>
          )}

          {improvements && (
            <div className="flex flex-col gap-4">
              {improvements.map((imp, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border"
                  style={{ borderColor: "#e8edf8" }}
                >
                  {/* Title bar */}
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ background: "#eef1fb" }}
                  >
                    <h4 className="font-bold text-sm" style={{ color: "#2c3e7d" }}>
                      {i + 1}. {imp.title}
                    </h4>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: "#22c55e" }}
                    >
                      {imp.impact}
                    </span>
                  </div>
                  {/* Before / After */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
                        ✗ Current State
                      </p>
                      <p className="text-sm text-gray-600">{imp.before}</p>
                    </div>
                    <div className="p-4">
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{ color: "#22c55e" }}
                      >
                        ✓ After Improvement
                      </p>
                      <p className="text-sm text-gray-700">{imp.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
