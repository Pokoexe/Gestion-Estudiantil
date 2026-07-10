export function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
      {hint && <span className="text-xs text-edu-ink-400 font-medium">{hint}</span>}
    </div>
  );
}
