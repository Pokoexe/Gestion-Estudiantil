import { ArrowDownRight, X } from "lucide-react";

type Props = {
  feedback: string;
  onClose: () => void;
};

export function FeedbackBanner({ feedback, onClose }: Props) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-primary-50 text-edu-primary">
      <ArrowDownRight className="w-4 h-4 shrink-0" />
      <span className="flex-1">{feedback}</span>
      <button onClick={onClose} aria-label="Cerrar" className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
