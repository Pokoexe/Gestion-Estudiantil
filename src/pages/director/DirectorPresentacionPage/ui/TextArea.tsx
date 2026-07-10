import { INPUT } from "../functions/useDirectorPresentacion";

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.74rem] font-medium text-edu-ink-600">{label}</span>
      <textarea className={`${INPUT} resize-none leading-relaxed`} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
