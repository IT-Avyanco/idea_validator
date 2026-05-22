"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { FormData } from "@/lib/gemini";
import WhatsAppIcon from "./WhatsAppIcon";

const EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

const CATEGORIES = [
  "Technology",
  "F&B",
  "Retail",
  "Real Estate",
  "Healthcare",
  "Education",
  "Logistics",
  "Consulting",
  "Tourism",
  "Manufacturing",
  "E-Commerce",
  "Finance",
];

const BUDGETS = [
  "Under AED 20,000",
  "AED 20,000 - 50,000",
  "AED 50,000 - 150,000",
  "AED 150,000 - 500,000",
  "AED 500,000+",
];

const EXAMPLES = [
  {
    label: "Cloud Kitchen",
    data: {
      businessIdea:
        "A cloud kitchen concept offering authentic Italian pasta and pizza through delivery apps, targeting busy professionals and families in Dubai Marina area.",
      targetEmirate: "Dubai",
      category: ["F&B"],
      budget: "AED 50,000 - 150,000",
      targetAudience: "Busy professionals and families aged 25-45",
      uniqueValue:
        "Premium ingredients imported from Italy with 30-minute guaranteed delivery",
    },
  },
  {
    label: "B2B SaaS Platform",
    data: {
      businessIdea:
        "A B2B SaaS platform for UAE SMEs to automate VAT filing, payroll, and compliance reporting in one dashboard.",
      targetEmirate: "Abu Dhabi",
      category: ["Technology", "Finance"],
      budget: "AED 150,000 - 500,000",
      targetAudience: "UAE SMEs with 10-100 employees",
      uniqueValue:
        "Arabic-first compliance platform with built-in FTA integration and live CA support",
    },
  },
  {
    label: "Fitness Studio",
    data: {
      businessIdea:
        "A boutique fitness studio combining HIIT training with traditional Arabic wellness practices, targeting expats and locals in Sharjah.",
      targetEmirate: "Sharjah",
      category: ["Healthcare"],
      budget: "AED 50,000 - 150,000",
      targetAudience: "Health-conscious residents aged 20-40",
      uniqueValue:
        "Fusion of modern fitness science with traditional Emirati wellness for a differentiated market position",
    },
  },
];

const RATE_LIMIT_KEY = "ideaproof_daily_count";
const RATE_LIMIT_DATE_KEY = "ideaproof_date";
const MAX_DAILY = 3;

const LOADING_STEPS = [
  "Analyzing your business concept",
  "Checking UAE market viability",
  "Mapping key competitors",
  "Preparing licensing insights",
  "Finalizing your report",
];

const STEP_TITLES = ["Your Idea", "Market Basics", "Positioning"] as const;

interface Props {
  onResults: (results: unknown, formData: FormData) => void;
  onStart?: () => void;
  embedded?: boolean;
}

