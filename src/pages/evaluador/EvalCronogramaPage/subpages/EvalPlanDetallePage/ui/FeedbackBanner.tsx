import { MessageSquareWarning, X } from "lucide-react";

interface Props {
  message: string;
  onClose: () => void;
}

export function FeedbackBanner({ message, onClose }: Props) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-warning-bg text-edu-warning">
      <MessageSquareWarning className="w-4 h-4 shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="bg-transparent border-none cursor-pointer p-0 flex items-center opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
