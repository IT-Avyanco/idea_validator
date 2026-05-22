"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ResultsSection from "@/components/ResultsSection";
import { saveToHistory, type HistoryEntry } from "@/components/IdeaHistory";
import Footer from "@/components/Footer";
import type { ValidationResult, FormData } from "@/lib/gemini";
import { ArrowUp } from "lucide-react";

const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const IdeaHistory = dynamic(() => import("@/components/IdeaHistory"), { ssr: false });

export default function Home() {
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [historyKey, setHistoryKey] = useState(0); // force IdeaHistory re-render
  const [hasHistory, setHasHistory] = useState(false);

  const handleResults = (data: unknown, fd: FormData) => {
    const typedData = data as ValidationResult;
    setResults(typedData);
    setFormData(fd);
    saveToHistory(fd, typedData);
    setHistoryKey((k) => k + 1);
  };

  const handleStart = () => {
    setResults(null);
    setFormData(null);
  };

  const handleRestore = (entry: HistoryEntry) => {
    setResults(entry.results);
    setFormData(entry.formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const handleNewValidation = () => {
    setResults(null);
    setFormData(null);
    setTimeout(() => {
      document
        .getElementById("validate")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <Navbar hasHistory={hasHistory} />

      <main className="flex-1">
        <HeroSection onResults={handleResults} onStart={handleStart} />

        {/* Results — shown after validation */}
        {results && formData && (
          <div>
            <ResultsSection results={results} formData={formData} />

            {/* Validate again link */}
            <div className="text-center pb-8">
              <button
                onClick={handleNewValidation}
                className="cta-muted"
              >
                ← Validate Another Idea
              </button>
            </div>
          </div>
        )}

        {/* Idea History */}
        <IdeaHistory key={historyKey} onRestore={handleRestore} onHistoryChange={setHasHistory} />
      </main>

      <Footer />

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg,#2c3e7d,#3e56ab)" }}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
