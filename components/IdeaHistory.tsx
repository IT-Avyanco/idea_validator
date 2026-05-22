"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2, RotateCcw } from "lucide-react";
import type { ValidationResult, FormData } from "@/lib/gemini";

const STORAGE_KEY = "ideaproof_history";
const MAX_ITEMS = 5;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  formData: FormData;
  results: ValidationResult;
}

interface Props {
  onRestore: (entry: HistoryEntry) => void;
  onHistoryChange?: (hasHistory: boolean) => void;
}

export function saveToHistory(formData: FormData, results: ValidationResult) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      formData,
      results,
    };
    const updated = [entry, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

function scoreColor(score: number) {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function timeSince(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function IdeaHistory({ onRestore, onHistoryChange }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    onHistoryChange?.(history.length > 0);
  }, [history.length, onHistoryChange]);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    onHistoryChange?.(false);
  };

  if (history.length === 0) return null;

  return (
    <section
      id="history"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#1a1f36" }}>
            Previous Validations
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Your last {history.length} validated idea
            {history.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={13} />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="card card-lift p-4 cursor-pointer"
            onClick={() => onRestore(entry)}
          >
            {/* Score badge */}
            <div className="flex items-start justify-between mb-3">
              <span
                className="text-2xl font-bold"
                style={{ color: scoreColor(entry.results.overallScore) }}
              >
                {entry.results.overallScore}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ background: scoreColor(entry.results.overallScore) }}
              >
                /100
              </span>
            </div>

            <p
              className="font-semibold text-sm mb-1 line-clamp-2"
              style={{ color: "#1a1f36" }}
            >
              {entry.results.ideaTitle}
            </p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-1">
              {entry.formData.targetEmirate}
            </p>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} />
                {timeSince(entry.timestamp)}
              </span>
              <span
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: "#4998ce" }}
              >
                <RotateCcw size={11} />
                Restore
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
