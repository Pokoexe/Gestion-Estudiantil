import { CheckCircle2, ClipboardCheck } from "lucide-react";

interface FormActionsProps {
    editing: boolean;
    activeTab: number | "review";
    allValid: boolean;
    setActiveTab: React.Dispatch<React.SetStateAction<number | "review">>;
    onCancel: () => void;
}

export function FormActions({
    editing,
    activeTab,
    allValid,
    setActiveTab,
    onCancel,
}: FormActionsProps) {
    return (
        /* Acciones */
        <div className="flex gap-2 justify-end border-t border-edu-border-soft -mx-5 px-5 pt-4 mt-1">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
            >
                Cancelar
            </button>
            {activeTab === "review" ? (
                <button
                    type="submit"
                    disabled={!allValid}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    {editing ? "Guardar cambios" : "Guardar planificación"}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setActiveTab("review")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                >
                    <ClipboardCheck className="w-4 h-4" />
                    Verificar datos
                </button>
            )}
        </div>
    );
}
