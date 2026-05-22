"use client";

import { Check } from "lucide-react";

interface Props {
  services: string[];
}

export default function AvyancoServices({ services }: Props) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "linear-gradient(135deg,#2c3e7d,#1a2456)" }}
    >
      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-4">
        How Avyanco Can Help You
      </p>
      <div className="flex flex-wrap gap-2">
        {services.map((service, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white rounded-full px-4 py-2"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Check size={13} style={{ color: "#22c55e" }} />
            {service}
          </span>
        ))}
      </div>
      <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <p className="text-white/60 text-xs">
          Trusted by 5,000+ businesses across UAE. Licensed business setup
          consultancy since 2008.
        </p>
      </div>
    </div>
  );
}
