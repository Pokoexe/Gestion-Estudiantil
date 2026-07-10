export function IconBtn({
  onClick,
  disabled,
  label,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-edu-chip border border-edu-border bg-edu-surface transition-colors ${disabled ? "cursor-not-allowed text-edu-ink-300 opacity-50" : danger ? "cursor-pointer text-edu-ink-400 hover:border-edu-danger hover:text-edu-danger" : "cursor-pointer text-edu-ink-500 hover:border-edu-primary-200 hover:text-edu-primary"
        }`}
    >
      {children}
    </button>
  );
}
