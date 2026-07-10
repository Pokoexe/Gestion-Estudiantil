import { ArrowLeft, Info } from "lucide-react";
import { LAPSO } from "@shared/services/data/plans";
import { useDocentePlanForm } from "./functions/useDocentePlanForm";
import { FormHeader } from "./ui/FormHeader";
import { MateriaSeccionSelects } from "./ui/MateriaSeccionSelects";
import { EvalTabs } from "./ui/EvalTabs";
import { EvalFields } from "./ui/EvalFields";
import { ReviewPanel } from "./ui/ReviewPanel";
import { FormActions } from "./ui/FormActions";

export function DocentePlanFormPage() {
    const {
        editing,
        planLoaded,
        plan,
        form,
        setForm,
        rows,
        activeTab,
        setActiveTab,
        MATERIA_OPTIONS,
        SECCION_OPTIONS,
        totalWeight,
        seleccionOk,
        evalsComplete,
        weightOk,
        datesInRange,
        spacingOk,
        allValid,
        updateRow,
        addRow,
        removeRow,
        addFiles,
        removeFile,
        handleSubmit,
        navigate,
        inputCls,
        labelCls,
    } = useDocentePlanForm();

    // Plan a editar inexistente
    if (editing && planLoaded && !plan) {
        return (
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate("/docente/planes")}
                    className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a planes
                </button>
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center text-edu-ink-400 text-sm">
                    El plan que intentas modificar no existe.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <FormHeader editing={editing} form={form} navigate={navigate} />

            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-4">
                {/* Materia + sección: selects solo al crear (en modificar van en el banner) */}
                {!editing && (
                    <MateriaSeccionSelects
                        form={form}
                        setForm={setForm}
                        MATERIA_OPTIONS={MATERIA_OPTIONS}
                        SECCION_OPTIONS={SECCION_OPTIONS}
                        inputCls={inputCls}
                        labelCls={labelCls}
                    />
                )}

                {/* Aviso del lapso */}
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                    <Info className="w-4 h-4 shrink-0 mt-px" />
                    <span>
                        El lapso va del <strong>{LAPSO.startLabel}</strong> al <strong>{LAPSO.endLabel}</strong>. Entre una
                        evaluación y otra debe haber <strong>mínimo {LAPSO.minDays} días</strong> y{" "}
                        <strong>máximo {LAPSO.maxDays} días</strong> de diferencia.
                    </span>
                </div>

                <EvalTabs
                    rows={rows}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    addRow={addRow}
                />

                {typeof activeTab === "number" && rows[activeTab] && (
                    <EvalFields
                        rows={rows}
                        activeTab={activeTab}
                        updateRow={updateRow}
                        removeRow={removeRow}
                        addFiles={addFiles}
                        removeFile={removeFile}
                        inputCls={inputCls}
                        labelCls={labelCls}
                    />
                )}

                {activeTab === "review" && (
                    <ReviewPanel
                        form={form}
                        rows={rows}
                        totalWeight={totalWeight}
                        seleccionOk={seleccionOk}
                        evalsComplete={evalsComplete}
                        weightOk={weightOk}
                        datesInRange={datesInRange}
                        spacingOk={spacingOk}
                    />
                )}

                <FormActions
                    editing={editing}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    allValid={allValid}
                    navigate={navigate}
                />
            </form>
        </div>
    );
}
