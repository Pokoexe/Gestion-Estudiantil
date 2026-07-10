import { useEvalPlantillas } from "./functions/useEvalPlantillas";
import { PlantillasHeader } from "./ui/PlantillasHeader";
import { CamposEditor } from "./ui/CamposEditor";
import { ArchivoPreview } from "./ui/ArchivoPreview";

export function EvalPlantillasPage() {
  const {
    navigate,
    campos,
    setCampos,
    file,
    fileUrl,
    nuevo,
    setNuevo,
    TIPOS,
    agregarCampo,
    eliminarCampo,
    handleFile,
  } = useEvalPlantillas();

  return (
    <div className="flex flex-col gap-5">
      <PlantillasHeader
        campos={campos}
        onPreview={() => navigate("/evaluador/plantillas/preview", { state: { campos } })}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <CamposEditor
          campos={campos}
          setCampos={setCampos}
          nuevo={nuevo}
          setNuevo={setNuevo}
          TIPOS={TIPOS}
          agregarCampo={agregarCampo}
          eliminarCampo={eliminarCampo}
        />
        <ArchivoPreview
          campos={campos}
          file={file}
          fileUrl={fileUrl}
          handleFile={handleFile}
        />
      </div>
    </div>
  );
}
