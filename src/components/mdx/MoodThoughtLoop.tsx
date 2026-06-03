import { useState } from "react";
import { cn } from "#/lib/cn";

type Scenario = {
  situation: string;
  unhelpfulThought: string;
  unhelpfulFeeling: string;
  unhelpfulBehaviour: string;
  reframedThought: string;
  reframedFeeling: string;
  reframedBehaviour: string;
};

const SCENARIOS: Scenario[] = [
  {
    situation: "A friend didn't reply to my message",
    unhelpfulThought: "They must be angry with me — I've done something wrong.",
    unhelpfulFeeling: "Anxious, hurt",
    unhelpfulBehaviour: "Withdraw, avoid them, keep checking the phone",
    reframedThought: "They're probably just busy. I'll check in later.",
    reframedFeeling: "Calm, secure",
    reframedBehaviour: "Carry on with my day, reach out tomorrow",
  },
  {
    situation: "I made a mistake at work",
    unhelpfulThought: "I'm incompetent. Everyone will think I'm useless.",
    unhelpfulFeeling: "Shame, dread",
    unhelpfulBehaviour: "Overthink, avoid the task, hide the error",
    reframedThought: "Mistakes happen. I can acknowledge it and fix it.",
    reframedFeeling: "Grounded, motivated",
    reframedBehaviour: "Address it calmly, ask for help if needed",
  },
  {
    situation: "I couldn't sleep last night",
    unhelpfulThought: "I'm going to fail everything today. It will be awful.",
    unhelpfulFeeling: "Panic, exhaustion",
    unhelpfulBehaviour: "Cancel plans, catastrophise, stay in bed",
    reframedThought: "One bad night is tough but manageable. I'll pace myself.",
    reframedFeeling: "Realistic, okay",
    reframedBehaviour: "Start the day gently, take a short break if needed",
  },
];

const NODE_STYLES =
  "rounded-xl border px-3 py-2 text-sm text-center transition-all duration-500";

export function MoodThoughtLoop() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [reframed, setReframed] = useState(false);

  const s = SCENARIOS[scenarioIdx];
  const thought = reframed ? s.reframedThought : s.unhelpfulThought;
  const feeling = reframed ? s.reframedFeeling : s.unhelpfulFeeling;
  const behaviour = reframed ? s.reframedBehaviour : s.unhelpfulBehaviour;

  function handleScenario(idx: number) {
    setScenarioIdx(idx);
    setReframed(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <p className="text-sm font-semibold text-ink">
        The CBT Loop: Thought → Feeling → Behaviour
      </p>

      {/* Scenario picker */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((sc, i) => (
          <button
            key={i}
            onClick={() => handleScenario(i)}
            className={cn(
              "rounded-lg border px-3 py-1 text-xs transition-colors",
              i === scenarioIdx
                ? "border-accent bg-accent/15 text-accent"
                : "border-border text-muted hover:text-ink"
            )}
          >
            {sc.situation}
          </button>
        ))}
      </div>

      {/* Situation */}
      <div className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-sm text-ink text-center">
        <span className="text-muted text-xs uppercase tracking-wide block mb-1">
          Situation
        </span>
        {s.situation}
      </div>

      {/* Loop */}
      <div className="grid grid-cols-3 gap-3">
        {/* Thought */}
        <div
          className={cn(
            NODE_STYLES,
            reframed
              ? "border-green-400 bg-green-400/10 text-green-700 dark:text-green-300"
              : "border-amber-400 bg-amber-400/10 text-amber-700 dark:text-amber-300"
          )}
        >
          <div className="text-xs text-muted mb-1">Thought</div>
          {thought}
        </div>

        {/* Feeling */}
        <div
          className={cn(
            NODE_STYLES,
            reframed
              ? "border-green-400 bg-green-400/10 text-green-700 dark:text-green-300"
              : "border-red-400 bg-red-400/10 text-red-700 dark:text-red-300"
          )}
        >
          <div className="text-xs text-muted mb-1">Feeling</div>
          {feeling}
        </div>

        {/* Behaviour */}
        <div
          className={cn(
            NODE_STYLES,
            reframed
              ? "border-green-400 bg-green-400/10 text-green-700 dark:text-green-300"
              : "border-purple-400 bg-purple-400/10 text-purple-700 dark:text-purple-300"
          )}
        >
          <div className="text-xs text-muted mb-1">Behaviour</div>
          {behaviour}
        </div>
      </div>

      {/* Arrow row */}
      <div className="flex justify-between px-4 text-muted text-sm select-none">
        <span>→</span>
        <span>→</span>
        <span className="rotate-180 inline-block">↗</span>
      </div>

      {/* Loop hint */}
      {!reframed && (
        <p className="text-xs text-muted text-center italic">
          The behaviour reinforces the original thought — the loop keeps
          spinning.
        </p>
      )}
      {reframed && (
        <p className="text-xs text-green-600 dark:text-green-400 text-center italic">
          A balanced thought breaks the spiral. The loop still turns — but in a
          healthier direction.
        </p>
      )}

      {/* Reframe button */}
      <button
        onClick={() => setReframed((r) => !r)}
        className={cn(
          "w-full rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
          reframed
            ? "border-border text-muted hover:text-ink"
            : "border-accent bg-accent/15 text-accent hover:bg-accent/25"
        )}
      >
        {reframed ? "← Show unhelpful loop" : "Reframe the thought →"}
      </button>
    </div>
  );
}
