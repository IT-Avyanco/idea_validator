"use client";

interface Competitor {
  name: string;
  strength: number;
  weakness: string;
  gap: string;
}

interface Props {
  competitors: Competitor[];
}

export default function CompetitorCards({ competitors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {competitors.map((comp, i) => (
        <div
          key={i}
          className="card card-lift p-5 border-l-4 flex flex-col gap-4"
          style={{ borderLeftColor: "#e05c4b" }}
        >
          <div>
            <h3 className="font-bold text-base" style={{ color: "#1a1f36" }}>
              {comp.name}
            </h3>
          </div>

          {/* Strength bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500 font-medium">
                Market Strength
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: "#e05c4b" }}
              >
                {comp.strength}/100
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-fill"
                style={{
                  width: `${comp.strength}%`,
                  background: "linear-gradient(90deg,#e05c4b,#f59e0b)",
                }}
              />
            </div>
          </div>

          {/* Weakness */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Weakness
            </p>
            <p className="text-sm text-gray-700">{comp.weakness}</p>
          </div>

          {/* Gap */}
          <div
            className="rounded-lg p-3"
            style={{ background: "#eef1fb" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2c3e7d" }}>
              🎯 Their Gap
            </p>
            <p className="text-sm font-medium" style={{ color: "#2c3e7d" }}>
              {comp.gap}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
