import { useState } from "react";
import {
    Users,
    BookOpen,
    ChevronRight,
    ArrowLeft,
    ClipboardList,
    FileSpreadsheet,
    AlertTriangle,
    XCircle,
    BarChart3,
    CheckCircle2,
    Paperclip,
    Save,
} from "lucide-react";
import { color } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Tipos e interfaces locales                                          */
/* ------------------------------------------------------------------ */

interface Seccion {
    id: number;
    subject: string;
    grade: string;
    students: number;
    attendance: number;
    average: number;
    accent: string;
}

interface Estudiante {
    id: number;
    name: string;
    cedula: string;
    attendance: number;
    average: number;
}

type EvalEstado = "Calificada" | "En curso" | "Pendiente";

interface EvaluacionPlan {
    name: string;
    weight: number;
    date: string;
    status: EvalEstado;
}

interface Pendiente {
    student: string;
    evaluation: string;
    hasEvidence: boolean;
}

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

const SECCIONES: Seccion[] = [
    { id: 1, subject: "Ciencias Naturales", grade: "4.º Año B", students: 6, attendance: 94, average: 15.8, accent: "#dbeafe" },
    { id: 2, subject: "Biología", grade: "5.º Año A", students: 6, attendance: 91, average: 16.4, accent: "#dcfce7" },
    { id: 3, subject: "Ciencias de la Tierra", grade: "3.º Año C", students: 6, attendance: 88, average: 13.9, accent: "#ede9fe" },
    { id: 4, subject: "Química", grade: "5.º Año B", students: 6, attendance: 96, average: 14.7, accent: "#ffedd5" },
];

