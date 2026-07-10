import { ArrowLeft, FileText } from "lucide-react";

interface NotFoundStateProps {
    onBack: () => void;
}

export function NotFoundState({ onBack }: NotFoundStateProps) {
    return (
        <div className="flex flex-col gap-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a inscripciones
            </button>
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 flex flex-col items-center gap-3 text-center">
                <FileText className="w-8 h-8 text-edu-ink-400" />
                <p className="text-edu-ink-500 text-sm m-0">No se encontró la inscripción solicitada.</p>
            </div>
        </div>
    );
}
