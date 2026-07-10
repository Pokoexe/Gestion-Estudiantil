import { FileSpreadsheet, CheckCircle2, Upload, Download } from "lucide-react";
import { TEAL_50, TEAL, TEAL_BG, SAMPLE } from "../functions/useEvalPlantillas";
import type { Campo } from "@shared/services/actions/plantilla";

interface Props {
  campos: Campo[];
  file: File | null;
  fileUrl: string | null;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ArchivoPreview({ campos, file, fileUrl, handleFile }: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_50 }}>
            <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Previsualización del archivo</h3>
        </div>
        {file && fileUrl && (
          <a
            href={fileUrl}
            download={file.name}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a>
        )}
      </div>
      <div className="px-5 py-[18px] flex flex-col gap-4">
        <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-teal-500">
          <input type="file" accept=".xls,.xlsx,.csv" onChange={handleFile} className="sr-only" />
          {file ? (
            <>
              <div className="w-10 h-10 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
                <FileSpreadsheet className="w-5 h-5" style={{ color: TEAL }} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{file.name}</div>
                <div className="text-[0.72rem]" style={{ color: TEAL }}>Toca para reemplazar el archivo</div>
              </div>
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: TEAL }} />
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 w-full text-center">
              <Upload className="w-5 h-5 text-edu-ink-400" />
              <span className="text-[0.8125rem] font-medium text-edu-ink-500">Toca para subir el Excel (.xls, .xlsx, .csv)</span>
              <span className="text-[0.72rem] text-edu-ink-400">Los datos se colocan automáticamente en la plantilla</span>
            </div>
          )}
        </label>
        {file ? (
          <div className="overflow-x-auto rounded-edu-control border border-edu-border-soft">
            <div className="min-w-max">
              <div className="grid bg-edu-subtle border-b border-edu-border-soft" style={{ gridTemplateColumns: `repeat(${campos.length}, minmax(120px, 1fr))` }}>
                {campos.map((c) => (
                  <span key={c.id} className="px-3 py-2 text-[0.68rem] font-semibold text-edu-ink-500 uppercase tracking-[0.04em] border-r border-edu-border-soft last:border-r-0 truncate">{c.nombre}</span>
                ))}
              </div>
              {[0, 1, 2].map((r) => (
                <div key={r} className={`grid ${r < 2 ? "border-b border-edu-border-soft" : ""}`} style={{ gridTemplateColumns: `repeat(${campos.length}, minmax(120px, 1fr))` }}>
                  {campos.map((c) => (
                    <span key={c.id} className="px-3 py-2 text-[0.8125rem] text-edu-ink-700 border-r border-edu-border-soft last:border-r-0 truncate">{SAMPLE[c.tipo][r]}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-edu-border-soft rounded-edu-control px-5 py-10 text-center bg-edu-subtle">
            <FileSpreadsheet className="w-8 h-8 mx-auto text-edu-ink-300" />
            <p className="text-edu-ink-500 text-sm mt-3 m-0">Sube un archivo Excel para previsualizar los datos cargados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
