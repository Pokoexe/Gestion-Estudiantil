import { useNavigate } from "react-router";
import { Pencil, PlusCircle, Search } from "lucide-react";
import { color } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";

interface Reparacion {
    id: string | number;
    courseId: string | number;
    subject: string;
    section: string;
    status: string;
    count?: number;
}

interface ReparacionesTableProps {
    filtered: Reparacion[];
    paged: Reparacion[];
    query: string;
    setQuery: (q: string) => void;
    setPage: (p: number) => void;
    totalPages: number;
    currentPage: number;
}

export function ReparacionesTable({ filtered, paged, query, setQuery, setPage, totalPages, currentPage }: ReparacionesTableProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Buscar por materia o sección…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_0.7fr] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                        {["Materia", "Sección", "Evaluaciones", "Estado", "Acción"].map((h) => (
                            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">No hay reparaciones que coincidan con la búsqueda.</div>
                    )}
                    {paged.map((r, i) => {
                        const creada = r.status === "creada";
                        return (
                            <div
                                key={r.id}
                                onClick={creada ? () => navigate(`/estudiante/reparacion/${r.courseId}`) : undefined}
                                className={`grid grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_0.7fr] px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${creada ? "cursor-pointer" : ""} ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: creada ? color.success : color.warningStrong }} />
                                    <span className="text-sm text-edu-ink font-medium">{r.subject}</span>
                                </div>
                                <span className="text-[0.8125rem] text-edu-ink-500">{r.section}</span>
                                <span className="text-sm text-edu-ink-700 font-semibold">{creada ? `${r.count} evaluaciones` : "—"}</span>
                                <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${creada ? "bg-edu-success-bg text-edu-success" : "bg-edu-warning-bg text-edu-warning"}`}>
                                    {creada ? "Creada" : "Por crear"}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/docente/reparaciones/${r.id}`);
                                    }}
                                    className="inline-flex items-center gap-1 text-[0.8rem] text-edu-primary font-semibold cursor-pointer w-fit bg-transparent border-none p-0"
                                >
                                    {creada ? <Pencil style={{ width: "13px", height: "13px" }} /> : <PlusCircle style={{ width: "13px", height: "13px" }} />}
                                    {creada ? "Modificar" : "Crear"}
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
    );
}
