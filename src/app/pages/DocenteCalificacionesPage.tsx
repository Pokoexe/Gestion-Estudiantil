import { useState } from "react";
import {
    FileSpreadsheet,
    Upload,
    FileText,
    Send,
    CheckCircle2,
    X,
    Info,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos e interfaces locales                                          */
/* ------------------------------------------------------------------ */

interface SeccionOpt {
    id: string;
    label: string;
}

interface EvaluacionOpt {
    id: string;
    label: string;
    weight: number;
}

interface Estudiante {
    id: number;
    name: string;
    cedula: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const SECCIONES: SeccionOpt[] = [
    { id: "cn-4b", label: "Ciencias Naturales · 4.º Año B" },
    { id: "bio-5a", label: "Biología · 5.º Año A" },
    { id: "tierra-3c", label: "Ciencias de la Tierra · 3.º Año C" },
    { id: "quim-5b", label: "Química · 5.º Año B" },
];

const EVALUACIONES: EvaluacionOpt[] = [
    { id: "e1", label: "Prueba escrita · Unidad 1", weight: 20 },
    { id: "e2", label: "Exposición: El Petróleo", weight: 15 },
    { id: "e3", label: "Taller práctico de laboratorio", weight: 20 },
    { id: "e4", label: "Informe de investigación", weight: 25 },
];

const ESTUDIANTES: Estudiante[] = [
    { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678" },
    { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321" },
    { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109" },
    { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870" },
    { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542" },
    { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233" },
];

// Notas iniciales de ejemplo (base 20)
const NOTAS_INICIALES: Record<number, string> = {
    1: "18",
    2: "14",
    3: "9",
    4: "16",
    5: "11",
    6: "19",
};

function notaColor(n: number): string {
    if (n < 10) return "text-edu-danger";
    if (n < 14) return "text-edu-warning";
    return "text-edu-success";
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteCalificacionesPage() {
    const [seccion, setSeccion] = useState(SECCIONES[0].id);
    const [evaluacion, setEvaluacion] = useState(EVALUACIONES[0].id);
    const [notas, setNotas] = useState<Record<number, string>>(NOTAS_INICIALES);
    const [evidencia, setEvidencia] = useState<string | null>(null);
    const [saved, setSaved] = useState(true);
    const [published, setPublished] = useState(false);

    const setNota = (id: number, value: string) => {
        setNotas((n) => ({ ...n, [id]: value }));
        setSaved(false);
        setPublished(false);
    };

    const handleEvidencia = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setEvidencia(file.name);
    };

    const notasValidas = Object.values(notas)
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));
    const promedio =
        notasValidas.length > 0
            ? notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length
            : 0;

    const evalActual = EVALUACIONES.find((e) => e.id === evaluacion);

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Calificaciones</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Carga y publica las notas por evaluación
                </p>
            </div>

            {/* Confirmación de publicación */}
            {published && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-edu-control text-sm font-medium bg-edu-success-bg text-edu-success">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="flex-1">
                        Notas publicadas. Los estudiantes y representantes ya pueden verlas.
                    </span>
                    <button
                        onClick={() => setPublished(false)}
                        aria-label="Cerrar"
                        className="text-edu-success bg-transparent border-none cursor-pointer p-0 flex items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Selectores */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5 min-w-[240px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
                    <select
                        value={seccion}
                        onChange={(e) => setSeccion(e.target.value)}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                    >
                        {SECCIONES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[240px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Evaluación</label>
                    <select
                        value={evaluacion}
                        onChange={(e) => {
                            setEvaluacion(e.target.value);
                            setPublished(false);
                        }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                    >
                        {EVALUACIONES.map((ev) => (
                            <option key={ev.id} value={ev.id}>{ev.label} ({ev.weight} %)</option>
                        ))}
                    </select>
                </div>
                <div className="rounded-edu-control bg-edu-primary-50 px-4 py-2 text-center min-w-[120px]">
                    <div className="text-[0.65rem] text-edu-primary font-semibold uppercase tracking-[0.04em]">Promedio evaluación</div>
                    <div className="text-[1.35rem] font-bold text-edu-primary leading-tight">{promedio.toFixed(1)}</div>
                </div>
            </div>

            {/* Adjuntar prueba / evidencia */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-1.5">
                <label className="text-edu-ink-700 text-sm font-medium">Adjuntar prueba / evidencia</label>
                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-4 bg-edu-subtle cursor-pointer flex items-center gap-3 transition-colors hover:border-edu-primary-200">
                    <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleEvidencia} className="sr-only" />
                    {evidencia ? (
                        <>
                            <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-edu-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{evidencia}</div>
                                <div className="text-[0.72rem] text-edu-primary">Toca para cambiar el archivo</div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-1 w-full text-center">
                            <Upload className="w-5 h-5 text-edu-ink-400" />
                            <span className="text-[0.8125rem] font-medium text-edu-ink-500">
                                Toca para adjuntar la prueba corregida o evidencia (PDF, Word o imagen)
                            </span>
                        </div>
                    )}
                </label>
            </div>

            {/* Tabla editable de notas */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem] flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-edu-ink-400" />
                        {evalActual?.label}
                    </h3>
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${saved ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}
                    >
                        {saved ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                        {saved ? "Guardado" : "Cambios sin guardar"}
                    </span>
                </div>

                <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                    {["#", "Estudiante", "Cédula", "Nota (0-20)"].map((h) => (
                        <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                            {h}
                        </span>
                    ))}
                </div>

                {ESTUDIANTES.map((e, i) => {
                    const val = parseFloat(notas[e.id] ?? "");
                    return (
                        <div
                            key={e.id}
                            className={`grid grid-cols-[0.5fr_2fr_1fr_1fr] px-5 py-[10px] items-center ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <span className="text-[0.8125rem] text-edu-ink-400 font-medium">{i + 1}</span>
                            <span className="text-sm text-edu-ink font-medium">{e.name}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    max={20}
                                    value={notas[e.id] ?? ""}
                                    placeholder="—"
                                    onChange={(ev) => setNota(e.id, ev.target.value)}
                                    className={`w-20 border-[1.5px] border-edu-border rounded-edu-control px-2.5 py-1.5 outline-none bg-edu-subtle text-sm font-semibold focus:border-edu-primary ${!isNaN(val) ? notaColor(val) : "text-edu-ink"}`}
                                />
                                {!isNaN(val) && val < 10 && (
                                    <span className="text-[0.7rem] text-edu-danger font-semibold">Raspado</span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Acciones */}
                <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-2.5">
                    <button
                        onClick={() => setSaved(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-sm font-semibold border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle cursor-pointer"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Guardar borrador
                    </button>
                    <button
                        onClick={() => {
                            setSaved(true);
                            setPublished(true);
                        }}
                        className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                        Publicar notas
                    </button>
                </div>
            </div>
        </div>
    );
}
