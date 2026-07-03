import { useState } from "react";
import { useParams, Link } from "react-router";
import {
    Phone,
    Mail,
    ChevronDown,
    ChevronUp,
    Download,
    Clock,
    ListChecks,
    Presentation,
    FileText,
    FlaskConical,
    PenLine,
    Wrench,
    MessageCircle,
} from "lucide-react";
import { color } from "../theme/tokens";

interface Topic {
    id: number;
    text: string;
}

interface Assignment {
    id: number;
    title: string;
    type: "presentation" | "exam" | "lab" | "essay";
    dueDate: string;
    weight: string;
    status: "pending" | "submitted" | "graded";
    grade?: string;
    description?: string;
    duration?: string;
    topics?: Topic[];
    hasAttachment?: boolean;
    attachmentName?: string;
}

type EtapaStatus = "passed" | "failed" | "in_progress" | "pending";

interface Etapa {
    order: number;
    status: EtapaStatus;
    room: string;
    schedule: string;
    term: string;
    finalAverage?: string;
    assignments: Assignment[];
}

interface RepairSubject {
    name: string;
    code: string;
    section: string;
    teacher: { name: string; title: string; phone: string; email: string; initials: string };
    etapas: Etapa[];
}

const REPAIR_SUBJECTS: Record<string, RepairSubject> = {
    "11": {
        name: "Química",
        code: "QUI-401",
        section: "Sección B",
        teacher: {
            name: "Prof. Ricardo Méndez",
            title: "Docente titular de Química",
            phone: "+58 412-555-0177",
            email: "r.mendez@edugestion.edu",
            initials: "RM",
        },
        etapas: [
            {
                order: 1,
                status: "failed",
                room: "Lab 102",
                schedule: "Lun / Mié · 07:00 – 08:30",
                term: "2026-I",
                finalAverage: "8",
                assignments: [
                    { id: 1, title: "Exposición sobre enlaces químicos", type: "presentation", dueDate: "5 may 2026", weight: "20%", status: "graded", grade: "9" },
                    { id: 2, title: "Examen escrito · Unidad 2", type: "exam", dueDate: "12 may 2026", weight: "30%", status: "graded", grade: "8", description: "Examen a libro cerrado sobre estequiometría y enlaces." },
                    { id: 3, title: "Informe de laboratorio · Reacciones", type: "lab", dueDate: "19 may 2026", weight: "25%", status: "graded", grade: "10" },
                    { id: 4, title: "Ensayo sobre química ambiental", type: "essay", dueDate: "26 may 2026", weight: "25%", status: "graded", grade: "7" },
                ],
            },
            {
                order: 2,
                status: "in_progress",
                room: "Lab 104",
                schedule: "Mar / Jue · 09:00 – 10:30",
                term: "2026-I",
                assignments: [
                    { id: 1, title: "Taller práctico de laboratorio", type: "lab", dueDate: "1 jul 2026", weight: "25%", status: "graded", grade: "14", description: "Práctica supervisada para reforzar los procedimientos evaluados." },
                    { id: 2, title: "Prueba corta de repaso", type: "exam", dueDate: "3 jul 2026", weight: "15%", status: "graded", grade: "13" },
                    {
                        id: 3,
                        title: "Examen parcial de recuperación",
                        type: "exam",
                        dueDate: "8 jul 2026",
                        weight: "30%",
                        status: "pending",
                        description: "Examen escrito que evalúa los contenidos no aprobados de la etapa anterior.",
                        duration: "90 minutos",
                        topics: [
                            { id: 1, text: "Estequiometría y balanceo de ecuaciones" },
                            { id: 2, text: "Tipos de enlaces y propiedades" },
                        ],
                        hasAttachment: true,
                        attachmentName: "Guia_Recuperacion.pdf",
                    },
                    { id: 4, title: "Exposición final del taller", type: "presentation", dueDate: "10 jul 2026", weight: "30%", status: "pending" },
                ],
            },
            {
                order: 3,
                status: "pending",
                room: "Lab 102",
                schedule: "Vie · 07:00 – 10:00",
                term: "2026-II",
                assignments: [
                    { id: 1, title: "Diagnóstico inicial", type: "exam", dueDate: "Por definir", weight: "10%", status: "pending" },
                    { id: 2, title: "Taller de refuerzo", type: "lab", dueDate: "Por definir", weight: "25%", status: "pending" },
                    { id: 3, title: "Proyecto integrador", type: "essay", dueDate: "Por definir", weight: "25%", status: "pending" },
                    { id: 4, title: "Examen final", type: "exam", dueDate: "Por definir", weight: "40%", status: "pending" },
                ],
            },
        ],
    },
    "12": {
        name: "Matemática",
        code: "MAT-401",
        section: "Sección B",
        teacher: {
            name: "Prof. Ana Ramírez",
            title: "Docente titular de Matemática",
            phone: "+58 412-555-0104",
            email: "a.ramirez@edugestion.edu",
            initials: "AR",
        },
        etapas: [
            {
                order: 1,
                status: "failed",
                room: "Aula 210",
                schedule: "Lun / Mié · 10:00 – 11:30",
                term: "2026-I",
                finalAverage: "8",
                assignments: [
                    { id: 1, title: "Examen de álgebra", type: "exam", dueDate: "6 may 2026", weight: "30%", status: "graded", grade: "8" },
                    { id: 2, title: "Taller de factorización", type: "lab", dueDate: "13 may 2026", weight: "25%", status: "graded", grade: "9" },
                    { id: 3, title: "Prueba corta de ecuaciones", type: "exam", dueDate: "20 may 2026", weight: "20%", status: "graded", grade: "10" },
                    { id: 4, title: "Proyecto de aplicación", type: "essay", dueDate: "27 may 2026", weight: "25%", status: "graded", grade: "7" },
                ],
            },
            {
                order: 2,
                status: "in_progress",
                room: "Aula 208",
                schedule: "Mar / Jue · 07:00 – 08:30",
                term: "2026-I",
                assignments: [
                    { id: 1, title: "Examen de funciones", type: "exam", dueDate: "2 jul 2026", weight: "25%", status: "graded", grade: "12" },
                    {
                        id: 2,
                        title: "Taller de límites y derivadas",
                        type: "lab",
                        dueDate: "9 jul 2026",
                        weight: "25%",
                        status: "pending",
                        description: "Serie de ejercicios guiados sobre los temas con menor rendimiento.",
                        hasAttachment: true,
                        attachmentName: "Guia_Limites_Derivadas.pdf",
                    },
                    { id: 3, title: "Prueba corta de repaso", type: "exam", dueDate: "14 jul 2026", weight: "10%", status: "pending" },
                    { id: 4, title: "Examen de recuperación final", type: "exam", dueDate: "17 jul 2026", weight: "40%", status: "pending", description: "Evaluación final que integra todo el plan de reparación.", duration: "120 minutos" },
                ],
            },
        ],
    },
};

