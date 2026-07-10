import { Plus } from "lucide-react";

export function AddButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-edu-control border-[1.5px] border-dashed py-2.5 text-[0.8rem] font-semibold transition-colors ${disabled ? "cursor-not-allowed border-edu-border text-edu-ink-300" : "cursor-pointer border-edu-primary-200 text-edu-primary hover:bg-edu-primary-50"
        }`}
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}
