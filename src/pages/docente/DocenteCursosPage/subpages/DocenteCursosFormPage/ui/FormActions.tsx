import { BookOpen } from "lucide-react";

interface FormActionsProps {
    onCancel: () => void;
}

export function FormActions({ onCancel }: FormActionsProps) {
    return (
        <div className="flex gap-2 justify-end border-t border-edu-border-soft px-5 py-4">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle"
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer hover:bg-edu-primary-hover"
            >
                <BookOpen className="w-4 h-4" />
                Solicitar curso
            </button>
        </div>
    );
}
