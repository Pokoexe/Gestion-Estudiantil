import { CheckCircle2, X } from "lucide-react";

interface FeedbackBannerProps {
    feedback: string;
    onClose: () => void;
}

export function FeedbackBanner({ feedback, onClose }: FeedbackBannerProps) {
    return (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="flex-1">{feedback}</span>
            <button
                onClick={onClose}
                aria-label="Cerrar"
                className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
