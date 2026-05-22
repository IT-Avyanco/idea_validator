"use client";

import { useEffect, useRef } from "react";
import ScoreGauge from "./ScoreGauge";
import MetricsRow from "./MetricsRow";
import CompetitorCards from "./CompetitorCards";
import LicenseCard from "./LicenseCard";
import OpportunitiesFlags from "./OpportunitiesFlags";
import AvyancoServices from "./AvyancoServices";
import NextStepsTimeline from "./NextStepsTimeline";
import ActionButtons from "./ActionButtons";
import ImproveScore from "./ImproveScore";
import type { ValidationResult, FormData } from "@/lib/gemini";

interface Props {
  results: ValidationResult;
  formData: FormData;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold mb-5" style={{ color: "#1a1f36" }}>
      {children}
    </h2>
  );
}

export default function ResultsSection({ results, formData }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Smooth scroll into view on mount
  useEffect(() => {
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="results"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12"
    >
      {/* ── Top bar: title + score ── */}
      <div
        className="card p-6 mb-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
        style={{ border: "1px solid #dbe4f4" }}
      >
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Validation Report
          </p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a1f36" }}>
            {results.ideaTitle}
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {results.executiveSummary}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: "#eef1fb", color: "#2c3e7d" }}
            >
              📍 {formData.targetEmirate}
            </span>
            {formData.category.map((c) => (
              <span
                key={c}
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: "#fff7ed", color: "#c2410c" }}
              >
                {c}
              </span>
            ))}
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: "#f0fdf4", color: "#166534" }}
            >
              💰 {formData.budget}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ScoreGauge score={results.overallScore} verdict={results.verdict} />
        </div>
      </div>

      {/* ── Improve Score ── */}
      <div className="mb-6">
        <ImproveScore
          businessIdea={formData.businessIdea}
          score={results.overallScore}
          ideaTitle={results.ideaTitle}
        />
      </div>

      {/* ── Action Buttons ── */}
      <div className="mb-8">
        <ActionButtons results={results} formData={formData} />
      </div>

      {/* ── Metrics ── */}
      <div className="mb-8">
        <SectionTitle>📊 Market Metrics</SectionTitle>
        <MetricsRow metrics={results.metrics} />
      </div>

      {/* ── Competitors ── */}
      <div className="mb-8">
        <SectionTitle>🏁 Competitor Analysis</SectionTitle>
        <CompetitorCards competitors={results.competitors} />
      </div>

      {/* ── License + Avyanco side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <SectionTitle>📋 License Recommendation</SectionTitle>
          <LicenseCard license={results.license} />
        </div>
        <div>
          <SectionTitle>🤝 Avyanco Services</SectionTitle>
          <AvyancoServices services={results.avyancoServices} />
          <div className="mt-6">
            <SectionTitle>🗺️ Next Steps</SectionTitle>
            <NextStepsTimeline steps={results.nextSteps} />
          </div>
        </div>
      </div>

      {/* ── Opportunities & Red Flags ── */}
      <div className="mb-8">
        <SectionTitle>⚡ Opportunities &amp; Risk Factors</SectionTitle>
        <OpportunitiesFlags
          opportunities={results.opportunities}
          redFlags={results.redFlags}
        />
      </div>

      {/* ── Bottom CTA ── */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Ready to Make It Real?
        </h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm">
          Our team has helped 5,000+ entrepreneurs set up businesses in the UAE.
          Book a free 30-minute consultation and let&apos;s discuss your idea.
        </p>
        <a
          href="https://avyanco.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          id="results-cta-btn"
          className="inline-flex items-center gap-2 font-bold text-base rounded-full px-8 py-4 text-white transition-all animate-pulse-ring"
          style={{
            background: "linear-gradient(135deg,#fd4b37,#fd4b37)",
            boxShadow: "0 8px 28px #fd4b37",
          }}
        >
          Book Free Consultation →
        </a>
      </div>
    </section>
  );
}
