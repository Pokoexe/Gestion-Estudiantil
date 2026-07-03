import { useNavigate } from "react-router";
import {
    GraduationCap,
    Hash,
    Mail,
    BarChart2,
    TrendingUp,
    TrendingDown,
    CalendarCheck,
    CalendarClock,
    Clock,
    ChevronRight,
    AlertTriangle,
    Star,
    Book,
} from "lucide-react";
import { color } from "../theme/tokens";

const STUDENT = {
    name: "Carlos Mendoza",
    initials: "CM",
    section: "4.º Año · Sección B",
    id: "V-30.123.456",
    email: "carlos.mendoza@edugestion.edu",
    term: "2026-I",
};

interface Stat {
    label: string;
    value: string;
    hint: string;
    icon: React.FC<{ className?: string }>;
    iconBg: string;
    iconFg: string;
    subjectId?: number; // si está, la tarjeta enlaza a la materia
}

const STATS: Stat[] = [
    { label: "Promedio de notas", value: "16,8", hint: "sobre 20 · buen rendimiento", icon: BarChart2, iconBg: "bg-edu-primary-100", iconFg: "text-edu-primary" },
    { label: "Mayor nota", value: "19", hint: "Física · Prof. Torres", icon: TrendingUp, iconBg: "bg-edu-success-bg", iconFg: "text-edu-success", subjectId: 1 },
    { label: "Menor nota", value: "8", hint: "Inglés · Prof. Collins", icon: TrendingDown, iconBg: "bg-edu-danger-bg", iconFg: "text-edu-danger", subjectId: 8 },
    { label: "Asistencia promedio", value: "92,4 %", hint: "2 inasistencias este lapso", icon: CalendarCheck, iconBg: "bg-edu-warning-bg", iconFg: "text-edu-warning-strong" },
];

interface ProximaEval {
    id: number;
    subjectId: number;
    subject: string;
    type: string;
    date: string;
    dot: string;
}

const PROXIMAS_EVAL: ProximaEval[] = [
    { id: 1, subjectId: 3, subject: "Matemática", type: "Examen parcial", date: "5 jul 2026", dot: color.primary },
    { id: 2, subjectId: 5, subject: "Química", type: "Informe de laboratorio", date: "7 jul 2026", dot: color.purple },
    { id: 3, subjectId: 4, subject: "Literatura", type: "Entrega de ensayo", date: "10 jul 2026", dot: color.success },
    { id: 4, subjectId: 7, subject: "Historia", type: "Exposición oral", date: "12 jul 2026", dot: color.danger },
];

type ReproStatus = "reprobado" | "por_reprobar";

interface MateriaRepro {
    id: number;
    subject: string;
    teacher: string;
    average: number;
    status: ReproStatus;
}

const MATERIAS_REPROBADAS: MateriaRepro[] = [
    { id: 8, subject: "Inglés", teacher: "Prof. Collins", average: 8, status: "reprobado" },
    { id: 7, subject: "Historia", teacher: "Prof. Flores", average: 10, status: "por_reprobar" },
];

const REPRO_META: Record<ReproStatus, { label: string; cls: string }> = {
    reprobado: { label: "Reprobado", cls: "bg-edu-danger-bg text-edu-danger" },
    por_reprobar: { label: "Por reprobar", cls: "bg-edu-danger-bg text-edu-danger" },
};

type Severity = "leve" | "grave" | "positiva";

interface Incidencia {
    id: number;
    type: string;
    detail: string;
    date: string;
    severity: Severity;
}

const SEVERITY_DOT: Record<Severity, string> = {
    leve: color.warningStrong,
    grave: color.danger,
    positiva: color.success,
};

const INCIDENCIAS: Incidencia[] = [
    { id: 1, type: "Reconocimiento por conducta", detail: "Mejor promedio de la sección", date: "20 jun 2026", severity: "positiva" },
    { id: 2, type: "Uso de celular en clase", detail: "Matemática · Prof. Ramírez", date: "3 jun 2026", severity: "leve" },
    { id: 3, type: "Inasistencia sin justificar", detail: "Falta del 18 de junio", date: "18 jun 2026", severity: "grave" },
    { id: 4, type: "Llegada tarde", detail: "Retraso de 15 min a primera hora", date: "12 may 2026", severity: "leve" },
];

