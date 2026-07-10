import { ArrowLeft, PlusCircle } from "lucide-react";
import { useDocenteCursosForm } from "./functions/useDocenteCursosForm";
import { MainTabs } from "./ui/MainTabs";
import { InfoTab } from "./ui/InfoTab";
import { EvalSubtabs } from "./ui/EvalSubtabs";
import { EvalFields } from "./ui/EvalFields";
import { ReviewPanel } from "./ui/ReviewPanel";
import { FormActions } from "./ui/FormActions";

export function DocenteCursosFormPage() {
    const {
        navigate,
        docente,
        mainTab, setMainTab,
        titulo, setTitulo,
        descripcion, setDescripcion,
        cupos, setCupos,
        imgPreview, imgRef,
        evalRows,
        evalTab, setEvalTab,
        totalPond, weightOk, evalsOk, infoOk,
        handleImg,
        updateEval,
        addEval,
        removeEval,
        addArchivos,
        removeArchivo,
        handleSubmit,
        inputCls,
        labelCls,
        MIN_EVALS,
    } = useDocenteCursosForm();

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                type="button"
                onClick={() => navigate("/docente/cursos")}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a cursos
            </button>

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                    <PlusCircle className="w-5 h-5 text-edu-primary" />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">Solicitar curso extracurricular</h2>
                    <p className="text-edu-ink-500 text-sm mt-0.5 m-0">Completa la información del curso y define sus evaluaciones</p>
                </div>
            </div>

            {/* Tarjeta principal */}
            <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">

                {/* Tabs principales */}
                <MainTabs mainTab={mainTab} setMainTab={setMainTab} />

                {/* ── Pestaña Información ── */}
                {mainTab === "info" && (
                    <InfoTab
                        titulo={titulo} setTitulo={setTitulo}
                        descripcion={descripcion} setDescripcion={setDescripcion}
                        cupos={cupos} setCupos={setCupos}
                        imgPreview={imgPreview} imgRef={imgRef} handleImg={handleImg}
                        docente={docente}
                        inputCls={inputCls} labelCls={labelCls}
                    />
                )}

                {/* ── Pestaña Evaluaciones ── */}
                {mainTab === "evaluaciones" && (
                    <div className="p-5 flex flex-col gap-4">
                        {/* Sub-tabs */}
                        <EvalSubtabs
                            evalRows={evalRows}
                            evalTab={evalTab}
                            setEvalTab={setEvalTab}
                            addEval={addEval}
                        />

                        {/* Formulario de la evaluación activa */}
                        {typeof evalTab === "number" && evalRows[evalTab] && (
                            <EvalFields
                                evalRows={evalRows}
                                evalTab={evalTab}
                                updateEval={updateEval}
                                removeEval={removeEval}
                                addArchivos={addArchivos}
                                removeArchivo={removeArchivo}
                                MIN_EVALS={MIN_EVALS}
                                inputCls={inputCls}
                                labelCls={labelCls}
                            />
                        )}

                        {/* Pestaña "Datos colocados" */}
                        {evalTab === "review" && (
                            <ReviewPanel
                                evalRows={evalRows}
                                totalPond={totalPond}
                                weightOk={weightOk}
                                evalsOk={evalsOk}
                                infoOk={infoOk}
                            />
                        )}
                    </div>
                )}

                {/* Acciones */}
                <FormActions onCancel={() => navigate("/docente/cursos")} />
            </form>
        </div>
    );
}
