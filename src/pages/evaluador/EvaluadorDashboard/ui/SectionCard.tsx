export function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">{subtitle}</p>
          )}
        </div>
        {action && (
          <span className="text-[0.8rem] text-edu-primary cursor-pointer font-medium">
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
