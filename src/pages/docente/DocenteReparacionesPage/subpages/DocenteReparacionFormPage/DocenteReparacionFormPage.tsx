import { ArrowLeft, Info } from "lucide-react";
import { LAPSO } from "@shared/services/data/reparaciones";
import { useDocenteReparacionForm } from "./functions/useDocenteReparacionForm";
import { ReparacionBanner } from "./ui/ReparacionBanner";
import { EvalTabs } from "./ui/EvalTabs";
import { EvalFields } from "./ui/EvalFields";
import { ReviewPanel } from "./ui/ReviewPanel";
import { FormActions } from "./ui/FormActions";

export function DocenteReparacionFormPage() {
    const {
        navigate,
        reparacion,
        loading,
        rows,
        activeTab,
        setActiveTab,
        updateRow,
        addRow,
        removeRow,
        addFiles,
        removeFile,
        evalsComplete,
        datesInRange,
        spacingOk,
        allValid,
        yaCreada,
        handleSubmit,
    } = useDocenteReparacionForm();

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    // Reparación inexistente
    if (!reparacion) {
        return (
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate("/docente/reparaciones")}
                    className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a reparaciones
                </button>
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center text-edu-ink-400 text-sm">
                    La reparación no existe.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                onClick={() => navigate("/docente/reparaciones")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a reparaciones
            </button>

            {/* Banner de la materia en reparación */}
            <ReparacionBanner
                subject={reparacion.subject}
                section={reparacion.section}
                yaCreada={yaCreada}
            />

            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4">
                {/* Aviso del lapso */}
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                    <Info className="w-4 h-4 shrink-0 mt-px" />
                    <span>
                        El período de reparación va del <strong>{LAPSO.startLabel}</strong> al <strong>{LAPSO.endLabel}</strong>. Entre una
                        evaluación y otra debe haber <strong>mínimo {LAPSO.minDays} días</strong> y{" "}
                        <strong>máximo {LAPSO.maxDays} días</strong> de diferencia.
                    </span>
                </div>

                {/* Pestañas de evaluaciones + datos colocados */}
                <EvalTabs
                    rows={rows}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    addRow={addRow}
                />

                {/* Contenido de la evaluación activa */}
                {typeof activeTab === "number" && (
                    <EvalFields
                        rows={rows}
                        activeTab={activeTab}
                        updateRow={updateRow}
                        removeRow={removeRow}
                        addFiles={addFiles}
                        removeFile={removeFile}
                    />
                )}

                {/* Pestaña "Datos colocados" (revisión) */}
                {activeTab === "review" && (
                    <ReviewPanel
                        rows={rows}
                        subject={reparacion.subject}
                        section={reparacion.section}
                        evalsComplete={evalsComplete}
                        datesInRange={datesInRange}
                        spacingOk={spacingOk}
                    />
                )}

                {/* Acciones */}
                <FormActions
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    allValid={allValid}
                    yaCreada={yaCreada}
                    onCancel={() => navigate("/docente/reparaciones")}
                />
            </form>
        </div>
    );
}
