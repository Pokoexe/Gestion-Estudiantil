import { useState } from "react";
import { Award, TrendingDown, AlertCircle, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { color } from "../theme/tokens";
import { useFetch } from "../datos_maquetados";
import { getMaterias, type SubjectStatus } from "../datos_maquetados/actions/estudiante";
import { Pagination } from "../components/Pagination";

const PER_PAGE = 6;

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
    const [page, setPage] = useState(1);
    const { data: subjects, loading } = useFetch(getMaterias, []);

    const best = subjects.length ? subjects.reduce((a, b) => (b.average > a.average ? b : a)) : undefined;
    const worst = subjects.length ? subjects.reduce((a, b) => (b.average < a.average ? b : a)) : undefined;
    const failing = subjects.filter((s) => s.status !== "aprobado");

    const filteredSubjects = subjects.filter((s) =>
        !query.trim() ||
        s.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        s.teacher.toLowerCase().includes(query.trim().toLowerCase()),
    );

    const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pagedSubjects = filteredSubjects.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const goToSubject = (id: number) => navigate(`/estudiante/materias/${id}`);

    if (loading) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando materias…
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Asistencia promedio */}
                    <div className="col-span-1 sm:col-span-2 bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
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
                    <button type="button" onClick={() => best && goToSubject(best.id)} className="text-left bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                    Materia con más promedio
                                </p>
                                <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                                    {best?.name}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control bg-edu-success-bg flex items-center justify-center shrink-0">
                                <Award className="w-5 h-5 text-edu-success" />
                            </div>
                        </div>
                        <p className="text-edu-ink-700 text-[0.8rem] m-0">
                            Eres el estudiante n.º {best?.rank} de la materia
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                            <p className="text-edu-ink-400 text-xs m-0">
                                {best?.teacher}
                            </p>
                            <span className="font-semibold text-[0.8rem] px-2.5 py-[3px] rounded-[6px] text-white bg-edu-success shrink-0">
                                Promedio de {best?.average}
                            </span>
                        </div>
                    </button>

                    {/* Materia con peor promedio */}
                    <button type="button" onClick={() => worst && goToSubject(worst.id)} className="text-left bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5 cursor-pointer transition-colors hover:border-edu-primary-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                    Materia con peor promedio
                                </p>
                                <p className="text-edu-ink text-[1.1rem] font-bold mt-1">
                                    {worst?.name}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                                <TrendingDown className="w-5 h-5 text-edu-danger" />
                            </div>
                        </div>
                        <p className="text-edu-ink-700 text-[0.8rem] m-0">
                            No aprobaste {worst?.failedEvals}{" "}
                            {worst?.failedEvals === 1 ? "evaluación" : "evaluaciones"}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                            <p className="text-edu-ink-400 text-xs m-0">
                                {worst?.teacher}
                            </p>
                            <span className="font-semibold text-[0.8rem] px-2.5 py-[3px] rounded-[6px] text-white bg-edu-danger shrink-0">
                                Promedio de {worst?.average}
                            </span>
                        </div>
                    </button>
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
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar materia o profesor…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="min-w-[720px]">
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
                    {pagedSubjects.map((s, i) => {
                        const st = STATUS_META[s.status];
                        return (
                            <div
                                key={s.id}
                                onClick={() => goToSubject(s.id)}
                                className={`grid ${SUBJECT_COLS} px-5 py-[13px] items-center cursor-pointer transition-colors hover:bg-edu-subtle ${i < pagedSubjects.length - 1 ? "border-b border-edu-border-soft" : ""}`}
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
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </>
    );
}
