import { useState } from "react";
import { cn } from "#/lib/cn";

type Factor = {
  id: string;
  label: string;
  icon: string;
  description: string;
  boost: number;
};

const FACTORS: Factor[] = [
  {
    id: "connection",
    label: "Social connection",
    icon: "👥",
    description:
      "Regular contact with people you trust. Even one close relationship has a strong protective effect.",
    boost: 18,
  },
  {
    id: "movement",
    label: "Movement",
    icon: "🚶",
    description:
      "Any physical activity — a walk counts. Movement releases mood-lifting endorphins and reduces stress hormones.",
    boost: 16,
  },
  {
    id: "sleep",
    label: "Consistent sleep",
    icon: "🌙",
    description:
      "7–9 hours of regular sleep. Poor sleep is one of the strongest risk factors for low mood and anxiety.",
    boost: 17,
  },
  {
    id: "meaning",
    label: "Sense of meaning",
    icon: "🎯",
    description:
      "A sense of purpose — through work, creativity, caring for others, or belonging to something bigger.",
    boost: 14,
  },
  {
    id: "nature",
    label: "Time in nature",
    icon: "🌿",
    description:
      "Even 20 minutes outdoors reduces cortisol and lifts mood. Green space has measurable mental health benefits.",
    boost: 12,
  },
  {
    id: "helping",
    label: "Helping others",
    icon: "🤝",
    description:
      "Acts of kindness boost our own wellbeing as much as the recipient. Volunteering and small gestures both count.",
    boost: 11,
  },
  {
    id: "limits",
    label: "Limiting doomscrolling",
    icon: "📵",
    description:
      "Setting boundaries on news and social media reduces anxiety. Passive scrolling is associated with lower mood.",
    boost: 12,
  },
];

const MAX_SCORE = FACTORS.reduce((s, f) => s + f.boost, 0);

function getLabel(pct: number) {
  if (pct >= 80) return { text: "Strong mental fitness", color: "#00b894" };
  if (pct >= 55) return { text: "Good foundation", color: "#74b9ff" };
  if (pct >= 30) return { text: "Building up", color: "#fdcb6e" };
  return { text: "Getting started", color: "#a29bfe" };
}

export function ProtectiveFactors() {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const score = FACTORS.filter((f) => active.has(f.id)).reduce(
    (s, f) => s + f.boost,
    0
  );
  const pct = Math.round((score / MAX_SCORE) * 100);
  const label = getLabel(pct);

  const highlightedFactor =
    hovered != null
      ? (FACTORS.find((f) => f.id === hovered) ?? null)
      : active.size > 0
      ? (FACTORS.find((f) => active.has(f.id)) ?? null)
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink">
          Mental Fitness Reservoir
        </p>
        <p className="text-xs text-muted mt-0.5">
          Toggle the factors that are part of your life right now. Each one
          builds your mental wellbeing reserve.
        </p>
      </div>

      {/* Reservoir bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted">
          <span>Wellbeing reserve</span>
          <span style={{ color: label.color }} className="font-semibold">
            {label.text}
          </span>
        </div>
        <div className="h-5 w-full rounded-full bg-surface-2 border border-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(to right, ${label.color}99, ${label.color})`,
            }}
          />
        </div>
        <div className="text-right text-xs text-muted">{pct}% filled</div>
      </div>

      {/* Factor toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FACTORS.map((f) => {
          const isOn = active.has(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all",
                isOn
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted hover:text-ink"
              )}
            >
              <span className="text-base shrink-0">{f.icon}</span>
              <span className="font-medium">{f.label}</span>
              <span className="ml-auto text-xs opacity-60">
                +{f.boost}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description panel */}
      {highlightedFactor && (
        <div className="rounded-xl bg-surface-2 border border-border p-3 text-xs text-muted">
          <span className="font-semibold text-ink mr-1">
            {highlightedFactor.icon} {highlightedFactor.label}:
          </span>
          {highlightedFactor.description}
        </div>
      )}

      <p className="text-xs text-muted italic">
        These are not cures for mental illness — they are everyday habits that
        build resilience and protect wellbeing over time. You do not need all of
        them at once; even one or two make a real difference.
      </p>
    </div>
  );
}