const ESTUDIANTES: Estudiante[] = [
    { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678", attendance: 97, average: 18.2 },
    { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321", attendance: 92, average: 14.5 },
    { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109", attendance: 88, average: 9.4 },
    { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870", attendance: 95, average: 16.7 },
    { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542", attendance: 78, average: 8.6 },
    { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233", attendance: 99, average: 17.9 },
];

const PLAN: EvaluacionPlan[] = [
    { name: "Prueba escrita · Unidad 1", weight: 20, date: "12 may 2026", status: "Calificada" },
    { name: "Exposición: El Petróleo", weight: 15, date: "28 may 2026", status: "Calificada" },
    { name: "Taller práctico de laboratorio", weight: 20, date: "10 jun 2026", status: "En curso" },
    { name: "Informe de investigación", weight: 25, date: "25 jun 2026", status: "Pendiente" },
    { name: "Examen final · Unidad 3", weight: 20, date: "8 jul 2026", status: "Pendiente" },
];

const PENDIENTES: Pendiente[] = [
    { student: "Carla Valentina Pérez", evaluation: "Taller práctico de laboratorio", hasEvidence: false },
    { student: "Andrea Carolina Suárez", evaluation: "Taller práctico de laboratorio", hasEvidence: true },
    { student: "José Gregorio Martínez", evaluation: "Exposición: El Petróleo", hasEvidence: true },
];

const EVAL_STATUS: Record<EvalEstado, { bg: string; fg: string }> = {
    Calificada: { bg: color.successBg, fg: color.success },
    "En curso": { bg: color.primary100, fg: color.primary },
    Pendiente: { bg: color.subtle, fg: color.ink500 },
};

const TABS = [
    { key: "estudiantes", label: "Estudiantes", icon: Users },
    { key: "plan", label: "Plan de evaluación", icon: ClipboardList },
    { key: "subir", label: "Subir notas", icon: FileSpreadsheet },
    { key: "faltan", label: "Faltan por entregar", icon: AlertTriangle },
    { key: "raspados", label: "Raspados", icon: XCircle },
    { key: "generales", label: "Notas generales", icon: BarChart3 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                      */
/* ------------------------------------------------------------------ */

function Th({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
            {children}
        </span>
    );
}

function notaColor(n: number): string {
    if (n < 10) return "text-edu-danger";
    if (n < 14) return "text-edu-warning";
    return "text-edu-success";
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteSeccionesPage() {
    const [selected, setSelected] = useState<Seccion | null>(null);
    const [tab, setTab] = useState<TabKey>("estudiantes");
    // Notas editables (por id de estudiante) para la pestaña "Subir notas"
    const [notas, setNotas] = useState<Record<number, string>>({});
    const [saved, setSaved] = useState(false);

    const openSeccion = (sec: Seccion) => {
        setSelected(sec);
        setTab("estudiantes");
        setNotas({});
        setSaved(false);
    };

    const raspados = ESTUDIANTES.filter((e) => e.average < 10);
    const promedioSeccion =
        ESTUDIANTES.reduce((acc, e) => acc + e.average, 0) / ESTUDIANTES.length;
    const asistenciaSeccion =
        ESTUDIANTES.reduce((acc, e) => acc + e.attendance, 0) / ESTUDIANTES.length;
    const aprobados = ESTUDIANTES.filter((e) => e.average >= 10).length;

    /* --------------------------- Lista de secciones --------------------------- */
    if (!selected) {
        return (
            <div className="flex flex-col gap-5">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mis secciones</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Secciones asignadas para el ciclo escolar 2026-I
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {SECCIONES.map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => openSeccion(sec)}
                            className="text-left bg-edu-surface border border-edu-border-soft rounded-edu-card p-5 flex flex-col gap-4 cursor-pointer transition-colors hover:border-edu-primary-200"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: sec.accent }}
                                >
                                    <BookOpen className="text-edu-ink-700" style={{ width: "20px", height: "20px" }} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[0.95rem] font-semibold text-edu-ink">{sec.subject}</div>
                                    <div className="text-[0.8rem] text-edu-ink-500 mt-[1px]">{sec.grade}</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                                    <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Estudiantes</div>
                                    <div className="text-[0.95rem] font-bold mt-0.5 text-edu-ink">{sec.students}</div>
                                </div>
                                <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                                    <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Asistencia</div>
                                    <div className={`text-[0.95rem] font-bold mt-0.5 ${sec.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{sec.attendance} %</div>
                                </div>
                                <div className="flex-1 bg-edu-subtle rounded-edu-chip px-2.5 py-2">
                                    <div className="text-[0.65rem] text-edu-ink-400 font-semibold uppercase tracking-[0.04em]">Promedio</div>
                                    <div className={`text-[0.95rem] font-bold mt-0.5 ${notaColor(sec.average)}`}>{sec.average.toFixed(1)}</div>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold">
                                Ver detalle
                                <ChevronRight style={{ width: "14px", height: "14px" }} />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    /* --------------------------- Detalle de sección --------------------------- */
    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado + volver */}
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a secciones
                </button>
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                        style={{ backgroundColor: selected.accent }}
                    >
                        <BookOpen className="text-edu-ink-700" style={{ width: "18px", height: "18px" }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">{selected.subject}</h2>
                        <p className="text-edu-ink-500 text-[0.8rem] m-0">{selected.grade} · {selected.students} estudiantes</p>
                    </div>
                </div>
            </div>

            {/* Pestañas */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-3 pt-2 border-b border-edu-border-soft flex gap-1 flex-wrap">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
                                    active
                                        ? "border-edu-primary text-edu-primary"
                                        : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Estudiantes */}
                {tab === "estudiantes" && (
                    <div>
                        <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Estudiante", "Cédula", "Asistencia", "Promedio"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>
                        {ESTUDIANTES.map((e, i) => (
                            <div
                                key={e.id}
                                className={`grid grid-cols-[2fr_1fr_0.8fr_0.8fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-ink font-medium">{e.name}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                                <span className={`text-sm font-semibold ${e.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{e.attendance} %</span>
                                <span className={`text-sm font-bold ${notaColor(e.average)}`}>{e.average.toFixed(1)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Plan de evaluación */}
                {tab === "plan" && (
                    <div>
                        <div className="grid grid-cols-[2fr_0.7fr_1fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Evaluación", "%", "Fecha", "Estado"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>
                        {PLAN.map((ev, i) => {
                            const st = EVAL_STATUS[ev.status];
                            return (
                                <div
                                    key={i}
                                    className={`grid grid-cols-[2fr_0.7fr_1fr_1fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span className="text-sm text-edu-ink font-medium">{ev.name}</span>
                                    <span className="text-sm text-edu-ink-700 font-semibold">{ev.weight} %</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{ev.date}</span>
                                    <span
                                        className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                        style={{ backgroundColor: st.bg, color: st.fg }}
                                    >
                                        {ev.status}
                                    </span>
                                </div>
                            );
                        })}
                        <div className="px-5 py-3 bg-edu-subtle border-t border-edu-border-soft text-[0.8125rem] text-edu-ink-500 flex justify-between">
                            <span>Total ponderado</span>
                            <span className="font-semibold text-edu-ink">
                                {PLAN.reduce((a, e) => a + e.weight, 0)} %
                            </span>
                        </div>
                    </div>
                )}

                {/* Subir notas (tabla editable) */}
                {tab === "subir" && (
                    <div>
                        <div className="px-5 py-3 bg-edu-primary-50 border-b border-edu-border-soft text-[0.8125rem] text-edu-primary">
                            Cargando notas de: <strong>Taller práctico de laboratorio (20 %)</strong>
                        </div>
                        <div className="grid grid-cols-[2fr_1fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Estudiante", "Cédula", "Nota (0-20)"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>
                        {ESTUDIANTES.map((e, i) => (
                            <div
                                key={e.id}
                                className={`grid grid-cols-[2fr_1fr_1fr] px-5 py-[10px] items-center ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-ink font-medium">{e.name}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                                <input
                                    type="number"
                                    min={0}
                                    max={20}
                                    value={notas[e.id] ?? ""}
                                    placeholder="—"
                                    onChange={(ev) => {
                                        setNotas({ ...notas, [e.id]: ev.target.value });
                                        setSaved(false);
                                    }}
                                    className="w-20 border-[1.5px] border-edu-border rounded-edu-control px-2.5 py-1.5 text-edu-ink outline-none bg-edu-subtle text-sm focus:border-edu-primary"
                                />
                            </div>
                        ))}
                        <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-3">
                            {saved && (
                                <span className="inline-flex items-center gap-1.5 text-edu-success text-[0.8125rem] font-semibold">
                                    <CheckCircle2 className="w-4 h-4" /> Notas guardadas
                                </span>
                            )}
                            <button
                                onClick={() => setSaved(true)}
                                className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                Guardar notas
                            </button>
                        </div>
                    </div>
                )}

                {/* Faltan por entregar */}
                {tab === "faltan" && (
                    <div>
                        <div className="grid grid-cols-[1.6fr_1.6fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Estudiante", "Evaluación", "Evidencia"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>
                        {PENDIENTES.map((p, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-[1.6fr_1.6fr_1fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < PENDIENTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-ink font-medium">{p.student}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{p.evaluation}</span>
                                {p.hasEvidence ? (
                                    <span className="inline-flex items-center gap-1.5 text-edu-primary text-[0.8rem] font-semibold w-fit cursor-pointer">
                                        <Paperclip className="w-3.5 h-3.5" /> Ver evidencia
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-warning-bg text-edu-warning">
                                        Sin evidencia
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Raspados */}
                {tab === "raspados" && (
                    <div>
                        <div className="px-5 py-3 bg-edu-danger-bg border-b border-edu-border-soft text-[0.8125rem] text-edu-danger flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {raspados.length} estudiante(s) con promedio inferior a 10 puntos
                        </div>
                        <div className="grid grid-cols-[2fr_1fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Estudiante", "Cédula", "Promedio"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>
                        {raspados.map((e, i) => (
                            <div
                                key={e.id}
                                className={`grid grid-cols-[2fr_1fr_0.8fr] px-5 py-[13px] items-center bg-edu-danger-bg/30 ${i < raspados.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-danger font-semibold">{e.name}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                                <span className="text-sm font-bold text-edu-danger">{e.average.toFixed(1)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Notas generales */}
                {tab === "generales" && (
                    <div className="p-5 grid grid-cols-4 gap-4">
                        <div className="border border-edu-border-soft rounded-edu-card p-4">
                            <div className="text-[0.7rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em]">Promedio de la sección</div>
                            <div className={`text-[1.6rem] font-bold mt-1.5 ${notaColor(promedioSeccion)}`}>{promedioSeccion.toFixed(1)}</div>
                        </div>
                        <div className="border border-edu-border-soft rounded-edu-card p-4">
                            <div className="text-[0.7rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em]">Asistencia media</div>
                            <div className="text-[1.6rem] font-bold mt-1.5 text-edu-ink">{asistenciaSeccion.toFixed(0)} %</div>
                        </div>
                        <div className="border border-edu-border-soft rounded-edu-card p-4">
                            <div className="text-[0.7rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em]">Aprobados</div>
                            <div className="text-[1.6rem] font-bold mt-1.5 text-edu-success">{aprobados}/{ESTUDIANTES.length}</div>
                        </div>
                        <div className="border border-edu-border-soft rounded-edu-card p-4">
                            <div className="text-[0.7rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em]">Raspados</div>
                            <div className="text-[1.6rem] font-bold mt-1.5 text-edu-danger">{raspados.length}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
