export function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
      <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
      <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">{link}</span>
    </div>
  );
}
