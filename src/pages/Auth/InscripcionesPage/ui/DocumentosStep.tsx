import { FileText, Info, Upload, X } from "lucide-react";
import type { FotoFile } from "../interfaces";
import { StepTitle, DocField } from "./fields";

interface DocumentosStepProps {
    primeraVez: boolean;
    setPrimeraVez: React.Dispatch<React.SetStateAction<boolean>>;
    actaNac: string | null;
    setActaNac: React.Dispatch<React.SetStateAction<string | null>>;
    boletin: string | null;
    setBoletin: React.Dispatch<React.SetStateAction<string | null>>;
    fotosEst: FotoFile[];
    addFotosEst: (files: FileList) => void;
    removeFotoEst: (idx: number) => void;
    labelCls: string;
}

export function DocumentosStep({
    primeraVez,
    setPrimeraVez,
    actaNac,
    setActaNac,
    boletin,
    setBoletin,
    fotosEst,
    addFotosEst,
    removeFotoEst,
    labelCls,
}: DocumentosStepProps) {
    return (
        <div className="p-5 flex flex-col gap-5">
            <StepTitle icon={FileText} title="Documentos" subtitle="Recaudos requeridos para la inscripción" />

            {/* ¿Primera vez? */}
            <div className="rounded-edu-control border border-edu-border-soft bg-edu-subtle p-4 flex flex-col gap-3">
                <span className="text-sm font-semibold text-edu-ink">
                    ¿Es la primera vez que se inscribe en la institución?
                </span>
                <div className="flex gap-2">
                    {[
                        { v: true, label: "Sí, es nuevo ingreso" },
                        { v: false, label: "No, ya estudiaba aquí" },
                    ].map((opt) => {
                        const active = primeraVez === opt.v;
                        return (
                            <button
                                key={String(opt.v)}
                                type="button"
                                onClick={() => setPrimeraVez(opt.v)}
                                className={`flex-1 px-3.5 py-2.5 rounded-edu-control text-[0.8125rem] font-semibold border-[1.5px] cursor-pointer transition-colors ${active
                                        ? "border-edu-primary bg-edu-primary-50 text-edu-primary"
                                        : "border-edu-border bg-edu-surface text-edu-ink-500 hover:border-edu-primary-200"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
                {primeraVez && (
                    <div className="flex items-start gap-2 text-[0.78rem] text-edu-ink-500 leading-relaxed">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-px text-edu-primary" />
                        Al ser nuevo ingreso, se solicita el boletín del grado anterior para verificar la
                        prosecución del estudiante (por ejemplo, que pasa a 2.º porque aprobó 1.º).
                    </div>
                )}
            </div>

            {/* Acta de nacimiento */}
            <DocField
                label="Acta de nacimiento"
                required
                fileName={actaNac}
                onPick={(name) => setActaNac(name)}
                onRemove={() => setActaNac(null)}
            />

            {/* Boletín — solo si es primera vez */}
            {primeraVez && (
                <DocField
                    label="Boletín del grado anterior"
                    required
                    fileName={boletin}
                    onPick={(name) => setBoletin(name)}
                    onRemove={() => setBoletin(null)}
                />
            )}

            {/* Fotos del estudiante (varias) */}
            <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                    Fotos del estudiante{" "}
                    <span className="text-edu-ink-400 font-normal">(tipo carnet · una o varias)</span>
                </label>
                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary text-edu-ink-500 text-[0.8125rem]">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && addFotosEst(e.target.files)}
                        className="sr-only"
                    />
                    <Upload className="w-4 h-4" />
                    Subir fotos del estudiante
                </label>
                {fotosEst.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mt-1">
                        {fotosEst.map((f, i) => (
                            <div
                                key={i}
                                className="relative w-20 h-20 rounded-edu-chip overflow-hidden border border-edu-border-soft group"
                            >
                                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeFotoEst(i)}
                                    aria-label="Quitar foto"
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
