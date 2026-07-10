import { ArrowLeft } from "lucide-react";
import { useCoordCursosForm } from "./functions/useCoordCursosForm";
import { MainTabs } from "./ui/MainTabs";
import { InfoTab } from "./ui/InfoTab";
import { EvaluationsTab } from "./ui/EvaluationsTab";
import { FormActions } from "./ui/FormActions";

export function CoordCursosFormPage() {
  const {
    navigate,
    DOCENTES_OPCIONES,
    imgRef,
    mainTab, setMainTab,
    titulo, setTitulo,
    descripcion, setDescripcion,
    cupos, setCupos,
    docente, setDocente,
    imgPreview, handleImg,
    evalRows, evalTab, setEvalTab,
    totalPond, weightOk, evalsOk, infoOk,
    updateEval, addEval, removeEval, addArchivos, removeArchivo,
    handleSubmit,
    MIN_EVALS, inputCls, labelCls,
  } = useCoordCursosForm();

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate("/coordinador/cursos")}
        className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cursos
      </button>

      <form onSubmit={handleSubmit} className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
        <MainTabs mainTab={mainTab} setMainTab={setMainTab} />

        {mainTab === "info" && (
          <InfoTab
            imgRef={imgRef}
            imgPreview={imgPreview}
            handleImg={handleImg}
            titulo={titulo}
            setTitulo={setTitulo}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            cupos={cupos}
            setCupos={setCupos}
            docente={docente}
            setDocente={setDocente}
            docentesOpciones={DOCENTES_OPCIONES}
            inputCls={inputCls}
            labelCls={labelCls}
          />
        )}

        {mainTab === "evaluaciones" && (
          <EvaluationsTab
            evalRows={evalRows}
            evalTab={evalTab}
            setEvalTab={setEvalTab}
            addEval={addEval}
            removeEval={removeEval}
            updateEval={updateEval}
            addArchivos={addArchivos}
            removeArchivo={removeArchivo}
            totalPond={totalPond}
            weightOk={weightOk}
            evalsOk={evalsOk}
            infoOk={infoOk}
            MIN_EVALS={MIN_EVALS}
            inputCls={inputCls}
            labelCls={labelCls}
          />
        )}

        <FormActions onCancel={() => navigate("/coordinador/cursos")} />
      </form>
    </div>
  );
}
