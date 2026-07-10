export function Pill({ label, tone }: { label: string; tone: { bg: string; fg: string } }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit whitespace-nowrap"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {label}
    </span>
  );
}
