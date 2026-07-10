import { INPUT } from "../functions/useDirectorPresentacion";

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.74rem] font-medium text-edu-ink-600">{label}</span>
      <input
        type="number"
        min={0}
        className={INPUT}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      />
    </label>
  );
}
