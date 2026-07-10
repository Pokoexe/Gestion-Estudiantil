import { ArrowLeft } from "lucide-react";
import { Info } from "lucide-react";
import { LAPSO } from "@shared/services/data/planificaciones";
import { useDocentePlanificacionForm } from "./functions/useDocentePlanificacionForm";
import { FormHeader } from "./ui/FormHeader";
import { MateriaSeccionSelects } from "./ui/MateriaSeccionSelects";
import { SesionTabs } from "./ui/SesionTabs";
import { SesionFields } from "./ui/SesionFields";
import { ReviewPanel } from "./ui/ReviewPanel";
import { FormActions } from "./ui/FormActions";

export function DocentePlanificacionFormPage() {
    const {
        navigate,
        editing,
        planif,
        planifLoaded,
        form,
        setForm,
        rows,
        activeTab,
        setActiveTab,
        MATERIA_OPTIONS,
        SECCION_OPTIONS,
        updateRow,
        addRow,
        removeRow,
        addFiles,
        removeFile,
        seleccionOk,
        sesionesComplete,
        datesInRange,
        spacingOk,
        allValid,
        handleSubmit,
    } = useDocentePlanificacionForm();

    // Planificación a editar inexistente
    if (editing && planifLoaded && !planif) {
        return (
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate("/docente/planificacion")}
                    className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a planificación
                </button>
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center text-edu-ink-400 text-sm">
                    La planificación que intentas modificar no existe.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <FormHeader
                editing={editing}
                form={form}
                onBack={() => navigate("/docente/planificacion")}
            />

            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4">
                <MateriaSeccionSelects
                    editing={editing}
                    form={form}
                    setForm={setForm}
                    MATERIA_OPTIONS={MATERIA_OPTIONS}
                    SECCION_OPTIONS={SECCION_OPTIONS}
                />

                {/* Aviso del lapso */}
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                    <Info className="w-4 h-4 shrink-0 mt-px" />
                    <span>
                        El lapso va del <strong>{LAPSO.startLabel}</strong> al <strong>{LAPSO.endLabel}</strong>. Entre una
                        sesión y otra debe haber <strong>mínimo {LAPSO.minDays} días</strong> y{" "}
                        <strong>máximo {LAPSO.maxDays} días</strong> de diferencia.
                    </span>
                </div>

                <SesionTabs
                    rows={rows}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    addRow={addRow}
                />

                {typeof activeTab === "number" && rows[activeTab] && (
                    <SesionFields
                        rows={rows}
                        activeTab={activeTab}
                        updateRow={updateRow}
                        removeRow={removeRow}
                        addFiles={addFiles}
                        removeFile={removeFile}
                    />
                )}

                {activeTab === "review" && (
                    <ReviewPanel
                        form={form}
                        rows={rows}
                        seleccionOk={seleccionOk}
                        sesionesComplete={sesionesComplete}
                        datesInRange={datesInRange}
                        spacingOk={spacingOk}
                    />
                )}

                <FormActions
                    editing={editing}
                    activeTab={activeTab}
                    allValid={allValid}
                    setActiveTab={setActiveTab}
                    onCancel={() => navigate("/docente/planificacion")}
                />
            </form>
        </div>
    );
}
