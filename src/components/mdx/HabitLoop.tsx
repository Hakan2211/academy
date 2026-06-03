import { useState } from "react";
import { cn } from "#/lib/cn";

const CUES = [
  "After morning coffee",
  "Before bed",
  "After lunch",
  "When I sit at my desk",
  "After brushing teeth",
];

const ROUTINES = [
  "Take 3 slow breaths",
  "Write one thing I am grateful for",
  "Do 5 minutes of stretching",
  "Step outside for fresh air",
  "Read one page of a book",
];

const REWARDS = [
  "Tick it off my list",
  "Enjoy a cup of tea",
  "Tell myself: well done",
  "A moment of quiet",
  "A small treat I enjoy",
];

const MAX_REPS = 6;

export function HabitLoop() {
  const [cue, setCue] = useState(0);
  const [routine, setRoutine] = useState(0);
  const [reward, setReward] = useState(0);
  const [reps, setReps] = useState(0);
  const [running, setRunning] = useState(false);

  const strength = Math.round((reps / MAX_REPS) * 100);

  function runLoop() {
    if (running || reps >= MAX_REPS) return;
    setRunning(true);
    setTimeout(() => {
      setReps((r) => r + 1);
      setRunning(false);
    }, 900);
  }

  function reset() {
    setReps(0);
    setRunning(false);
  }

  function strengthLabel() {
    if (reps === 0) return "Not started";
    if (reps < 2) return "Seed planted";
    if (reps < 4) return "Starting to stick";
    if (reps < MAX_REPS) return "Habit forming";
    return "Habit wired in!";
  }

  const nodes = [
    { label: "Cue", value: CUES[cue], color: "#74b9ff", bg: "#74b9ff1e" },
    { label: "Routine", value: ROUTINES[routine], color: "#A29BFE", bg: "#A29BFE1e" },
    { label: "Reward", value: REWARDS[reward], color: "#00b894", bg: "#00b8941e" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-5">
      <div>
        <p className="text-sm font-semibold text-ink">Build a Habit Loop</p>
        <p className="text-xs text-muted mt-0.5">
          A habit has three parts: a cue (trigger), a routine (action), and a
          reward. Choose each piece, then "run" the loop — repeated reward is
          what wires a habit into the brain.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(
          [
            { title: "Cue" as const, items: CUES, idx: cue, set: setCue, color: "#74b9ff" },
            { title: "Routine" as const, items: ROUTINES, idx: routine, set: setRoutine, color: "#A29BFE" },
            { title: "Reward" as const, items: REWARDS, idx: reward, set: setReward, color: "#00b894" },
          ]
        ).map(({ title, items, idx, set, color }) => (
          <div key={title} className="space-y-1">
            <p className="text-xs font-semibold" style={{ color }}>
              {title}
            </p>
            <div className="flex flex-col gap-1">
              {items.map((item, i) => (
                <button
                  key={item}
                  onClick={() => { set(i); reset(); }}
                  className={cn(
                    "rounded-lg border px-2 py-1 text-xs text-left transition-colors",
                    idx === i
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-muted hover:text-ink"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cycle visualisation */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2 text-center text-xs transition-all duration-300",
                running && i === 1 ? "scale-105" : ""
              )}
              style={{
                borderColor: n.color,
                background: n.bg,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-wider mb-0.5 font-semibold"
                style={{ color: n.color }}
              >
                {n.label}
              </div>
              <div className="text-ink">{n.value}</div>
            </div>
            {i < nodes.length - 1 && (
              <span className="text-muted text-base">→</span>
            )}
          </div>
        ))}
        {/* Loop back arrow hint */}
        <span className="text-muted text-xs w-full text-center mt-0.5">
          ↩ reward reinforces the cue response
        </span>
      </div>

      {/* Habit strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted">
          <span>Habit strength</span>
          <span
            className={cn(
              "font-semibold",
              reps >= MAX_REPS ? "text-success" : "text-accent"
            )}
          >
            {strengthLabel()}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-surface-2 border border-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${strength}%`,
              background:
                reps >= MAX_REPS
                  ? "#00b894"
                  : "linear-gradient(to right, var(--color-accent)/60%, var(--color-accent))",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted">
          <span>0 reps</span>
          <span>{reps} / {MAX_REPS} repetitions</span>
          <span>Wired in</span>
        </div>
      </div>

      {/* Run / Reset buttons */}
      <div className="flex gap-2">
        <button
          onClick={runLoop}
          disabled={running || reps >= MAX_REPS}
          className={cn(
            "flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
            reps >= MAX_REPS
              ? "border-border text-muted cursor-not-allowed"
              : running
              ? "border-accent bg-accent/15 text-accent opacity-60"
              : "border-accent bg-accent/15 text-accent hover:bg-accent/25"
          )}
        >
          {running
            ? "Running loop…"
            : reps >= MAX_REPS
            ? "Habit wired in!"
            : "Run the loop ▶"}
        </button>
        {reps > 0 && (
          <button
            onClick={reset}
            className="rounded-xl border border-border px-4 py-2 text-sm text-muted hover:text-ink transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
