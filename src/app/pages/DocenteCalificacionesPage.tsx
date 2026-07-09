import { useState, useEffect } from "react";
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
    Pencil,
    Users,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { color } from "../theme/tokens";
import { LapsoFilter } from "../components/LapsoFilter";
import { useLapso } from "../context/LapsoContext";
import { useFetch } from "../datos_maquetados";
import {
    getCalificaciones,
    type EvalTipo,
    type Estudiante,
    type EvaluacionPlan,
} from "../datos_maquetados/actions/docente-eval";
import { Pagination } from "../components/Pagination";

const PER_PAGE = 5;

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
/* Donut SVG                                                           */
/* ------------------------------------------------------------------ */
function DonutChart({ pct, size = 76, fillColor, trackColor = "#e9edf2" }: {
    pct: number; size?: number; fillColor: string; trackColor?: string;
}) {
    const sw = Math.round(size * 0.13);
    const r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    const dash = Math.max(0, Math.min(pct, 1)) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={sw} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={fillColor} strokeWidth={sw}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */
export function DocenteCalificacionesPage() {
    const { selectedId } = useLapso();
    const { data: CALIFICACIONES, loading } = useFetch(getCalificaciones, null);

    const ANIOS = CALIFICACIONES?.anios ?? [];
    const MATERIAS = CALIFICACIONES?.materias ?? [];
    const lapsoData = CALIFICACIONES?.porLapso[selectedId];
    const PLAN = lapsoData?.plan ?? [];
    const ESTUDIANTES = lapsoData?.estudiantes ?? [];
    const attendancePct = CALIFICACIONES?.asistenciaPorLapso[selectedId] ?? 0;

    const [anio, setAnio] = useState("");
    const [materia, setMateria] = useState("");
    const [query, setQuery] = useState("");
    const [filtro, setFiltro] = useState<FiltroNota>("todos");
    const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
    const [page, setPage] = useState(1);

    // Sincroniza los valores iniciales de los selectores al cargar los datos.
    useEffect(() => {
        if (ANIOS.length && !anio) setAnio(ANIOS[1] ?? ANIOS[0]);
        if (MATERIAS.length && !materia) setMateria(MATERIAS[0]);
    }, [ANIOS, MATERIAS, anio, materia]);

    // Modal state
    const [gradeCtx, setGradeCtx] = useState<{ student: Estudiante; ev: EvaluacionPlan } | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [gradeFile, setGradeFile] = useState<{ url: string; name: string; isImage: boolean } | null>(null);
    const [notas, setNotas] = useState<Record<string, string>>({});

    // KPI values
    const classAverage = ESTUDIANTES.length > 0
        ? ESTUDIANTES.reduce((s, e) => s + e.average, 0) / ESTUDIANTES.length
        : 0;
    const approvedCount = ESTUDIANTES.filter(e => e.average >= 10).length;
    const avgKpiColor = classAverage >= 14 ? color.success : classAverage >= 10 ? color.warning : color.danger;
    const attKpiColor = attendancePct >= 80 ? color.success : attendancePct >= 70 ? color.warning : color.danger;

    // Filtered student list
    const filteredStudents = ESTUDIANTES.filter((e) => {
        if (query.trim() && !e.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
        if (filtro === "aprobados") return e.average >= 10;
        if (filtro === "reprobados") return e.average < 10;
        if (filtro === "por_entregar") return e.grades.some(g => g === null);
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedStudents = filteredStudents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    // Modal helpers
    const gradeKey = gradeCtx ? `${gradeCtx.student.id}_${gradeCtx.ev.id}` : "";
    const gradeEvalIdx = gradeCtx ? PLAN.findIndex(p => p.id === gradeCtx.ev.id) : -1;
    const gradePrev = gradeCtx
        ? (notas[gradeKey] ?? (gradeEvalIdx >= 0 && gradeCtx.student.grades[gradeEvalIdx] != null
            ? gradeCtx.student.grades[gradeEvalIdx]!.toFixed(1)
            : null))
        : null;
    const gradeIsChange = gradePrev != null;

    const openGrade = (student: Estudiante, ev: EvaluacionPlan) => {
        setGradeCtx({ student, ev });
        setGradeValue("");
        setGradeFile(null);
    };

    const onGradeFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        setGradeFile({ url: URL.createObjectURL(file), name: file.name, isImage: file.type.startsWith("image/") });
    };

    const saveGrade = () => {
        if (gradeCtx) setNotas(prev => ({ ...prev, [gradeKey]: gradeValue }));
        setGradeCtx(null);
    };

    const selectCls =
        "border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary";

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Calificaciones</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">
                        Sube y actualiza las notas de tus estudiantes por evaluación
                    </p>
                </div> */}
            </div>

            {/* Año y materia */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 grid md:grid-cols-2 items-end gap-4">
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Año</label>
                    <select value={anio} onChange={(e) => setAnio(e.target.value)} className={selectCls}>
                        {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                    <label className="text-edu-ink-700 text-sm font-medium">Materia</label>
                    <select value={materia} onChange={(e) => setMateria(e.target.value)} className={selectCls}>
                        {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <LapsoFilter />
                </div>
            </div>

            {/* KPI donuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Promedio de notas */}
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex items-center gap-5">
                    <div className="relative shrink-0 w-[76px] h-[76px]">
                        <DonutChart pct={classAverage / 20} fillColor={avgKpiColor} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-edu-ink font-bold text-[0.9rem]">
                                {classAverage > 0 ? classAverage.toFixed(1) : "—"}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Promedio de notas</p>
                        <p className="text-edu-ink text-[1.5rem] font-bold mt-0.5 m-0 leading-none">
                            {classAverage > 0 ? classAverage.toFixed(1) : "—"}
                            {classAverage > 0 && <span className="text-edu-ink-400 font-normal text-sm ml-1">/20</span>}
                        </p>
                        <p className="text-edu-ink-400 text-xs mt-1.5 m-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-edu-success shrink-0" />
                            {approvedCount} de {ESTUDIANTES.length} aprobados
                        </p>
                    </div>
                </div>

                {/* Asistencia */}
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex items-center gap-5">
                    <div className="relative shrink-0 w-[76px] h-[76px]">
                        <DonutChart pct={attendancePct / 100} fillColor={attendancePct > 0 ? attKpiColor : "#e9edf2"} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-edu-ink font-bold text-[0.85rem]">
                                {attendancePct > 0 ? `${attendancePct}%` : "—"}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Asistencia</p>
                        <p className="text-edu-ink text-[1.5rem] font-bold mt-0.5 m-0 leading-none">
                            {attendancePct > 0 ? `${attendancePct} %` : "—"}
                        </p>
                        <p className="text-edu-ink-400 text-xs mt-1.5 m-0 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-edu-warning shrink-0" />
                            Mínimo exigido: 75 %
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla + panel de notas */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Izquierda: listado de estudiantes */}
                    <div className="lg:col-span-2 border-r border-edu-border-soft">
                        {/* Buscador y filtros */}
                        <div className="px-5 py-3 border-b border-edu-border-soft grid md:flex gap-2 items-center flex-wrap">
                            <div className="relative flex-1 min-w-[160px]">
                                <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                                    placeholder="Buscar estudiante…"
                                    className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 md:block gap-2 md:space-x-2">
                                {([
                                    { key: "todos", label: "Todos" },
                                    { key: "aprobados", label: "Aprobados" },
                                    { key: "por_entregar", label: "Por entregar" },
                                    { key: "reprobados", label: "Reprobados" },
                                ] as const).map((f) => (
                                    <button
                                        key={f.key}
                                        onClick={() => { setFiltro(f.key); setPage(1); }}
                                        className={`px-3 py-[7px] rounded-edu-control border-[1.5px] text-[0.775rem] font-medium cursor-pointer transition-colors ${filtro === f.key ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500 hover:text-edu-ink-700"}`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Cabecera tabla */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[680px]">
                                <div className="grid grid-cols-[2fr_0.8fr_0.85fr_1fr_0.65fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                                    {["Estudiante", "Promedio", "Realizadas", "Estado", ""].map((h) => (
                                        <Th key={h}>{h}</Th>
                                    ))}
                                </div>

                                {filteredStudents.length === 0 && (
                                    <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                        No hay estudiantes que coincidan con el filtro.
                                    </div>
                                )}

                                {pagedStudents.map((e, i) => {
                                    const realizadas = e.grades.filter(g => g !== null).length;
                                    const isApproved = e.average >= 10;
                                    const isSelected = selectedStudent?.id === e.id;
                                    const firstPendingIdx = e.grades.findIndex(g => g === null);
                                    const firstActionEval = firstPendingIdx >= 0 ? PLAN[firstPendingIdx] : PLAN[0];

                                    return (
                                        <div
                                            key={e.id}
                                            onClick={() => setSelectedStudent(e)}
                                            className={`grid grid-cols-[2fr_0.8fr_0.85fr_1fr_0.65fr] px-5 py-[11px] items-center cursor-pointer transition-colors ${isSelected ? "bg-edu-primary-50 border-l-[3px] border-edu-primary" : "hover:bg-edu-subtle border-l-[3px] border-transparent"} ${i < pagedStudents.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                        >
                                            <div className="min-w-0">
                                                <div className="text-sm text-edu-ink font-medium truncate">{e.name}</div>
                                                <div className="text-[0.75rem] text-edu-ink-400">{e.cedula}</div>
                                            </div>
                                            <span className={`text-sm font-bold ${e.average > 0 ? notaColor(e.average) : "text-edu-ink-300"}`}>
                                                {e.average > 0 ? e.average.toFixed(1) : "—"}
                                            </span>
                                            <span className="text-sm text-edu-ink-700 font-medium">
                                                {realizadas}/{PLAN.length}
                                            </span>
                                            {e.average <= 0 ? (
                                                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-subtle text-edu-ink-400 border border-edu-border-soft">
                                                    Sin notas
                                                </span>
                                            ) : isApproved ? (
                                                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-success-bg text-edu-success">
                                                    Aprobado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">
                                                    Reprobado
                                                </span>
                                            )}
                                            <button
                                                onClick={(evt) => {
                                                    evt.stopPropagation();
                                                    setSelectedStudent(e);
                                                    openGrade(e, firstActionEval);
                                                }}
                                                aria-label={isApproved ? `Modificar nota de ${e.name}` : `Subir nota de ${e.name}`}
                                                className={`w-9 h-9 rounded-edu-control border-[1.5px] flex items-center justify-center cursor-pointer transition-colors shrink-0 ${isApproved
                                                    ? "border-edu-border bg-edu-surface text-edu-ink-500 hover:bg-edu-subtle hover:text-edu-ink"
                                                    : "border-edu-primary-200 bg-edu-primary-50 text-edu-primary hover:bg-edu-primary-100"
                                                    }`}
                                            >
                                                {isApproved ? <Pencil className="w-[15px] h-[15px]" /> : <Upload className="w-[15px] h-[15px]" />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="px-5 py-4 border-t border-edu-border-soft">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                            </div>
                        )}
                    </div>

                    {/* Derecha: notas del estudiante seleccionado */}
                    <div className="flex flex-col min-h-[300px]">
                        {selectedStudent ? (
                            <>
                                <div className="px-4 py-3 border-b border-edu-border-soft flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="m-0 text-edu-ink font-semibold text-[0.85rem] truncate">{selectedStudent.name}</h3>
                                        <p className="text-[0.72rem] text-edu-ink-400 m-0 mt-0.5">
                                            {selectedStudent.grades.filter(g => g !== null).length}/{PLAN.length} notas subidas
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        aria-label="Cerrar panel"
                                        className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0 mt-0.5"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    {PLAN.map((ev, idx) => {
                                        const key = `${selectedStudent.id}_${ev.id}`;
                                        const nota: number | null = key in notas
                                            ? Number(notas[key])
                                            : selectedStudent.grades[idx];
                                        const isPending = nota === null;
                                        const tm = TYPE_META[ev.type];
                                        return (
                                            <div
                                                key={ev.id}
                                                className={`px-4 py-3 flex items-center gap-2.5 ${idx < PLAN.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                            >
                                                <div className="w-7 h-7 rounded-edu-chip flex items-center justify-center shrink-0" style={{ backgroundColor: tm.bg }}>
                                                    <tm.icon style={{ width: "12px", height: "12px", color: tm.color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[0.78rem] font-medium text-edu-ink leading-snug truncate">{ev.name}</div>
                                                    <div className="text-[0.68rem] text-edu-ink-400 mt-px">{ev.weight}% · {ev.date}</div>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {isPending ? (
                                                        <>
                                                            <span className="text-[0.7rem] text-edu-ink-300">Sin subir</span>
                                                            <button
                                                                onClick={() => openGrade(selectedStudent, ev)}
                                                                title="Subir nota"
                                                                className="w-7 h-7 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary flex items-center justify-center cursor-pointer hover:bg-edu-primary-100 transition-colors"
                                                            >
                                                                <Upload className="w-3 h-3" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className={`text-sm font-bold ${notaColor(nota!)}`}>{nota!.toFixed(1)}</span>
                                                            <button
                                                                onClick={() => openGrade(selectedStudent, ev)}
                                                                className="px-2 py-[3px] rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-600 text-[0.68rem] font-medium cursor-pointer hover:bg-edu-subtle transition-colors whitespace-nowrap"
                                                            >
                                                                Modificar
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
                                <div className="w-12 h-12 rounded-edu-control bg-edu-subtle flex items-center justify-center mb-3">
                                    <Users className="w-6 h-6 text-edu-ink-300" />
                                </div>
                                <p className="text-edu-ink-500 text-sm font-medium m-0">Selecciona un estudiante</p>
                                <p className="text-edu-ink-400 text-xs mt-1 m-0">para ver y gestionar sus notas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: subir / modificar nota */}
            {gradeCtx && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    onClick={() => setGradeCtx(null)}
                >
                    <div
                        className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header: nombre del estudiante + evaluación en grande */}
                        <div className="px-5 py-5 border-b border-edu-border-soft flex justify-between items-start gap-3">
                            <div className="min-w-0">
                                <h3 className="m-0 text-edu-ink font-bold text-[1.3rem] leading-tight">{gradeCtx.student.name}</h3>
                                <p className="text-edu-ink-700 text-[0.9rem] font-semibold mt-1 m-0">{gradeCtx.ev.name}</p>
                                <p className="text-edu-ink-400 text-[0.78rem] mt-0.5 m-0">{materia} · {anio} · {gradeCtx.ev.weight}%</p>
                            </div>
                            <button
                                onClick={() => setGradeCtx(null)}
                                aria-label="Cerrar"
                                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4">
                            {/* Adjunto anterior (cuando se modifica) */}
                            {gradeIsChange && (
                                <div>
                                    <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium block mb-2">
                                        Adjunto anterior
                                    </label>
                                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                        <div className="w-8 h-8 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-edu-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-edu-ink truncate">Prueba_evaluacion.jpg</div>
                                            <div className="text-xs text-edu-ink-400">Archivo adjunto previo</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nota anterior */}
                            {gradeIsChange && (
                                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                                    <span className="text-[0.8125rem] text-edu-ink-500 font-medium">Nota anterior</span>
                                    <span className={`text-[1.1rem] font-bold ${notaColor(Number(gradePrev))}`}>
                                        {gradePrev}<span className="text-edu-ink-400 font-normal text-[0.75rem]">/20</span>
                                    </span>
                                </div>
                            )}

                            {/* Nota nueva */}
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

                            {/* Adjuntar imagen / archivo */}
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
                                onClick={() => setGradeCtx(null)}
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
