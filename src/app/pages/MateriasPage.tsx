import { useState } from "react";
import { Award, TrendingDown, AlertCircle, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { color } from "../theme/tokens";

const SCHEDULE: {
    day: string;
    classes: { time: string; subject: string; teacher: string; color: string }[];
}[] = [
        {
            day: "Lun",
            classes: [
                {
                    time: "07:00",
                    subject: "Matemática",
                    teacher: "Prof. Ramírez",
                    color: "#dbeafe",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Mar",
            classes: [
                {
                    time: "07:00",
                    subject: "Literatura",
                    teacher: "Prof. García",
                    color: "#dcfce7",
                },
                {
                    time: "10:00",
                    subject: "Historia",
                    teacher: "Prof. Flores",
                    color: "#fce7f3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Mié",
            classes: [
                {
                    time: "08:00",
                    subject: "Química",
                    teacher: "Prof. Méndez",
                    color: "#ede9fe",
                },
                {
                    time: "11:00",
                    subject: "Matemática",
                    teacher: "Prof. Ramírez",
                    color: "#dbeafe",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Jue",
            classes: [
                {
                    time: "07:00",
                    subject: "Inglés",
                    teacher: "Prof. Collins",
                    color: "#ffedd5",
                },
                {
                    time: "09:00",
                    subject: "Biología",
                    teacher: "Prof. Ruiz",
                    color: "#dcfce7",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
        {
            day: "Vie",
            classes: [
                {
                    time: "08:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "10:00",
                    subject: "Arte",
                    teacher: "Prof. Vega",
                    color: "#fce7f3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
                {
                    time: "09:00",
                    subject: "Física",
                    teacher: "Prof. Torres",
                    color: "#fef9c3",
                },
            ],
        },
    ];

type SubjectStatus = "aprobado" | "reprobado" | "por_reprobar";

interface Subject {
    id: number;
    name: string;
    teacher: string;
    evaluations: number;
    attendance: string;
    average: number;
    rank: number; // posición del estudiante dentro de la materia
    failedEvals: number; // evaluaciones no aprobadas
    status: SubjectStatus;
    dot: string;
}

const SUBJECTS: Subject[] = [
    { id: 1, name: "Física", teacher: "Prof. Torres", evaluations: 8, attendance: "96 %", average: 19, rank: 1, failedEvals: 0, status: "aprobado", dot: color.warningStrong },
    { id: 2, name: "Biología", teacher: "Prof. Ruiz", evaluations: 6, attendance: "94 %", average: 17, rank: 3, failedEvals: 0, status: "aprobado", dot: color.success },
    { id: 3, name: "Matemática", teacher: "Prof. Ramírez", evaluations: 7, attendance: "92 %", average: 16, rank: 5, failedEvals: 0, status: "aprobado", dot: color.primary },
    { id: 4, name: "Literatura", teacher: "Prof. García", evaluations: 5, attendance: "90 %", average: 15, rank: 6, failedEvals: 0, status: "aprobado", dot: color.success },
    { id: 5, name: "Química", teacher: "Prof. Méndez", evaluations: 6, attendance: "88 %", average: 13, rank: 8, failedEvals: 1, status: "aprobado", dot: color.purple },
    { id: 6, name: "Arte", teacher: "Prof. Vega", evaluations: 4, attendance: "85 %", average: 12, rank: 10, failedEvals: 1, status: "aprobado", dot: color.purple },
    { id: 7, name: "Historia", teacher: "Prof. Flores", evaluations: 6, attendance: "78 %", average: 10, rank: 15, failedEvals: 2, status: "por_reprobar", dot: color.danger },
    { id: 8, name: "Inglés", teacher: "Prof. Collins", evaluations: 5, attendance: "70 %", average: 8, rank: 22, failedEvals: 4, status: "reprobado", dot: color.warning },
];

const STATUS_META: Record<SubjectStatus, { label: string; cls: string }> = {
    aprobado: { label: "Aprobado", cls: "bg-edu-success-bg text-edu-success" },
    reprobado: { label: "Reprobado", cls: "bg-edu-danger-bg text-edu-danger" },
    por_reprobar: { label: "Por reprobar", cls: "bg-edu-warning-bg text-edu-warning" },
};

const SUBJECT_COLS = "grid-cols-[1.4fr_1.3fr_1fr_1fr_1.1fr_1fr]";
const SUBJECT_HEADERS = ["Materia", "Profesor", "Evaluaciones", "Asistencia", "Estado", "Promedio"];



const SUBJECT_COLS_FAILS = "grid-cols-[1.4fr_1fr_1fr]";
const SUBJECT_HEADERS_FAILS = ["Materia", "Promedio", "Estado"];

export function MateriasPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const best = SUBJECTS.reduce((a, b) => (b.average > a.average ? b : a));
    const worst = SUBJECTS.reduce((a, b) => (b.average < a.average ? b : a));
    const failing = SUBJECTS.filter((s) => s.status !== "aprobado");

    const filteredSubjects = SUBJECTS.filter((s) =>
        !query.trim() ||
        s.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        s.teacher.toLowerCase().includes(query.trim().toLowerCase()),
    );

    const goToSubject = (id: number) => navigate(`/estudiante/materias/${id}`);

    return (
        <>
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    {/* Asistencia promedio */}
                    <div className="col-span-2 bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                    Promedio de Asistencia
                                </p>
                                <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                                    92,4 %
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-edu-warning-strong" />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-1.5 rounded-edu-pill ${i < 18 ? "bg-edu-primary" : "bg-edu-danger-bg"}`}
                                />
                            ))}
                        </div>
                        <p className="text-edu-ink-400 text-xs m-0">
                            2 inasistencias este lapso · Mínimo exigido: 75 %
                        </p>
                    </div>

                    {/* Materia con más promedio */}
                    <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                    Materia con más promedio
                                </p>
                                <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                                    {best.name}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                                <Award className="w-5 h-5 text-edu-success" />
                            </div>
                        </div>
                        <p className="text-edu-ink-700 text-[0.8rem] m-0">
                            Eres el estudiante n.º {best.rank} de la materia
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                            <p className="text-edu-ink-400 text-xs m-0">
                                {best.teacher}
                            </p>
                            <span className="font-semibold text-[0.8rem] px-2.5 py-[3px] rounded-[6px] text-white bg-edu-success shrink-0">
                                Promedio de {best.average}
                            </span>
                        </div>
                    </div>

                    {/* Materia con peor promedio */}
                    <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                    Materia con peor promedio
                                </p>
                                <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                                    {worst.name}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                                <TrendingDown className="w-5 h-5 text-edu-danger" />
                            </div>
                        </div>
                        <p className="text-edu-ink-700 text-[0.8rem] m-0">
                            No aprobaste {worst.failedEvals}{" "}
                            {worst.failedEvals === 1 ? "evaluación" : "evaluaciones"}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                            <p className="text-edu-ink-400 text-xs m-0">
                                {worst.teacher}
                            </p>
                            <span className="font-semibold text-[0.8rem] px-2.5 py-[3px] rounded-[6px] text-white bg-edu-danger shrink-0">
                                Promedio de {worst.average}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Materias reprobadas*/}
                <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                            Materias reprobadas
                        </h3>
                        <span className="text-[0.8rem] text-edu-danger font-medium">
                            {failing.length} en riesgo
                        </span>
                    </div>
                    <div>
                        <div className={`grid ${SUBJECT_COLS_FAILS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {SUBJECT_HEADERS_FAILS.map((h) => (
                                <span
                                    key={h}
                                    className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                                >
                                    {h}
                                </span>
                            ))}
                        </div>
                        {failing.map((s, i) => (
                            <div
                                key={s.id}
                                onClick={() => goToSubject(s.id)}
                                className={`grid ${SUBJECT_COLS_FAILS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < failing.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: color.danger }}
                                    />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">
                                        {s.name}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-danger font-semibold">
                                    {s.average}
                                </span>

                                <div className="flex items-center justify-between gap-1">
                                    <span className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit bg-edu-danger-bg text-edu-danger">
                                        {STATUS_META[s.status].label}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-edu-danger/50 shrink-0" />
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Todas las materias */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                        Todas las materias
                    </h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {filteredSubjects.length} materias
                    </span>
                </div>
                <div className="px-5 py-3 border-b border-edu-border-soft">
                    <div className="relative">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar materia o profesor…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                </div>
                <div>
                    <div className={`grid ${SUBJECT_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {SUBJECT_HEADERS.map((h) => (
                            <span
                                key={h}
                                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                    {filteredSubjects.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay materias que coincidan con la búsqueda.
                        </div>
                    )}
                    {filteredSubjects.map((s, i) => {
                        const st = STATUS_META[s.status];
                        return (
                            <div
                                key={s.id}
                                onClick={() => goToSubject(s.id)}
                                className={`grid ${SUBJECT_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < filteredSubjects.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: s.dot }}
                                    />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">
                                        {s.name}
                                    </span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {s.teacher}
                                </span>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {s.evaluations}
                                </span>
                                <span className="text-[0.875rem] text-edu-ink-700">
                                    {s.attendance}
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}
                                >
                                    {st.label}
                                </span>
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-[0.875rem] text-edu-ink font-semibold">
                                        {s.average}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
