// Shared labeled range slider for interactive 3D scenes. Mirrors the inline
// slider in PendulumScene so all scenes feel consistent.
export function SceneSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center justify-between text-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">
          {value.toFixed(1)} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent"
      />
    </label>
  )
}
