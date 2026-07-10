import { Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { STATUS_META } from "../functions/useDocenteCursos";
import type { CursoStatus } from "@shared/services/actions/docente-eval";

interface CursosTableProps {
    filtered: any[];
    paged: any[];
    query: string;
    setQuery: (v: string) => void;
    statusFilter: "todos" | CursoStatus;
    setStatusFilter: (v: "todos" | CursoStatus) => void;
    setPage: (v: number) => void;
    currentPage: number;
    totalPages: number;
    navigate: (path: string) => void;
}

export function CursosTable({
    filtered,
    paged,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    setPage,
    currentPage,
    totalPages,
    navigate,
}: CursosTableProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Cursos</h3>
                <span className="text-[0.8rem] text-edu-ink-400 font-medium">
                    {filtered.length} curso{filtered.length === 1 ? "" : "s"}
                </span>
            </div>
            <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por nombre o código…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="aceptado">Aceptados</option>
                    <option value="solicitado">Solicitados</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className="grid grid-cols-[1.8fr_0.8fr_1.3fr_0.9fr_0.8fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                        {["Curso", "Código", "Horario", "Inscritos", "Estado"].map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay cursos que coincidan con el filtro.</div>
                    )}
                    {paged.map((curso, i) => {
                        const st = STATUS_META[curso.status];
                        return (
                            <div
                                key={curso.id}
                                onClick={() => navigate(`/docente/cursos/${curso.id}`)}
                                className={`grid grid-cols-[1.8fr_0.8fr_1.3fr_0.9fr_0.8fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle cursor-pointer ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <span className="text-sm text-edu-ink font-medium">{curso.title}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500 font-mono">{curso.code}</span>
                                <span className="text-[0.8125rem] text-edu-ink-500">{curso.schedule}</span>
                                <span className="text-sm text-edu-ink-700 font-semibold">{curso.enrolledCount} / {curso.totalSpots}</span>
                                <span
                                    className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit"
                                    style={{ backgroundColor: st.bg, color: st.fg }}
                                >
                                    {st.label}
                                </span>
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
    );
}
