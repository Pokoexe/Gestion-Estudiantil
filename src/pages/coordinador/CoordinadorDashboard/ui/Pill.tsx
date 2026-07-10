export function Pill({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit whitespace-nowrap"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}
