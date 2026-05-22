"use client";

interface Step {
  step: string;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

export default function NextStepsTimeline({ steps }: Props) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-5 top-5 bottom-5 w-0.5"
        style={{ background: "#dbe4f4" }}
      />

      <div className="flex flex-col gap-8">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-5 items-start relative">
            {/* Circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 z-10"
              style={{ background: "linear-gradient(135deg,#2c3e7d,#4998ce)" }}
            >
              {s.step}
            </div>
            {/* Content */}
            <div className="pt-2 flex-1">
              <h4 className="font-bold text-base mb-1" style={{ color: "#1a1f36" }}>
                {s.title}
              </h4>
              <p className="text-sm text-gray-600">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
