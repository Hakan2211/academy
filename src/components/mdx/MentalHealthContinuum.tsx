import { useState } from "react";
import { cn } from "#/lib/cn";

const BANDS = [
  {
    label: "Thriving",
    range: [0, 25],
    color: "#00b894",
    description:
      "Energy is high, relationships feel good, you cope well with challenges and feel a sense of purpose.",
    emoji: "🌱",
  },
  {
    label: "Coping / Okay",
    range: [25, 50],
    color: "#74b9ff",
    description:
      "Life has its ups and downs but you're managing. Some stress, some tiredness — broadly getting through.",
    emoji: "🙂",
  },
  {
    label: "Struggling",
    range: [50, 75],
    color: "#fdcb6e",
    description:
      "Things feel harder than usual. Sleep, concentration or mood may be off. This is a signal to be kind to yourself and reach out.",
    emoji: "😔",
  },
  {
    label: "In Difficulty",
    range: [75, 100],
    color: "#d63031",
    description:
      "Significant distress that is affecting daily life. This is the time to seek support — from a trusted person, a doctor, or a helpline.",
    emoji: "💙",
  },
] as const;

function getBand(value: number) {
  return (
    BANDS.find((b) => value >= b.range[0] && value < b.range[1]) ??
    BANDS[BANDS.length - 1]
  );
}

export function MentalHealthContinuum() {
  const [value, setValue] = useState(20);
  const band = getBand(value);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg font-semibold text-ink">
          The Mental Health Continuum
        </span>
      </div>

      <p className="text-sm text-muted">
        Everyone sits somewhere on this spectrum — and we all move along it over
        time. Mental health is not simply "having" or "not having" a mental
        illness; it is a state of wellbeing that changes with life circumstances.
      </p>

      {/* Gradient track */}
      <div className="relative h-6 rounded-full overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, #00b894, #74b9ff 33%, #fdcb6e 66%, #d63031)",
        }}
      >
        {/* Thumb marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all duration-100"
          style={{
            left: `${value}%`,
            backgroundColor: band.color,
          }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={99}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-accent"
        aria-label="Drag to explore the continuum"
      />

      {/* Band labels */}
      <div className="grid grid-cols-4 gap-1 text-center text-xs text-muted">
        {BANDS.map((b) => (
          <button
            key={b.label}
            onClick={() => setValue(b.range[0] + 1)}
            className={cn(
              "rounded-lg border px-1 py-1 transition-colors",
              band.label === b.label
                ? "border-accent bg-accent/15 text-accent font-semibold"
                : "border-border text-muted hover:text-ink"
            )}
          >
            {b.emoji} {b.label}
          </button>
        ))}
      </div>

      {/* Description card */}
      <div
        className="rounded-xl border p-3 text-sm text-ink transition-all duration-300"
        style={{ borderColor: band.color, background: `${band.color}18` }}
      >
        <span className="font-semibold" style={{ color: band.color }}>
          {band.emoji} {band.label}
        </span>
        <p className="mt-1 text-muted">{band.description}</p>
      </div>

      <p className="text-xs text-muted italic">
        Notice how you might have been in different places on this spectrum
        during different periods of your life — that is completely normal.
      </p>
    </div>
  );
}
