"use client";

import { useEffect, useRef } from "react";

interface Props {
  score: number;
  verdict: string;
}

const COLOR_MAP = {
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
};

export default function ScoreGauge({ score, verdict }: Props) {
  const arcRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const color =
    score >= 70
      ? COLOR_MAP.green
      : score >= 50
      ? COLOR_MAP.amber
      : COLOR_MAP.red;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  // Count-up animation
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    let start = 0;
    const end = score;
    const duration = 1200;
    const step = 16;
    const increment = (end / (duration / step));
    const timer = setInterval(() => {
      start = Math.min(start + increment, end);
      el.textContent = Math.round(start).toString();
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [score]);

  const verdictBg =
    score >= 70 ? "#dcfce7" : score >= 50 ? "#fef3c7" : "#fee2e2";
  const verdictText =
    score >= 70 ? "#15803d" : score >= 50 ? "#b45309" : "#b91c1c";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-flex items-center justify-center">
        <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
          {/* Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#e8edf8"
            strokeWidth="10"
          />
          {/* Arc */}
          <circle
            ref={arcRef}
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="gauge-arc"
            style={{
              transition: "stroke-dashoffset 1.5s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={numRef}
            className="text-4xl font-bold"
            style={{ color }}
          >
            0
          </span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>

      {/* Verdict badge */}
      <span
        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ background: verdictBg, color: verdictText }}
      >
        {verdict}
      </span>
    </div>
  );
}
