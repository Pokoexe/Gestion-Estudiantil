import { useState } from "react";
import {
    Search,
    Upload,
    X,
    Save,
    Paperclip,
    FileText,
    Presentation,
    FlaskConical,
    PenLine,
} from "lucide-react";
import { color } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos e interfaces locales                                          */
/* ------------------------------------------------------------------ */

type EvalTipo = "exam" | "lab" | "presentation" | "essay";

interface Estudiante {
    id: number;
    name: string;
    cedula: string;
    average: number;
    /** Nota obtenida en cada evaluación del plan (alineado al orden de PLAN). null = sin entregar/pendiente. */
    grades: (number | null)[];
}

interface EvaluacionPlan {
    id: number;
    name: string;
    type: EvalTipo;
    weight: number;
    date: string;
}

interface Pendiente {
    student: string;
    evaluation: string;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const ANIOS = ["3.º Año C", "4.º Año B", "5.º Año A", "5.º Año B"];
const MATERIAS = ["Ciencias Naturales", "Biología", "Ciencias de la Tierra", "Química"];

const ESTUDIANTES: Estudiante[] = [
    { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678", average: 18.2, grades: [18, 19, 18, null, null] },
    { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321", average: 14.5, grades: [15, null, 14, null, null] },
    { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109", average: 9.4, grades: [10, 9, null, null, null] },
    { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870", average: 16.7, grades: [17, 16, 17, null, null] },
    { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542", average: 8.6, grades: [9, 8, null, null, null] },
    { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233", average: 17.9, grades: [18, 18, 17, null, null] },
];

const PLAN: EvaluacionPlan[] = [
    { id: 1, name: "Prueba escrita · Unidad 1", type: "exam", weight: 20, date: "12 may 2026" },
    { id: 2, name: "Exposición: El Petróleo", type: "presentation", weight: 15, date: "28 may 2026" },
    { id: 3, name: "Taller práctico de laboratorio", type: "lab", weight: 20, date: "10 jun 2026" },
    { id: 4, name: "Informe de investigación", type: "essay", weight: 25, date: "25 jun 2026" },
    { id: 5, name: "Examen final · Unidad 3", type: "exam", weight: 20, date: "8 jul 2026" },
];

const PENDIENTES: Pendiente[] = [
    { student: "Carla Valentina Pérez", evaluation: "Taller práctico de laboratorio" },
    { student: "Andrea Carolina Suárez", evaluation: "Taller práctico de laboratorio" },
    { student: "José Gregorio Martínez", evaluation: "Exposición: El Petróleo" },
];

const TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

type FiltroNota = "todos" | "aprobados" | "por_entregar" | "reprobados";

function notaColor(n: number): string {
    if (n < 10) return "text-edu-danger";
    if (n < 14) return "text-edu-warning";
    return "text-edu-success";
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
            {children}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteCalificacionesPage() {
    // Selects de contexto: año y materia
    const [anio, setAnio] = useState(ANIOS[1]);
    const [materia, setMateria] = useState(MATERIAS[0]);

    // Buscador + filtro de estudiantes
    const [query, setQuery] = useState("");
    const [filtro, setFiltro] = useState<FiltroNota>("todos");

    // Evaluación seleccionada (panel derecho)
    const [selectedEvalId, setSelectedEvalId] = useState<number>(3);
    const [notas, setNotas] = useState<Record<number, string>>({});

    // Modal para subir la nota de un estudiante
    const [gradeStudent, setGradeStudent] = useState<Estudiante | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [gradeFile, setGradeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);

    const selectedEval = PLAN.find((p) => p.id === selectedEvalId) ?? PLAN[0];
    const porEntregarNames = new Set(
        PENDIENTES.filter((p) => p.evaluation === selectedEval.name).map((p) => p.student),
    );
    const filteredStudents = ESTUDIANTES.filter((e) => {
        if (query.trim() && !e.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
        if (filtro === "aprobados") return e.average >= 10;
        if (filtro === "reprobados") return e.average < 10;
        if (filtro === "por_entregar") return porEntregarNames.has(e.name);
        return true;
    });

    // Contexto para el modal de subir/cambiar nota
    const gradeIdx = PLAN.findIndex((p) => p.id === selectedEvalId);
    const gradePrev = gradeStudent
        ? notas[gradeStudent.id] ?? (gradeStudent.grades[gradeIdx] != null ? gradeStudent.grades[gradeIdx]!.toFixed(1) : null)
        : null;
    const gradeIsChange = gradePrev != null;

    const openGrade = (e: Estudiante) => {
        setGradeStudent(e);
        setGradeValue("");
        setGradeFile(null);
    };

    const onGradeFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        setGradeFile({ url: URL.createObjectURL(file), name: file.name, isImage: file.type.startsWith("image/") });
    };

    const saveGrade = () => {
        if (gradeStudent) setNotas((prev) => ({ ...prev, [gradeStudent.id]: gradeValue }));
        setGradeStudent(null);
    };

    const selectCls =
        "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary";

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Calificaciones</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Sube y actualiza las notas de tus estudiantes por evaluación
                </p>
            </div>

            {/* Selects de año y materia */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Año</label>
                    <select value={anio} onChange={(e) => setAnio(e.target.value)} className={selectCls}>
                        {ANIOS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Materia</label>
                    <select value={materia} onChange={(e) => setMateria(e.target.value)} className={selectCls}>
                        {MATERIAS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Subir notas — estudiantes (izq) + plan visual (der) */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="grid grid-cols-3">
                    {/* Izquierda: estudiantes con buscador y filtro */}
                    <div className="col-span-2 border-r border-edu-border-soft">
                        <div className="px-5 py-3 border-b border-edu-border-soft flex gap-2 items-center flex-wrap">
                            <div className="relative flex-1 min-w-[160px]">
                                <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar estudiante…"
                                    className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                                />
                            </div>
                            {([
                                { key: "todos", label: "Todos" },
                                { key: "aprobados", label: "Aprobados" },
                                { key: "por_entregar", label: "Por entregar" },
                                { key: "reprobados", label: "Reprobados" },
                            ] as const).map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setFiltro(f.key)}
                                    className={`px-3 py-[7px] rounded-edu-control border-[1.5px] text-[0.775rem] font-medium cursor-pointer transition-colors ${filtro === f.key ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-[2fr_0.9fr_1fr_0.6fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Estudiante", "Nota", "Estado", "Subir"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>

                        {filteredStudents.length === 0 && (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                No hay estudiantes que coincidan con el filtro.
                            </div>
                        )}

                        {filteredStudents.map((e, i) => {
                            const pendiente = porEntregarNames.has(e.name);
                            const nota = notas[e.id];
                            return (
                                <div
                                    key={e.id}
                                    className={`grid grid-cols-[2fr_0.9fr_1fr_0.6fr] px-5 py-[11px] items-center ${i < filteredStudents.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm text-edu-ink font-medium truncate">{e.name}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400">{e.cedula}</div>
                                    </div>
                                    <span className={`text-sm font-bold ${nota ? notaColor(Number(nota)) : "text-edu-ink-300"}`}>
                                        {nota ? Number(nota).toFixed(1) : "—"}
                                    </span>
                                    {pendiente ? (
                                        <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-warning-bg text-edu-warning">
                                            Por entregar
                                        </span>
                                    ) : e.average >= 10 ? (
                                        <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                                            Aprobado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">
                                            Reprobado
                                        </span>
                                    )}
                                    <button
                                        onClick={() => openGrade(e)}
                                        aria-label={`Subir nota de ${e.name}`}
                                        className="w-9 h-9 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary flex items-center justify-center cursor-pointer transition-colors hover:bg-edu-primary-100"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Derecha: plan de evaluación (visual, seleccionable) */}
                    <div>
                        <div className="px-4 py-3 border-b border-edu-border-soft">
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.85rem]">Plan de evaluación</h3>
                            <p className="text-[0.72rem] text-edu-ink-400 m-0 mt-0.5">Selecciona la evaluación a calificar</p>
                        </div>
                        <div className="p-3 flex flex-col gap-2">
                            {PLAN.map((ev) => {
                                const tm = TYPE_META[ev.type];
                                const active = ev.id === selectedEvalId;
                                return (
                                    <button
                                        key={ev.id}
                                        onClick={() => setSelectedEvalId(ev.id)}
                                        className={`text-left rounded-edu-control border-[1.5px] p-3 flex items-start gap-2.5 cursor-pointer transition-colors ${active ? "border-edu-primary bg-edu-primary-50" : "border-edu-border-soft bg-edu-surface hover:border-edu-primary-200"}`}
                                    >
                                        <div className="w-8 h-8 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                            <tm.icon style={{ width: "15px", height: "15px", color: tm.color }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[0.8rem] font-semibold text-edu-ink leading-snug">{ev.name}</div>
                                            <div className="text-[0.72rem] text-edu-ink-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                <span>{ev.weight} %</span>
                                                <span>·</span>
                                                <span>{ev.date}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: subir nota de un estudiante */}
            {gradeStudent && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setGradeStudent(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                            <div className="min-w-0">
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{gradeIsChange ? "Cambiar nota" : "Subir nota"}</h3>
                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5 truncate">{gradeStudent.name}</div>
                            </div>
                            <button
                                onClick={() => setGradeStudent(null)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-primary-50 text-[0.8125rem] text-edu-primary">
                                {materia} · {anio} — <strong>{selectedEval.name}</strong> ({selectedEval.weight} %)
                            </div>

                            {gradeIsChange && (
                                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                                    <span className="text-[0.8125rem] text-edu-ink-500 font-medium">Nota anterior</span>
                                    <span className={`text-[1.1rem] font-bold ${notaColor(Number(gradePrev))}`}>
                                        {gradePrev}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                    </span>
                                </div>
                            )}

                            <div>
                                <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium block mb-1">
                                    {gradeIsChange ? "Nota nueva (0 – 20)" : "Nota (0 – 20)"}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={20}
                                    step="0.1"
                                    value={gradeValue}
                                    onChange={(ev) => setGradeValue(ev.target.value)}
                                    placeholder="Ej. 15.5"
                                    className="w-full border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-edu-ink outline-none bg-edu-subtle text-sm focus:border-edu-primary"
                                />
                            </div>

                            <div>
                                <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium block mb-1">
                                    {gradeIsChange ? "Adjuntar imagen" : "Prueba adjunta"}
                                </label>
                                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control border-[1.5px] border-dashed border-edu-border bg-edu-subtle cursor-pointer text-edu-ink-500 text-[0.8125rem] hover:border-edu-primary transition-colors">
                                    <input type="file" accept={gradeIsChange ? "image/*" : "image/*,.pdf,.doc,.docx"} className="sr-only" onChange={onGradeFile} />
                                    <Paperclip className="w-4 h-4 shrink-0" />
                                    {gradeFile ? "Cambiar archivo" : gradeIsChange ? "Adjuntar imagen" : "Adjuntar imagen o documento"}
                                </label>

                                {gradeFile && (
                                    <div className="mt-3">
                                        {gradeFile.isImage ? (
                                            <img
                                                src={gradeFile.url}
                                                alt={gradeFile.name}
                                                className="max-h-48 w-full object-contain rounded-edu-control border border-edu-border-soft bg-edu-subtle"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                                <FileText className="w-4 h-4 text-edu-primary shrink-0" />
                                                <span className="text-[0.8125rem] text-edu-ink truncate">{gradeFile.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-2">
                            <button
                                onClick={() => setGradeStudent(null)}
                                className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveGrade}
                                className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {gradeIsChange ? "Guardar cambios" : "Guardar nota"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
