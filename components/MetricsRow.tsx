"use client";

import { TrendingUp, Users, BarChart2, Clock } from "lucide-react";

interface Metrics {
  marketSize: string;
  growthRate: string;
  targetAudience: string;
  setupTimeline: string;
}

interface Props {
  metrics: Metrics;
}

const CARDS = [
  {
    key: "marketSize" as keyof Metrics,
    label: "Market Size",
    icon: BarChart2,
    color: "#2c3e7d",
    bg: "#eef1fb",
  },
  {
    key: "growthRate" as keyof Metrics,
    label: "Growth Rate",
    icon: TrendingUp,
    color: "#22c55e",
    bg: "#dcfce7",
  },
  {
    key: "targetAudience" as keyof Metrics,
    label: "Target Audience",
    icon: Users,
    color: "#4998ce",
    bg: "#dbeafe",
  },
  {
    key: "setupTimeline" as keyof Metrics,
    label: "Setup Timeline",
    icon: Clock,
    color: "#e05c4b",
    bg: "#fee2e2",
  },
];

export default function MetricsRow({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="card p-5 flex flex-col gap-3 card-lift"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: bg }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              {label}
            </p>
            <p className="text-lg font-bold" style={{ color: "#1a1f36" }}>
              {metrics[key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