const DEFAULT_SUBJECT_ID = "11";

const TYPE_META: Record<Assignment["type"], { icon: React.FC<{ style?: React.CSSProperties }>, bg: string, color: string, label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};

const STATUS_META: Record<Assignment["status"], { bg: string; color: string; label: string }> = {
    pending: { bg: color.warningBg, color: color.warning, label: "Pendiente" },
    submitted: { bg: color.primary100, color: color.primary, label: "Entregada" },
    graded: { bg: color.successBg, color: color.success, label: "Calificada" },
};

const ETAPA_META: Record<EtapaStatus, { label: string; dot: string }> = {
    passed: { label: "Aprobada", dot: color.success },
    failed: { label: "Reprobada", dot: color.danger },
    in_progress: { label: "En curso", dot: color.primary },
    pending: { label: "Pendiente", dot: color.ink400 },
};

function AssignmentCard({ assignment, defaultOpen }: { assignment: Assignment; defaultOpen: boolean }) {
    const [expanded, setExpanded] = useState(defaultOpen);
    const typeMeta = TYPE_META[assignment.type];
    const statusMeta = STATUS_META[assignment.status];
    const TypeIcon = typeMeta.icon;

    return (
        <div
            className={`bg-edu-surface rounded-xl overflow-hidden transition-colors ${expanded ? "border-[1.5px] border-edu-primary-200" : "border border-edu-border-soft"}`}
        >
            {/* Encabezado de la tarjeta */}
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
                        <span className="text-[0.9rem] font-semibold text-edu-ink">{assignment.title}</span>
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
                            {assignment.dueDate}
                        </span>
                        <span className="text-[0.775rem] text-edu-ink-500">Peso: <strong className="text-edu-ink-700">{assignment.weight}</strong></span>
                        {assignment.status === "graded" && (
                            <span className="text-[0.775rem] text-edu-success font-semibold">
                                Nota: {assignment.grade}/20
                            </span>
                        )}
                    </div>
                </div>

                <span
                    className="text-[0.7rem] font-semibold px-2.5 py-[3px] rounded-edu-pill shrink-0"
                    style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
                >
                    {statusMeta.label}
                </span>

                <div className="text-edu-ink-400 shrink-0">
                    {expanded ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
                </div>
            </button>

            {/* Detalle expandido */}
            {expanded && (
                <div className="border-t border-edu-border-soft px-[18px] py-5 bg-edu-tint flex flex-col gap-4">
                    {assignment.description && (
                        <div>
                            <p className="text-[0.78rem] font-semibold text-edu-ink-500 uppercase tracking-[0.05em] m-0 mb-1.5">
                                Instrucciones
                            </p>
                            <p className="text-sm text-edu-ink-700 leading-[1.65] m-0">
                                {assignment.description}
                            </p>
                        </div>
                    )}

                    {assignment.duration && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-edu-chip bg-edu-border-soft flex items-center justify-center">
                                <Clock style={{ width: "15px", height: "15px" }} className="text-edu-ink-500" />
                            </div>
                            <div>
                                <div className="text-[0.7rem] text-edu-ink-400 font-medium">Duración requerida</div>
                                <div className="text-sm text-edu-ink font-semibold">{assignment.duration}</div>
                            </div>
                        </div>
                    )}

                    {assignment.topics && assignment.topics.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <ListChecks style={{ width: "15px", height: "15px" }} className="text-edu-primary" />
                                <p className="text-[0.78rem] font-semibold text-edu-ink-700 m-0">
                                    Temas requeridos ({assignment.topics.length})
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {assignment.topics.map((topic) => (
                                    <div
                                        key={topic.id}
                                        className="flex items-start gap-2.5 px-3.5 py-2.5 bg-edu-primary-50 rounded-edu-chip border border-edu-primary-100"
                                    >
                                        <div className="w-[22px] h-[22px] rounded-full bg-edu-primary text-white flex items-center justify-center text-[0.7rem] font-bold shrink-0 mt-px">
                                            {topic.id}
                                        </div>
                                        <span className="text-sm text-[#1e3a5f] leading-[1.5]">{topic.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {assignment.hasAttachment && (
                        <div className="pt-1">
                            <button className="w-full inline-flex items-center gap-2 px-[18px] py-[9px] rounded-[9px] border-[1.5px] border-edu-success-200 bg-edu-success-bg text-edu-success text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-success-100">
                                <Download style={{ width: "15px", height: "15px" }} />
                                Descargar prueba adjunta
                                {assignment.attachmentName && (
                                    <span className="text-xs text-edu-ink-500 font-normal">
                                        · {assignment.attachmentName}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function RepairCoursePage() {
    const { id } = useParams();
    const subject = REPAIR_SUBJECTS[id ?? ""] ?? REPAIR_SUBJECTS[DEFAULT_SUBJECT_ID];

    const initialIdx = Math.max(0, subject.etapas.findIndex((e) => e.status === "in_progress"));
    const [activeIdx, setActiveIdx] = useState(initialIdx);
    const [filter, setFilter] = useState<"Todas" | "Pendientes" | "Calificadas">("Todas");

    const etapa = subject.etapas[activeIdx];
    const pendingCount = etapa.assignments.filter((a) => a.status === "pending").length;
    const gradedCount = etapa.assignments.filter((a) => a.status === "graded").length;
    const firstPending = etapa.assignments.find((a) => a.status === "pending");
    const filteredAssignments = etapa.assignments.filter((a) =>
        filter === "Todas" ? true : filter === "Calificadas" ? a.status === "graded" : a.status !== "graded",
    );

    return (
        <div className="flex flex-col gap-5">
            {/* Pestañas de etapa */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-edu-primary" />
                    <span className="text-[0.72rem] text-edu-ink-500 font-semibold uppercase tracking-[0.06em]">
                        Etapas de reparación · {subject.name}
                    </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {subject.etapas.map((e, i) => {
                        const meta = ETAPA_META[e.status];
                        const isActive = i === activeIdx;
                        return (
                            <button
                                key={e.order}
                                onClick={() => setActiveIdx(i)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-edu-control border-[1.5px] text-sm font-semibold cursor-pointer transition-colors ${isActive ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-edu-surface text-edu-ink-500 hover:border-edu-primary-200"}`}
                            >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                Etapa {e.order}
                                <span className="text-[0.7rem] font-medium" style={{ color: meta.dot }}>
                                    · {meta.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-5">

                <div className="col-span-2 space-y-2">
                    {/* Banner de la etapa */}
                    <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Wrench style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                        <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                            {subject.code} · {subject.section} · Etapa {etapa.order} de {subject.etapas.length}
                        </span>
                    </div>
                    <h2 className="text-white mb-1.5 text-xl font-bold m-0">{subject.name}</h2>
                    <div className="flex gap-4 flex-wrap">
                        {[etapa.schedule, etapa.room, `Período ${etapa.term}`].map((item) => (
                            <span key={item} className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{item}</span>
                        ))}

                        <Link to="/estudiante/mensajes" className="h-7 rounded-[7px] bg-edu-success-bg flex items-center gap-2 justify-center w-full">
                            <MessageCircle style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                            <span className="text-[0.8rem] text-edu-success">Chat grupal de la materia</span>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center gap-3 w-full">
                    {[
                        { label: "Pendientes", value: pendingCount },
                        { label: "Calificadas", value: gradedCount },
                    ].map(({ label, value }) => (
                        <div key={label} className=" w-full bg-[rgba(255,255,255,0.15)] rounded-edu-control px-[18px] py-2.5 text-center">
                            <div className="text-[1.3rem] font-bold text-white">{value}</div>
                            <div className="text-[0.72rem] text-[rgba(255,255,255,0.75)] mt-px">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

                    {/* Resumen de la etapa */}
                    <div className="grid grid-cols-2 bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-4 gap-0">
                        {[
                            { label: "Completadas", value: `${gradedCount}/${etapa.assignments.length}`, color: color.success },
                            { label: "Promedio de la etapa", value: etapa.finalAverage ? `${etapa.finalAverage}/20` : "En curso", color: color.primary },
                            { label: "Estado de la etapa", value: ETAPA_META[etapa.status].label, color: ETAPA_META[etapa.status].dot },
                            { label: "Etapa", value: `${etapa.order} de ${subject.etapas.length}`, color: color.purple },
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

                    {/* Datos del docente */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-[22px] py-[18px] flex items-center gap-4 flex-wrap">
                <div className="w-[52px] h-[52px] rounded-full bg-edu-primary-50 border-2 border-edu-primary-100 flex items-center justify-center text-base font-bold text-edu-primary shrink-0">
                    {subject.teacher.initials}
                </div>

                <div className="flex-1 min-w-[160px]">
                    <div className="text-[0.9375rem] font-bold text-edu-ink">{subject.teacher.name}</div>
                    <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{subject.teacher.title}</div>
                </div>

                <div className="w-px h-10 bg-edu-border-soft shrink-0" />

                <div className="flex flex-col gap-1.5">
                    <a
                        href={`tel:${subject.teacher.phone}`}
                        className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
                    >
                        <div className="w-7 h-7 rounded-[7px] bg-edu-success-bg flex items-center justify-center">
                            <Phone style={{ width: "13px", height: "13px" }} className="text-edu-success" />
                        </div>
                        <span className="font-medium">{subject.teacher.phone}</span>
                    </a>
                    <a
                        href={`mailto:${subject.teacher.email}`}
                        className="flex items-center gap-2 text-edu-ink-700 no-underline text-sm"
                    >
                        <div className="w-7 h-7 rounded-[7px] bg-edu-primary-50 flex items-center justify-center">
                            <Mail style={{ width: "13px", height: "13px" }} className="text-edu-primary" />
                        </div>
                        <span className="font-medium">{subject.teacher.email}</span>
                    </a>
                </div>
                    </div>
                </div>

                {/* Plan de evaluación de la etapa */}
                <div className="col-span-3">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="m-0 text-edu-ink font-bold text-base">Plan de evaluación · Etapa {etapa.order}</h3>
                            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.8rem]">
                                {filteredAssignments.length} de {etapa.assignments.length} evaluaciones · Peso total: 100%
                            </p>
                        </div>
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
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {filteredAssignments.length === 0 ? (
                            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-10 text-center text-edu-ink-400 text-sm">
                                No hay evaluaciones {filter === "Pendientes" ? "pendientes" : "calificadas"} en esta etapa.
                            </div>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <AssignmentCard
                                    key={`${activeIdx}-${assignment.id}`}
                                    assignment={assignment}
                                    defaultOpen={firstPending ? assignment.id === firstPending.id : assignment.id === etapa.assignments[0].id}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