export default function ValidatorForm({ onResults, onStart, embedded = false }: Props) {
  const getInitialRateCount = () => {
    if (typeof window === "undefined") return 0;

    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(RATE_LIMIT_DATE_KEY);
    if (savedDate !== today) {
      localStorage.setItem(RATE_LIMIT_DATE_KEY, today);
      localStorage.setItem(RATE_LIMIT_KEY, "0");
      return 0;
    }

    return parseInt(localStorage.getItem(RATE_LIMIT_KEY) ?? "0", 10);
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessIdea: "",
    targetEmirate: "",
    category: [],
    budget: "",
    targetAudience: "",
    uniqueValue: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rateCount, setRateCount] = useState(getInitialRateCount);
  const [backendRateLimited, setBackendRateLimited] = useState(false);

  const isLimited = rateCount >= MAX_DAILY || backendRateLimited;

  const validationsLeft = useMemo(() => Math.max(0, MAX_DAILY - rateCount), [rateCount]);

  const scrollToValidate = () => {
    setTimeout(() => {
      document.getElementById("validate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const setExample = (example: (typeof EXAMPLES)[number]) => {
    setFormData(example.data);
    setErrors({});
    setStep(2);
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((item) => item !== cat)
        : [...prev.category, cat],
    }));
  };

  const validateByStep = (targetStep: number) => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (targetStep >= 1) {
      if (!formData.businessIdea || formData.businessIdea.trim().length < 30) {
        nextErrors.businessIdea = "Describe your idea in at least 30 characters.";
      }
    }

    if (targetStep >= 2) {
      if (!formData.targetEmirate) {
        nextErrors.targetEmirate = "Select a target emirate.";
      }
      if (formData.category.length === 0) {
        nextErrors.category = "Pick at least one category.";
      }
      if (!formData.budget) {
        nextErrors.budget = "Select your investment budget.";
      }
    }

    if (targetStep >= 3) {
      if (!formData.targetAudience || formData.targetAudience.trim().length < 10) {
        nextErrors.targetAudience = "Describe your target audience in at least 10 characters.";
      }
      if (!formData.uniqueValue || formData.uniqueValue.trim().length < 10) {
        nextErrors.uniqueValue = "Describe your unique value in at least 10 characters.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    const canProceed = validateByStep(step);
    if (!canProceed) return;
    setSubmitError(null);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateByStep(3)) return;

    if (isLimited) {
      setSubmitError(`You reached the daily limit of ${MAX_DAILY} validations. Please try again tomorrow.`);
      return;
    }

    if (onStart) onStart();

    setLoading(true);
    setSubmitError(null);
    setLoadingStep(0);
    setProgress(0);
    scrollToValidate();

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        const next = prev + 1;
        setProgress((next / LOADING_STEPS.length) * 100);
        if (next >= LOADING_STEPS.length - 1) clearInterval(stepInterval);
        return next;
      });
    }, 1400);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      clearInterval(stepInterval);

      if (!res.ok || json.error) {
        if (res.status === 429 || json.rateLimitExceeded) {
          localStorage.setItem(RATE_LIMIT_KEY, MAX_DAILY.toString());
          setRateCount(MAX_DAILY);
          setBackendRateLimited(true);
          const errorObj = new Error(json.message || "Rate limit exceeded");
          (errorObj as Error & { rateLimitExceeded?: boolean }).rateLimitExceeded = true;
          throw errorObj;
        }
        throw new Error(json.message ?? "Validation failed");
      }

      const newCount = rateCount + 1;
      localStorage.setItem(RATE_LIMIT_KEY, newCount.toString());
      setRateCount(newCount);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        onResults(json.data, formData);
      }, 250);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setLoading(false);

      const typedErr = err as Error & { rateLimitExceeded?: boolean };
      const isRateLimit =
        typedErr.rateLimitExceeded ||
        (err instanceof Error &&
          (err.message.toLowerCase().includes("limit") || err.message.includes("429")));

      if (isRateLimit) {
        setBackendRateLimited(true);
        setSubmitError(null);
      } else {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setSubmitError(msg.includes("quota")
          ? "Gemini API free-tier limit hit. Wait about 30 seconds and try again."
          : msg);
      }

      scrollToValidate();
    }
  };

  const stepProgress = `${((step - 1) / (STEP_TITLES.length - 1)) * 100}%`;

  return (
    <div id="validate" className={embedded ? "" : "py-14 px-4 sm:px-6 lg:px-8"}>
      <div className={embedded ? "" : "max-w-5xl mx-auto"}>
        <div className="glass-card rounded-3xl p-5 sm:p-7 lg:p-8 shadow-2xl border border-white/50">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">AI Idea Validator</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Validate Before You Invest</h2>
              </div>

              <div className="validation-pill">
                <span className={`w-2.5 h-2.5 rounded-full ${!isLimited ? "bg-emerald-500" : "bg-rose-500"}`} />
                {!isLimited ? (
                  <>
                    <span className="text-slate-900 font-bold whitespace-nowrap">{validationsLeft}</span>
                    <span className="whitespace-nowrap">free validations left today</span>
                  </>
                ) : (
                  <span>Daily free limit reached</span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600">Complete 3 quick steps and get your UAE market score in under a minute.</p>

            <div>
              <div className="h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-400"
                  style={{ width: stepProgress, background: "linear-gradient(90deg,#4998ce,#2c3e7d)" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {STEP_TITLES.map((title, idx) => {
                  const current = idx + 1;
                  const active = current <= step;
                  return (
                    <div key={title} className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-6 h-6 rounded-full text-[11px] font-bold inline-flex items-center justify-center flex-shrink-0"
                        style={{ color: active ? "white" : "#64748b", background: active ? "#2c3e7d" : "#e2e8f0" }}
                      >
                        {current}
                      </span>
                      <span className={`text-xs sm:text-sm font-semibold truncate ${active ? "text-slate-800" : "text-slate-400"}`}>
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Quick start:</span>
              {EXAMPLES.map((example) => (
                <button
                  disabled={isLimited}
                  key={example.label}
                  type="button"
                  onClick={() => setExample(example)}
                  className={`quick-start-btn ${isLimited ? "disabled" : "cursor-pointer"}`}
                >
                  {example.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Loader2 size={20} className="animate-spin text-avyanco-navy" />
                    <p className="font-semibold text-slate-800">{LOADING_STEPS[loadingStep]}</p>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg,#2c3e7d,#4998ce)",
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    {LOADING_STEPS.map((item, index) => (
                      <div
                        key={item}
                        className="text-sm flex items-center gap-2"
                        style={{ color: index <= loadingStep ? "#1e293b" : "#94a3b8" }}
                      >
                        {index < loadingStep ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : index === loadingStep ? (
                          <Loader2 size={14} className="animate-spin text-avyanco-blue" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-current inline-block" />
                        )}
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="rounded-2xl p-4 flex items-start gap-3 text-sm bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {!loading && isLimited && (
              <div className="rounded-2xl p-6 text-white border border-white/20" style={{ background: "linear-gradient(125deg,#1a2456 0%, #2c3e7d 60%, #3f5ba7 100%)" }}>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold">You used your {MAX_DAILY} free validations today</h3>
                  <p className="text-sm text-slate-200">Talk to Avyanco experts to get unlimited guidance, setup advice, and a practical launch roadmap for your business idea.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href="https://avyanco.com/contact/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-hot"
                    >
                      <Phone size={16} />
                      Book Free Consultation
                    </a>
                    <a
                      href={`https://wa.me/971588288968?text=${encodeURIComponent("Hi Avyanco! I reached my IdeaProof free limit and would like a consultation.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-emerald"
                    >
                      <WhatsAppIcon className="w-[20px] h-[20px]" />
                      WhatsApp Support
                    </a>
                  </div>
                </div>
              </div>
            )}

            {!loading && !isLimited && (
              <form onSubmit={handleSubmit} noValidate className="grid gap-5">
                {step === 1 && (
                  <div className="grid gap-4">
                    <label htmlFor="businessIdea" className="field-label">What is your business idea?</label>
                    <textarea
                      id="businessIdea"
                      rows={5}
                      maxLength={1000}
                      placeholder="Describe your product/service, the problem it solves, and who it is for..."
                      value={formData.businessIdea}
                      onChange={(e) => setFormData((prev) => ({ ...prev, businessIdea: e.target.value }))}
                      className="field-input field-textarea min-h-40"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-rose-500">{errors.businessIdea || ""}</span>
                      <span className="text-slate-400">{formData.businessIdea.length}/1000</span>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5">
                    <div className="grid sm:grid-cols-[0.95fr_1.05fr] gap-4 items-start">
                      <div className="form-panel self-start">
                        <label htmlFor="targetEmirate" className="field-label">Target emirate</label>
                        <select
                          id="targetEmirate"
                          value={formData.targetEmirate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, targetEmirate: e.target.value }))}
                          className="field-input"
                        >
                          <option value="">Select emirate</option>
                          {EMIRATES.map((emirate) => (
                            <option key={emirate} value={emirate}>
                              {emirate}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          This helps us tailor licensing, market, and setup guidance to the right free zone or mainland path.
                        </p>
                        <p className="text-xs text-rose-500 mt-1">{errors.targetEmirate || ""}</p>
                      </div>

                      <div className="form-panel h-full">
                        <label className="field-label">Investment budget</label>
                        <div className="grid gap-2">
                          {BUDGETS.map((budget) => {
                            const selected = formData.budget === budget;
                            return (
                              <button
                                key={budget}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, budget }))}
                                className={`budget-option ${selected ? "budget-option-active" : ""}`}
                              >
                                {selected ? <CheckCircle2 size={14} /> : <Circle size={14} />} 
                                {budget}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-rose-500 mt-1">{errors.budget || ""}</p>
                      </div>
                    </div>

                    <div className="form-panel">
                      <label className="field-label">Business categories</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => {
                          const selected = formData.category.includes(category);
                          return (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className={`chip-btn ${selected ? "chip-btn-active" : ""}`}
                            >
                              {category}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-rose-500 mt-1">{errors.category || ""}</p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-4">
                    <div>
                      <label htmlFor="targetAudience" className="field-label">Who is your target audience?</label>
                      <input
                        id="targetAudience"
                        type="text"
                        placeholder="Example: Expat professionals in Dubai, 25-40"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                        className="field-input"
                      />
                      <p className="text-xs text-rose-500 mt-1">{errors.targetAudience || ""}</p>
                    </div>

                    <div>
                      <label htmlFor="uniqueValue" className="field-label">Why will people choose you?</label>
                      <input
                        id="uniqueValue"
                        type="text"
                        placeholder="Example: First Arabic-first telehealth support with 24/7 response"
                        value={formData.uniqueValue}
                        onChange={(e) => setFormData((prev) => ({ ...prev, uniqueValue: e.target.value }))}
                        className="field-input"
                      />
                      <p className="text-xs text-rose-500 mt-1">{errors.uniqueValue || ""}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                    disabled={step === 1}
                    className="cta-muted w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>

                  {step < 3 ? (
                    <button type="button" onClick={goNext} className="cta-primary w-full sm:flex-1 justify-center">
                      Continue
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button id="validate-submit-btn" type="submit" className="cta-primary w-full sm:flex-1 justify-center">
                      Validate My Idea
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
