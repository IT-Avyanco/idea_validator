"use client";

import { CheckCircle, AlertTriangle } from "lucide-react";

interface RedFlag {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  issue: string;
}

interface Props {
  opportunities: string[];
  redFlags: RedFlag[];
}

const SEVERITY_CONFIG = {
  CRITICAL: { bg: "#fee2e2", border: "#ef4444", text: "#b91c1c", badge: "#ef4444" },
  HIGH: { bg: "#fff7ed", border: "#f97316", text: "#c2410c", badge: "#f97316" },
  MEDIUM: { bg: "#fefce8", border: "#eab308", text: "#854d0e", badge: "#eab308" },
  LOW: { bg: "#f0fdf4", border: "#22c55e", text: "#166534", badge: "#22c55e" },
};

export default function OpportunitiesFlags({ opportunities, redFlags }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Opportunities */}
      <div>
        <h3
          className="font-bold text-base mb-4 flex items-center gap-2"
          style={{ color: "#15803d" }}
        >
          <CheckCircle size={18} />
          Market Opportunities
        </h3>
        <div className="flex flex-col gap-3">
          {opportunities.map((opp, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex gap-3 items-start"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <CheckCircle
                size={16}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#22c55e" }}
              />
              <p className="text-sm text-gray-700">{opp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Red Flags */}
      <div>
        <h3
          className="font-bold text-base mb-4 flex items-center gap-2"
          style={{ color: "#b91c1c" }}
        >
          <AlertTriangle size={18} />
          Risk Factors
        </h3>
        <div className="flex flex-col gap-3">
          {redFlags.map((flag, i) => {
            const cfg = SEVERITY_CONFIG[flag.severity];
            return (
              <div
                key={i}
                className="rounded-xl p-4 border-l-4 flex gap-3 items-start"
                style={{
                  background: cfg.bg,
                  borderLeftColor: cfg.border,
                }}
              >
                <div className="flex flex-col gap-1 flex-1">
                  <span
                    className="text-xs font-bold uppercase tracking-wider rounded px-1.5 py-0.5 inline-block w-fit text-white"
                    style={{ background: cfg.badge }}
                  >
                    {flag.severity}
                  </span>
                  <p className="text-sm" style={{ color: cfg.text }}>
                    {flag.issue}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
