import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    Download,
    Clock,
    Presentation,
    FileText,
    FlaskConical,
    PenLine,
    BookOpen,
    User,
    MessageCircle,
} from "lucide-react";
import { color } from "../theme/tokens";
import { getCourseById, EXTRA_COURSES, type CourseEvaluation } from "../data/courses";

const TYPE_META: Record<CourseEvaluation["type"], { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const STATUS_META: Record<CourseEvaluation["status"], { bg: string; color: string; label: string }> = {
    pending: { bg: color.warningBg, color: color.warning, label: "Pendiente" },
    submitted: { bg: color.primary100, color: color.primary, label: "Entregada" },
    graded: { bg: color.successBg, color: color.success, label: "Calificada" },
};

function initialsOf(name: string) {
    return name
        .replace(/^Prof\.?\s*/i, "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

function EvaluationCard({ evaluation, defaultOpen, preview }: { evaluation: CourseEvaluation; defaultOpen: boolean; preview?: boolean }) {
    const [expanded, setExpanded] = useState(defaultOpen);
    const typeMeta = TYPE_META[evaluation.type];
    const statusMeta = STATUS_META[evaluation.status];
    const TypeIcon = typeMeta.icon;

    return (
        <div
            className={`bg-edu-surface rounded-xl overflow-hidden transition-colors ${expanded ? "border-[1.5px] border-edu-primary-200" : "border border-edu-border-soft"}`}
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3.5 px-[18px] py-4 bg-transparent border-none cursor-pointer text-left"
            >
                <div
                    className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                    style={{ backgroundColor: typeMeta.bg }}
                >
                    <TypeIcon style={{ width: "18px", height: "18px", color: typeMeta.color }} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[0.9rem] font-semibold text-edu-ink">{evaluation.title}</span>
                        <span
                            className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill"
                            style={{ backgroundColor: typeMeta.bg, color: typeMeta.color }}
                        >
                            {typeMeta.label}
                        </span>
                    </div>
                    <div className="flex gap-3 mt-1 flex-wrap">
                        <span className="text-[0.775rem] text-edu-ink-500 flex items-center gap-1">
                            <Clock style={{ width: "11px", height: "11px" }} />
                            {evaluation.dueDate}
                        </span>
                        <span className="text-[0.775rem] text-edu-ink-500">Peso: <strong className="text-edu-ink-700">{evaluation.weight}</strong></span>
                        {!preview && evaluation.status === "graded" && (
                            <span className="text-[0.775rem] text-edu-success font-semibold">
                                Nota: {evaluation.grade}/20
                            </span>
                        )}
                    </div>
                </div>

                {!preview && (
                    <span
                        className="text-[0.7rem] font-semibold px-2.5 py-[3px] rounded-edu-pill shrink-0"
                        style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
                    >
                        {statusMeta.label}
                    </span>
                )}

                <div className="text-edu-ink-400 shrink-0">
                    {expanded ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-edu-border-soft px-[18px] py-5 bg-edu-tint flex flex-col gap-4">
                    <div>
                        <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                            Instrucciones
                        </p>
                        <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                            {evaluation.description ?? "El docente publicará los detalles de esta evaluación próximamente."}
                        </p>
                    </div>
                    {!preview && (
                        <div className="pt-1">
                            <button className="w-full inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] border-[1.5px] border-edu-success-200 bg-edu-success-bg text-edu-success text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-success-100">
                                <Download style={{ width: "15px", height: "15px" }} />
                                Descargar material
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const course = getCourseById(id) ?? EXTRA_COURSES[0];
    const isEnrolled = !!course.enrollment;
    const [filter, setFilter] = useState<"Todas" | "Pendientes" | "Calificadas">("Todas");

    const evaluations = course.evaluations;
    const pendingCount = evaluations.filter((e) => e.status === "pending").length;
    const gradedEvals = evaluations.filter((e) => e.status === "graded");
    const firstPending = evaluations.find((e) => e.status === "pending");
    const filteredEvaluations = evaluations.filter((e) =>
        filter === "Todas" ? true : filter === "Calificadas" ? e.status === "graded" : e.status !== "graded",
    );

    const avg = gradedEvals.length
        ? gradedEvals.reduce((sum, e) => sum + parseFloat(e.grade ?? "0"), 0) / gradedEvals.length
        : null;
    const evaluatedWeight = gradedEvals.reduce((sum, e) => sum + (parseInt(e.weight, 10) || 0), 0);

    return (
        <div className="flex flex-col gap-5">
            {/* Volver */}
            <button
                onClick={() => navigate("/estudiante/cursos")}
                className="flex items-center gap-1.5 text-edu-ink-500 text-sm font-medium bg-transparent border-none cursor-pointer w-fit hover:text-edu-primary transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Volver a cursos
            </button>

            <div className="grid grid-cols-5 gap-5">

                <div className="col-span-2 space-y-2">
                    {/* Banner del curso */}
                    <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <BookOpen style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                                <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                                    {course.code} · Curso extracurricular
                                </span>
                            </div>
                            <h2 className="text-white mb-1.5 text-xl font-bold m-0">{course.title}</h2>
                            <div className="flex gap-4 flex-wrap">
                                {[course.schedule, course.room, `Período ${course.term}`].map((item) => (
                                    <span key={item} className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{item}</span>
                                ))}

                                {isEnrolled && (
                                    <Link to="/estudiante/mensajes" className="h-7 rounded-[7px] bg-edu-success-bg flex items-center gap-2 justify-center w-full">
                                        <MessageCircle style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                                        <span className="text-[0.8rem] text-edu-success">Chat grupal del curso</span>
                                    </Link>
                                )}

                            </div>
                        </div>
                        {isEnrolled && (
                            <div className="flex justify-center gap-3 w-full">
                                {[
                                    { label: "Pendientes", value: pendingCount },
                                    { label: "Calificadas", value: gradedEvals.length },
                                ].map(({ label, value }) => (
                                    <div key={label} className=" w-full bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
                                        <div className="text-[1.3rem] font-bold text-white">{value}</div>
                                        <div className="text-[0.72rem] text-[rgba(255,255,255,0.75)] mt-px">{label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {isEnrolled ? (
                        /* Resumen — solo para cursos en los que participo */
                        <div className="grid grid-cols-2 bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-4 gap-0">
                            {[
                                { label: "Evaluaciones", value: `${gradedEvals.length}/${evaluations.length}`, color: color.success },
                                { label: "Promedio", value: avg !== null ? `${avg.toFixed(1).replace(".", ",")}/20` : "—", color: color.primary },
                                { label: "Peso evaluado", value: `${evaluatedWeight}%`, color: color.warning },
                                { label: "Estado", value: pendingCount === 0 ? "Completado" : "En curso", color: color.purple },
                            ].map(({ label, value, color: dot }, i, arr) => (
                                <div
                                    key={label}
                                    className={`flex-1 px-4 py-2.5 flex flex-col gap-1 ${i < arr.length - 1 ? "border-r border-edu-border-soft" : ""}`}
                                >
                                    <div className="text-[0.72rem] text-edu-ink-400 font-medium uppercase tracking-[0.05em]">{label}</div>
                                    <div className="inline-flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: dot }} />
                                        <span className="text-base font-bold text-edu-ink">{value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Presentación para inscribirse — cursos nuevos */
                        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
                            <div>
                                <p className="text-edu-ink font-semibold text-[0.95rem] m-0">¿Te interesa este curso?</p>
                                <p className="text-edu-ink-500 text-[0.8rem] mt-1 m-0 leading-[1.5]">
                                    Inscríbete para participar en las actividades y evaluaciones de este curso.
                                </p>
                            </div>
                            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-primary-hover">
                                Unirse al curso
                            </button>
                        </div>
                    )}
                </div>

                {/* Plan de evaluación */}
                <div className="col-span-3">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="m-0 text-edu-ink font-bold text-base">Plan de evaluación</h3>
                            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.8rem]">
                                {isEnrolled
                                    ? `${filteredEvaluations.length} de ${evaluations.length} evaluaciones · Peso total: 100%`
                                    : `${evaluations.length} evaluaciones · Peso total: 100%`}
                            </p>
                        </div>
                        {isEnrolled && (
                            <div className="flex gap-1.5">
                                {(["Todas", "Pendientes", "Calificadas"] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-[5px] rounded-[7px] border-[1.5px] text-[0.775rem] font-medium cursor-pointer ${filter === f ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-transparent text-edu-ink-500"}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {isEnrolled && filteredEvaluations.length === 0 ? (
                            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-10 text-center text-edu-ink-400 text-sm">
                                No hay evaluaciones {filter === "Pendientes" ? "pendientes" : "calificadas"}.
                            </div>
                        ) : (
                            (isEnrolled ? filteredEvaluations : evaluations).map((evaluation) => (
                                <EvaluationCard
                                    key={evaluation.id}
                                    evaluation={evaluation}
                                    defaultOpen={isEnrolled && (firstPending ? evaluation.id === firstPending.id : evaluation.id === evaluations[0].id)}
                                    preview={!isEnrolled}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Presentación del curso: imagen + descripción + docente */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col md:flex-row">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full md:w-[280px] h-[180px] md:h-auto object-cover bg-edu-subtle shrink-0"
                />
                <div className="p-[22px] flex flex-col gap-3 flex-1 min-w-0">
                    <div>
                        <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                            Sobre el curso
                        </p>
                        <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                            {course.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mt-auto pt-2 border-t border-edu-border-soft">
                        <div className="w-10 h-10 rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-[0.8rem] font-bold text-edu-primary shrink-0">
                            {initialsOf(course.teacher)}
                        </div>
                        <div>
                            <div className="text-[0.875rem] font-semibold text-edu-ink">{course.teacher}</div>
                            <div className="text-[0.75rem] text-edu-ink-400 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Profesor asignado
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