interface Actividad {
    id: number;
    name: string;
    detail: string;
    date: string;
}

const ACTIVIDADES: Actividad[] = [
    { id: 1, name: "Ajedrez estratégico", detail: "Curso · Torneo interno", date: "ago 2026" },
    { id: 2, name: "Ecología y huerto escolar", detail: "Curso extracurricular", date: "jul 2026" },
    { id: 3, name: "Olimpiada de matemática", detail: "Representó a la sección", date: "jun 2026" },
    { id: 4, name: "Feria de ciencias", detail: "Actividad institucional", date: "may 2026" },
    { id: 5, name: "Jornada de reforestación", detail: "Voluntariado", date: "may 2026" },
];

const MAX_ITEMS = 5;

export function StudentDataPage() {
    const navigate = useNavigate();
    const incidencias = INCIDENCIAS.slice(0, MAX_ITEMS);
    const actividades = ACTIVIDADES.slice(0, MAX_ITEMS);
    const proximas = PROXIMAS_EVAL.slice(0, MAX_ITEMS);
    const reprobadas = MATERIAS_REPROBADAS.slice(0, MAX_ITEMS);

    return (
        <>
            {/* Perfil del estudiante */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-4 flex items-center gap-4 flex-wrap">
                <div className="w-[52px] h-[52px] rounded-full bg-edu-primary flex items-center justify-center text-white text-base font-bold shrink-0">
                    {STUDENT.initials}
                </div>
                <div className="min-w-0">
                    <div className="text-edu-ink font-bold text-[1.05rem] leading-tight">{STUDENT.name}</div>
                    <div className="text-edu-ink-500 text-[0.8rem] flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-edu-ink-400" />
                        {STUDENT.section}
                    </div>
                </div>
                <div className="w-px h-9 bg-edu-border-soft shrink-0 hidden sm:block" />
                <div className="flex gap-5 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[0.8rem] text-edu-ink-700">
                        <Hash className="w-3.5 h-3.5 text-edu-ink-400" />
                        {STUDENT.id}
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.8rem] text-edu-ink-700">
                        <Mail className="w-3.5 h-3.5 text-edu-ink-400" />
                        {STUDENT.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.8rem] text-edu-ink-700">
                        <CalendarCheck className="w-3.5 h-3.5 text-edu-ink-400" />
                        Período {STUDENT.term}
                    </div>
                </div>
            </div>

            {/* Indicadores generales */}
            <div className="grid grid-cols-4 gap-4">
                {STATS.map((s) => {
                    const Icon = s.icon;
                    const clickable = s.subjectId !== undefined;
                    const content = (
                        <>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                        {s.label}
                                    </p>
                                    <p className="text-edu-ink text-[1.4rem] font-bold mt-1">{s.value}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0 ${s.iconBg}`}>
                                    <Icon className={`w-5 h-5 ${s.iconFg}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                                <p className="text-edu-ink-400 text-xs m-0 truncate">{s.hint}</p>
                                {clickable && <ChevronRight className="w-3.5 h-3.5 text-edu-ink-300 shrink-0" />}
                            </div>
                        </>
                    );
                    return clickable ? (
                        <button
                            key={s.label}
                            onClick={() => navigate(`/estudiante/materias/${s.subjectId}`)}
                            className="text-left bg-edu-surface rounded-edu-card p-4 border border-edu-border-soft flex flex-col gap-2 cursor-pointer transition-colors hover:border-edu-primary-200"
                        >
                            {content}
                        </button>
                    ) : (
                        <div
                            key={s.label}
                            className="bg-edu-surface rounded-edu-card p-4 border border-edu-border-soft flex flex-col gap-2"
                        >
                            {content}
                        </div>
                    );
                })}
            </div>

            {/* Próximas evaluaciones y materias en riesgo */}
            <div className="grid grid-cols-2 gap-4">
                {/* Próximas evaluaciones */}
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-edu-primary" />
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Próximas evaluaciones</h3>
                        </div>
                        <span className="text-[0.72rem] text-edu-ink-400 font-medium">{proximas.length} próximas</span>
                    </div>
                    <div className="flex flex-col">
                        {proximas.map((ev, i) => (
                            <div
                                key={ev.id}
                                onClick={() => navigate(`/estudiante/materias/${ev.subjectId}`)}
                                className={`px-5 py-2.5 flex items-center gap-3 cursor-pointer transition-colors hover:bg-edu-subtle ${i < proximas.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ev.dot }} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.85rem] font-medium text-edu-ink truncate">{ev.subject}</div>
                                    <div className="text-[0.75rem] text-edu-ink-400 truncate">{ev.type}</div>
                                </div>
                                <span className="text-[0.72rem] text-edu-ink-400 shrink-0 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {ev.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                    {/* Materias reprobadas o en reprobación */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                        <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-edu-danger" />
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Materias reprobadas o en reprobación</h3>
                            </div>
                            <span className="text-[0.72rem] text-edu-danger font-medium">{reprobadas.length} en riesgo</span>
                        </div>
                        <div className="flex flex-col">
                            {reprobadas.map((m, i) => (
                                <div
                                    key={m.id}
                                    onClick={() => navigate(`/estudiante/materias/${m.id}`)}
                                    className={`px-5 py-2.5 flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-edu-subtle ${i < reprobadas.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.danger }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[0.85rem] font-medium text-edu-ink truncate">{m.subject}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400 truncate">{m.teacher}</div>
                                    </div>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0 ${REPRO_META[m.status].cls}`}>
                                        {REPRO_META[m.status].label}
                                    </span>
                                    <span className="text-[0.85rem] font-bold text-edu-danger shrink-0 w-6 text-right">{m.average}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incidencias */}
                    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                        <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-edu-warning-strong" />
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Incidencias</h3>
                            </div>
                            <span className="text-[0.72rem] text-edu-ink-400 font-medium">{incidencias.length} registros</span>
                        </div>
                        <div className="flex flex-col">
                            {incidencias.map((it, i) => (
                                <div
                                    key={it.id}
                                    className={`px-5 py-2.5 flex items-center gap-3 ${i < incidencias.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: SEVERITY_DOT[it.severity] }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[0.85rem] font-medium text-edu-ink truncate">{it.type}</div>
                                        <div className="text-[0.75rem] text-edu-ink-400 truncate">{it.detail}</div>
                                    </div>
                                    <span className="text-[0.72rem] text-edu-ink-400 shrink-0">{it.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Incidencias y actividades (máx. 5 ítems c/u) */}
            <div className="grid grid-cols-2 gap-4">
                {/* Cursos extracurriculares */}
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Book className="w-4 h-4 text-edu-success" />
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cursos extracurriculares</h3>
                        </div>
                        <span className="text-[0.72rem] text-edu-ink-400 font-medium">{actividades.length} participaciones</span>
                    </div>
                    <div className="flex flex-col">
                        {actividades.map((a, i) => (
                            <div
                                key={a.id}
                                className={`px-5 py-2.5 flex items-center gap-3 ${i < actividades.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="w-7 h-7 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                    <Book className="w-3.5 h-3.5 text-edu-success" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.85rem] font-medium text-edu-ink truncate">{a.name}</div>
                                    <div className="text-[0.75rem] text-edu-ink-400 truncate">{a.detail}</div>
                                </div>
                                <span className="text-[0.72rem] text-edu-ink-400 shrink-0">{a.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actividades extracurriculares */}
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
                    <div className="px-5 py-3.5 border-b border-edu-border-soft flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-edu-primary" />
                            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Actividades extracurriculares</h3>
                        </div>
                        <span className="text-[0.72rem] text-edu-ink-400 font-medium">{actividades.length} participaciones</span>
                    </div>
                    <div className="flex flex-col">
                        {actividades.map((a, i) => (
                            <div
                                key={a.id}
                                className={`px-5 py-2.5 flex items-center gap-3 ${i < actividades.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="w-7 h-7 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                    <Star className="w-3.5 h-3.5 text-edu-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.85rem] font-medium text-edu-ink truncate">{a.name}</div>
                                    <div className="text-[0.75rem] text-edu-ink-400 truncate">{a.detail}</div>
                                </div>
                                <span className="text-[0.72rem] text-edu-ink-400 shrink-0">{a.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
