import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, BookOpen, CalendarClock, ChevronRight, Wrench } from "lucide-react";
import { color } from "../theme/tokens";
import { Pagination } from "../components/Pagination";

const PER_PAGE = 5;

type PendingStatus = "reparacion" | "espera";
type StatusFilter = "todas" | PendingStatus;

interface PendingSubject {
    id: number;
    name: string;
    year: string;
    average: number;
    status: PendingStatus;
    repairDate?: string;
}

const PENDING_SUBJECTS: PendingSubject[] = [
    { id: 1, name: "Inglés", year: "2022–2023", average: 8, status: "reparacion", repairDate: "15 Jul 2026" },
    { id: 2, name: "Historia", year: "2022–2023", average: 10, status: "reparacion", repairDate: "18 Jul 2026" },
    { id: 3, name: "Geografía", year: "2021–2022", average: 9, status: "espera" },
    { id: 4, name: "Química", year: "2021–2022", average: 7, status: "espera" },
    { id: 5, name: "Arte", year: "2020–2021", average: 6, status: "espera" },
    { id: 6, name: "Educación Física", year: "2020–2021", average: 11, status: "espera" },
    { id: 7, name: "Matemática", year: "2023–2024", average: 9, status: "reparacion", repairDate: "20 Jul 2026" },
];

const STATUS_META: Record<PendingStatus, { label: string; cls: string; dot: string }> = {
    reparacion: { label: "En reparación", cls: "bg-edu-primary-50 text-edu-primary", dot: color.primary },
    espera: { label: "En espera", cls: "bg-edu-warning-bg text-edu-warning", dot: color.warningStrong },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "todas", label: "Todos los estados" },
    { value: "reparacion", label: "En reparación" },
    { value: "espera", label: "En espera" },
];

const COLS = "grid-cols-[1.6fr_1.1fr_1fr_1.4fr_0.8fr]";
const HEADERS = ["Materia", "Año escolar", "Promedio", "Estado", ""];

export function MateriasPendientesPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
    const [page, setPage] = useState(1);

    const totalPendientes = PENDING_SUBJECTS.length;
    const proximaReparacion = PENDING_SUBJECTS
        .filter((s) => s.status === "reparacion" && s.repairDate)
        .sort((a, b) => a.repairDate!.localeCompare(b.repairDate!))[0]?.repairDate ?? "—";

    const rows = PENDING_SUBJECTS.filter((s) => {
        if (statusFilter !== "todas" && s.status !== statusFilter) return false;
        if (
            query.trim() &&
            !s.name.toLowerCase().includes(query.trim().toLowerCase()) &&
            !s.year.toLowerCase().includes(query.trim().toLowerCase())
        ) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = rows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <>
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Materias pendientes
                            </p>
                            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                                {totalPendientes}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-edu-danger" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">
                        Materias reprobadas de años anteriores sin aprobar
                    </p>
                </div>

                <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                                Próxima fecha de reparación
                            </p>
                            <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                                {proximaReparacion}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                            <CalendarClock className="w-5 h-5 text-edu-primary" />
                        </div>
                    </div>
                    <p className="text-edu-ink-400 text-xs m-0">
                        Fecha más cercana de reparación programada
                    </p>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                {/* Encabezado + buscador */}
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                        Materias Pendientes
                    </h3>
                    <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                        {rows.length} {rows.length === 1 ? "materia" : "materias"}
                    </span>
                </div>

                <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar materia o año escolar…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
                        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                    >
                        {FILTER_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                {/* Cabecera */}
                <div>
                    <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {HEADERS.map((h, i) => (
                            <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                                {h}
                            </span>
                        ))}
                    </div>

                    {rows.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            No hay materias que coincidan con el filtro.
                        </div>
                    )}

                    {paged.map((s, i) => {
                        const meta = STATUS_META[s.status];
                        return (
                            <div
                                key={s.id}
                                onClick={() => s.status === "reparacion" && navigate("/estudiante/reparacion")}
                                className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${s.status === "reparacion" ? "cursor-pointer" : ""} ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                    <span className="text-[0.875rem] text-edu-ink font-medium">{s.name}</span>
                                </div>
                                <span className="text-[0.875rem] text-edu-ink-700">{s.year}</span>
                                <span className="text-[0.875rem] font-semibold text-edu-danger">{s.average}</span>
                                <div className="flex flex-col gap-0.5 items-start">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${meta.cls}`}>
                                        {s.status === "reparacion" && <Wrench className="w-3 h-3" />}
                                        {meta.label}
                                    </span>
                                    {s.status === "reparacion" && s.repairDate && (
                                        <span className="text-[0.68rem] text-edu-ink-400 pl-0.5">
                                            {s.repairDate}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <ChevronRight className="w-4 h-4 text-edu-ink-300 shrink-0" />
                                </div>
                            </div>
                        );
                    })}

                    {totalPages > 1 && (
                        <div className="px-5 py-4 border-t border-edu-border-soft">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
