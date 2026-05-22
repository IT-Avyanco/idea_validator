"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import ValidatorForm from "@/components/ValidatorForm";
import type { FormData } from "@/lib/gemini";

const BADGES = [
  "2,400+ ideas validated",
  "UAE-focused insights",
  "Instant results",
];

interface Props {
  onResults: (data: unknown, fd: FormData) => void;
  onStart: () => void;
}

export default function HeroSection({ onResults, onStart }: Props) {
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [textRef.current, formRef.current].forEach((el, index) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      setTimeout(() => {
        el.style.transition = "all 0.7s cubic-bezier(0.22,1,0.36,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 180 + index * 150);
    });
  }, []);

  return (
    <section className="hero-scene relative pt-24 pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-noise" />
        <div className="hero-aurora hero-aurora-left" />
        <div className="hero-aurora hero-aurora-right" />
      </div>

      <div className="relative max-w-7xl mx-auto grid xl:grid-cols-[1.05fr_1fr] gap-8 xl:gap-10 items-start">
        <div ref={textRef} className="pt-2 sm:pt-5">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide bg-white/75 border border-white/60 text-slate-700 shadow-sm">
            <Sparkles size={14} className="text-amber-500" />
            AI Business Validation Engine
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 max-w-2xl">
            Build a Stronger UAE Startup Idea
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(120deg,#2c3e7d,#4998ce,#e05c4b)" }}>
              Before You Spend a Dirham
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed">
            Skip guesswork. Validate demand, competition, licensing, and positioning with a step-by-step AI workflow designed for UAE founders.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {BADGES.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-white/80 border border-slate-200 text-slate-700 text-sm font-medium shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            <a
              href="https://avyanco.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-muted w-full sm:w-auto justify-center"
            >
              Explore Avyanco Services
            </a>
          </div>
        </div>

        <div ref={formRef}>
          <ValidatorForm onResults={onResults} onStart={onStart} embedded />
        </div>
      </div>
    </section>
  );
}
