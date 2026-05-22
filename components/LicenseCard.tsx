"use client";

import { ExternalLink, Award } from "lucide-react";

interface License {
  primary: string;
  alternatives: string[];
  estimatedCost: string;
  timeline: string;
  bestMatch: string;
  avyancoLink: string;
}

interface Props {
  license: License;
}

export default function LicenseCard({ license }: Props) {
  return (
    <div className="card p-6">
      {/* Primary license */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{ background: "linear-gradient(135deg,#2c3e7d,#1a2456)" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Award size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
              Recommended License
            </p>
            <h3 className="text-white font-bold text-lg leading-tight">
              {license.primary}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-0.5">Estimated Cost</p>
            <p className="text-white font-semibold text-sm">{license.estimatedCost}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-0.5">Processing Time</p>
            <p className="text-white font-semibold text-sm">{license.timeline}</p>
          </div>
        </div>
      </div>

      {/* Best match reason */}
      <div
        className="rounded-lg p-4 mb-5 border-l-4"
        style={{ background: "#f0f7ff", borderLeftColor: "#4998ce" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#4998ce" }}>
          ✓ Why this license?
        </p>
        <p className="text-sm text-gray-700">{license.bestMatch}</p>
      </div>

      {/* Alternatives */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Alternative Options
        </p>
        <div className="flex flex-wrap gap-2">
          {license.alternatives.map((alt, i) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1.5 rounded-full border"
              style={{ borderColor: "#2c3e7d", color: "#2c3e7d" }}
            >
              {alt}
            </span>
          ))}
        </div>
      </div>

      {/* Avyanco CTA */}
      <a
        href={license.avyancoLink}
        target="_blank"
        rel="noopener noreferrer"
        id="license-avyanco-link"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-95"
        style={{ background: "linear-gradient(135deg,#fd4b37,#fd4b37)" }}
      >
        <ExternalLink size={14} />
        Get Help Setting Up with Avyanco
      </a>
    </div>
  );
}
