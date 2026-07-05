import { useState, useEffect } from "react";
import { useLocation } from "react-router";
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
    Search,
    Upload,
    X,
    Clock,
    Download,
    ListChecks,
    Presentation,
    FileText,
    FlaskConical,
    PenLine,
} from "lucide-react";
import { color, accent } from "../theme/tokens";

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
    /** Nota obtenida en cada evaluación del plan (alineado al orden de PLAN). null = sin entregar/pendiente. */
    grades: (number | null)[];
}

type EvalEstado = "Calificada" | "En curso" | "Pendiente";
type EvalTipo = "exam" | "lab" | "presentation" | "essay";

interface EvaluacionPlan {
    id: number;
    name: string;
    type: EvalTipo;
    weight: number;
    date: string;
    horario: string;
    status: EvalEstado;
    description: string;
    topics?: string[];
    material?: string;
}

interface Pendiente {
    student: string;
    evaluation: string;
    hasEvidence: boolean;
    evidenceUrl?: string;
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
    { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678", attendance: 97, average: 18.2, grades: [18, 19, 18, null, null] },
    { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321", attendance: 92, average: 14.5, grades: [15, null, 14, null, null] },
    { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109", attendance: 88, average: 9.4, grades: [10, 9, null, null, null] },
    { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870", attendance: 95, average: 16.7, grades: [17, 16, 17, null, null] },
    { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542", attendance: 78, average: 8.6, grades: [9, 8, null, null, null] },
    { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233", attendance: 99, average: 17.9, grades: [18, 18, 17, null, null] },
];

const PLAN: EvaluacionPlan[] = [
    {
        id: 1,
        name: "Prueba escrita · Unidad 1",
        type: "exam",
        weight: 20,
        date: "12 may 2026",
        horario: "Lun · 07:00",
        status: "Calificada",
        description: "Prueba escrita individual sobre los contenidos de la Unidad 1.",
        topics: ["Método científico", "Materia y energía", "Estados de la materia"],
        material: "Guia_Unidad1.pdf",
    },
    {
        id: 2,
        name: "Exposición: El Petróleo",
        type: "presentation",
        weight: 15,
        date: "28 may 2026",
        horario: "Mié · 09:30",
        status: "Calificada",
        description: "Exposición grupal sobre el petróleo, su origen y sus derivados.",
        topics: ["Origen del petróleo", "Refinación", "Impacto ambiental"],
    },
    {
        id: 3,
        name: "Taller práctico de laboratorio",
        type: "lab",
        weight: 20,
        date: "10 jun 2026",
        horario: "Mié · 11:15",
        status: "En curso",
        description: "Taller práctico en el laboratorio sobre reacciones químicas y medición.",
        material: "Instrucciones_Taller.pdf",
    },
    {
        id: 4,
        name: "Informe de investigación",
        type: "essay",
        weight: 25,
        date: "25 jun 2026",
        horario: "Lun · 07:00",
        status: "Pendiente",
        description: "Informe escrito de investigación sobre un tema asignado por el docente.",
    },
    {
        id: 5,
        name: "Examen final · Unidad 3",
        type: "exam",
        weight: 20,
        date: "8 jul 2026",
        horario: "Mié · 09:30",
        status: "Pendiente",
        description: "Examen final que abarca todos los contenidos de la Unidad 3.",
        topics: ["Ecosistemas", "Ciclos biogeoquímicos", "Biodiversidad"],
    },
];

const PENDIENTES: Pendiente[] = [
    { student: "Carla Valentina Pérez", evaluation: "Taller práctico de laboratorio", hasEvidence: false },
    { student: "Andrea Carolina Suárez", evaluation: "Taller práctico de laboratorio", hasEvidence: true, evidenceUrl: "https://picsum.photos/seed/evidencia-andrea/640/440" },
    { student: "José Gregorio Martínez", evaluation: "Exposición: El Petróleo", hasEvidence: true, evidenceUrl: "https://picsum.photos/seed/evidencia-jose/640/440" },
];

const EVAL_STATUS: Record<EvalEstado, { bg: string; fg: string }> = {
    Calificada: { bg: color.successBg, fg: color.success },
    "En curso": { bg: color.primary100, fg: color.primary },
    Pendiente: { bg: color.subtle, fg: color.ink500 },
};

const TYPE_META: Record<EvalTipo, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const TABS = [
    { key: "estudiantes", label: "Estudiantes", icon: Users },
    { key: "plan", label: "Plan de evaluación", icon: ClipboardList },
    { key: "subir", label: "Subir notas", icon: FileSpreadsheet },
    { key: "faltan", label: "Faltan por entregar", icon: AlertTriangle },
    { key: "raspados", label: "Reprobados", icon: XCircle },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type FiltroNota = "todos" | "aprobados" | "por_entregar" | "reprobados";

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

    // Modal de detalle de una evaluación del plan
    const [evalDetail, setEvalDetail] = useState<EvaluacionPlan | null>(null);

    // Modal de evidencia entregada (pestaña "Faltan por entregar")
    const [evidence, setEvidence] = useState<Pendiente | null>(null);

    // Modal con el detalle de notas y resultados de un estudiante
    const [studentDetail, setStudentDetail] = useState<Estudiante | null>(null);

    // Pestaña "Subir notas"
    const [query, setQuery] = useState("");
    const [filtro, setFiltro] = useState<FiltroNota>("todos");
    const [selectedEvalId, setSelectedEvalId] = useState<number>(
        PLAN.find((p) => p.status === "En curso")?.id ?? PLAN[0].id,
    );
    const [notas, setNotas] = useState<Record<number, string>>({});

    // Modal para subir la nota de un estudiante
    const [gradeStudent, setGradeStudent] = useState<Estudiante | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [gradeFile, setGradeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);

    // Permite abrir una sección concreta al llegar desde el horario
    const location = useLocation();
    useEffect(() => {
        const sid = (location.state as { seccionId?: number } | null)?.seccionId;
        if (sid) {
            const sec = SECCIONES.find((s) => s.id === sid);
            if (sec) {
                setSelected(sec);
                setTab("estudiantes");
            }
        }
    }, [location.state]);

    const openSeccion = (sec: Seccion) => {
        setSelected(sec);
        setTab("estudiantes");
        setQuery("");
        setFiltro("todos");
        setNotas({});
        setEvalDetail(null);
        setEvidence(null);
        setStudentDetail(null);
    };

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

    const raspados = ESTUDIANTES.filter((e) => e.average < 10);
    const promedioSeccion = ESTUDIANTES.reduce((acc, e) => acc + e.average, 0) / ESTUDIANTES.length;
    const asistenciaSeccion = ESTUDIANTES.reduce((acc, e) => acc + e.attendance, 0) / ESTUDIANTES.length;
    const aprobados = ESTUDIANTES.filter((e) => e.average >= 10).length;
    const ultimaEval = PLAN.find((p) => p.status === "En curso") ?? PLAN[PLAN.length - 1];
    const faltanUltima = PENDIENTES.filter((p) => p.evaluation === ultimaEval.name).length;

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
            {/* Volver */}
            <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a secciones
            </button>

            {/* Banner de la sección (estilo CoursePage) */}
            <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                        <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                            Sección · Ciclo escolar 2026-I
                        </span>
                    </div>
                    <h2 className="text-white mb-1.5 text-xl font-bold m-0">{selected.subject}</h2>
                    <div className="flex gap-4 flex-wrap">
                        <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{selected.grade}</span>
                        <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{selected.students} estudiantes</span>
                    </div>
                </div>
            </div>

            {/* Resumen general de la sección (antes "Notas generales") */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: "Promedio de la sección", value: promedioSeccion.toFixed(1), icon: BarChart3, ac: accent.blue, valueClass: notaColor(promedioSeccion) },
                    { label: "Asistencia media", value: `${asistenciaSeccion.toFixed(0)} %`, icon: Users, ac: accent.purple, valueClass: "text-edu-ink" },
                    { label: "Aprobados", value: `${aprobados}/${ESTUDIANTES.length}`, icon: CheckCircle2, ac: accent.green, valueClass: "text-edu-success" },
                    { label: "Reprobados", value: String(raspados.length), icon: XCircle, ac: accent.red, valueClass: "text-edu-danger" },
                    { label: "Faltan última evaluación", value: String(faltanUltima), icon: AlertTriangle, ac: accent.amber, valueClass: "text-edu-warning" },
                ].map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-edu-surface rounded-edu-card p-4 border border-edu-border-soft flex flex-col gap-2.5">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-edu-ink-500 text-[0.7rem] font-medium m-0 uppercase tracking-[0.05em]">{s.label}</p>
                                <div className="w-9 h-9 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: s.ac.bg }}>
                                    <Icon style={{ width: "17px", height: "17px", color: s.ac.fg }} />
                                </div>
                            </div>
                            <p className={`text-[1.5rem] font-bold m-0 ${s.valueClass}`}>{s.value}</p>
                        </div>
                    );
                })}
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
                                onClick={() => setStudentDetail(e)}
                                className={`grid grid-cols-[2fr_1fr_0.8fr_0.8fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-ink font-medium">{e.name}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{e.cedula}</span>
                                <span className={`text-sm font-semibold ${e.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{e.attendance} %</span>
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`text-sm font-bold ${notaColor(e.average)}`}>{e.average.toFixed(1)}</span>
                                    <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Plan de evaluación (tabla clickable → modal) */}
                {tab === "plan" && (
                    <div>
                        <div className="grid grid-cols-[2fr_1fr_0.6fr_1fr_1fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                            {["Evaluación", "Horario", "%", "Fecha", "Estado"].map((h) => (
                                <Th key={h}>{h}</Th>
                            ))}
                        </div>
                        {PLAN.map((ev, i) => {
                            const st = EVAL_STATUS[ev.status];
                            const tm = TYPE_META[ev.type];
                            return (
                                <div
                                    key={ev.id}
                                    onClick={() => setEvalDetail(ev)}
                                    className={`grid grid-cols-[2fr_1fr_0.6fr_1fr_1fr] px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                            <tm.icon style={{ width: "15px", height: "15px", color: tm.color }} />
                                        </div>
                                        <span className="text-sm text-edu-ink font-medium truncate">{ev.name}</span>
                                    </div>
                                    <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-edu-ink-400 shrink-0" />
                                        {ev.horario}
                                    </span>
                                    <span className="text-sm text-edu-ink-700 font-semibold">{ev.weight} %</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{ev.date}</span>
                                    <div className="flex items-center justify-between gap-1">
                                        <span
                                            className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                            style={{ backgroundColor: st.bg, color: st.fg }}
                                        >
                                            {ev.status}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                                    </div>
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

                {/* Subir notas — estudiantes (izq) + plan visual (der) */}
                {tab === "subir" && (
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
                                    <button
                                        onClick={() => setEvidence(p)}
                                        className="inline-flex items-center gap-1.5 text-edu-primary text-[0.8rem] font-semibold w-fit cursor-pointer bg-transparent border-none p-0 hover:underline"
                                    >
                                        <Paperclip className="w-3.5 h-3.5" /> Ver evidencia
                                    </button>
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
            </div>

            {/* Modal: detalle de una evaluación del plan */}
            {evalDetail && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setEvalDetail(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(() => {
                            const tm = TYPE_META[evalDetail.type];
                            const st = EVAL_STATUS[evalDetail.status];
                            const TypeIcon = tm.icon;
                            return (
                                <>
                                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                                <TypeIcon style={{ width: "18px", height: "18px", color: tm.color }} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{evalDetail.name}</h3>
                                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.subject} · {selected.grade}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEvalDetail(null)}
                                            aria-label="Cerrar"
                                            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col gap-4">
                                        <div className="flex items-center justify-between px-4 py-3 rounded-edu-control bg-edu-subtle">
                                            <div>
                                                <div className="text-[0.72rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Fecha</div>
                                                <div className="text-[1.1rem] font-bold text-edu-ink leading-none mt-0.5">{evalDetail.date}</div>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 bg-edu-primary-50 text-edu-primary text-[0.8rem] font-semibold px-3 py-1.5 rounded-edu-pill">
                                                <Clock className="w-3.5 h-3.5" />
                                                {evalDetail.horario}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {[
                                                { label: "Tipo", value: tm.label },
                                                { label: "Peso", value: `${evalDetail.weight} %` },
                                                { label: "Docente", value: "Prof. Alejandro Morales" },
                                            ].map((d) => (
                                                <div key={d.label}>
                                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{d.label}</div>
                                                    <div className="text-[0.875rem] text-edu-ink font-medium">{d.value}</div>
                                                </div>
                                            ))}
                                            <div>
                                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado</div>
                                                <span
                                                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit mt-0.5"
                                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                                >
                                                    {evalDetail.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Descripción</div>
                                            <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{evalDetail.description}</p>
                                        </div>

                                        {evalDetail.topics && evalDetail.topics.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <ListChecks className="w-3.5 h-3.5 text-edu-primary" />
                                                    <span className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">
                                                        Temas ({evalDetail.topics.length})
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {evalDetail.topics.map((topic, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-2.5 px-3.5 py-2 bg-edu-primary-50 rounded-edu-chip border border-edu-primary-100"
                                                        >
                                                            <div className="w-[20px] h-[20px] rounded-full bg-edu-primary text-white flex items-center justify-center text-[0.68rem] font-bold shrink-0">
                                                                {idx + 1}
                                                            </div>
                                                            <span className="text-[0.8125rem] text-[#1e3a5f] leading-[1.5]">{topic}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {evalDetail.material && (
                                            <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                                <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5 text-edu-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-edu-ink truncate">{evalDetail.material}</div>
                                                    <div className="text-xs text-edu-ink-400">Material de apoyo</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Descargar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

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
                                Evaluación: <strong>{selectedEval.name}</strong> ({selectedEval.weight} %)
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

            {/* Modal: evidencia entregada */}
            {evidence && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setEvidence(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                            <div className="min-w-0">
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Evidencia entregada</h3>
                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5 truncate">{evidence.student} · {evidence.evaluation}</div>
                            </div>
                            <button
                                onClick={() => setEvidence(null)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            {evidence.evidenceUrl && (
                                <img
                                    src={evidence.evidenceUrl}
                                    alt={`Evidencia de ${evidence.student}`}
                                    className="w-full max-h-[60vh] object-contain rounded-edu-control border border-edu-border-soft bg-edu-subtle"
                                />
                            )}
                            <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                    <Paperclip className="w-5 h-5 text-edu-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-edu-ink truncate">Prueba adjunta</div>
                                    <div className="text-xs text-edu-ink-400">Entregada por el estudiante</div>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Descargar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: detalle de notas y resultados del estudiante */}
            {studentDetail && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setStudentDetail(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-[0.8rem] font-bold text-edu-primary shrink-0">
                                    {studentDetail.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] truncate">{studentDetail.name}</h3>
                                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{studentDetail.cedula}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setStudentDetail(null)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            {/* Resumen del estudiante */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-edu-subtle rounded-edu-control px-3 py-2.5">
                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Promedio</div>
                                    <div className={`text-[1.2rem] font-bold ${notaColor(studentDetail.average)}`}>{studentDetail.average.toFixed(1)}</div>
                                </div>
                                <div className="bg-edu-subtle rounded-edu-control px-3 py-2.5">
                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Asistencia</div>
                                    <div className={`text-[1.2rem] font-bold ${studentDetail.attendance >= 90 ? "text-edu-success" : "text-edu-warning"}`}>{studentDetail.attendance} %</div>
                                </div>
                                <div className="bg-edu-subtle rounded-edu-control px-3 py-2.5">
                                    <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Estado</div>
                                    <div className={`text-[1.2rem] font-bold ${studentDetail.average >= 10 ? "text-edu-success" : "text-edu-danger"}`}>
                                        {studentDetail.average >= 10 ? "Aprobado" : "Reprobado"}
                                    </div>
                                </div>
                            </div>

                            {/* Resultados por evaluación */}
                            <div>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-2">
                                    Resultados por evaluación
                                </div>
                                <div className="rounded-edu-control border border-edu-border-soft overflow-hidden">
                                    {PLAN.map((ev, idx) => {
                                        const g = studentDetail.grades[idx];
                                        const tm = TYPE_META[ev.type];
                                        return (
                                            <div
                                                key={ev.id}
                                                className={`flex items-center gap-3 px-3.5 py-2.5 ${idx < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                            >
                                                <div className="w-8 h-8 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                                    <tm.icon style={{ width: "14px", height: "14px", color: tm.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{ev.name}</div>
                                                    <div className="text-[0.7rem] text-edu-ink-400">{ev.weight} % · {ev.date}</div>
                                                </div>
                                                {g != null ? (
                                                    <span className={`text-sm font-bold shrink-0 ${notaColor(g)}`}>
                                                        {g.toFixed(1)}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                                    </span>
                                                ) : ev.status === "Pendiente" ? (
                                                    <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-subtle text-edu-ink-500 shrink-0">
                                                        Pendiente
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-warning-bg text-edu-warning shrink-0">
                                                        Sin entregar
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
