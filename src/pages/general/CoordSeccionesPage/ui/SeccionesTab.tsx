import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { Seccion } from "@shared/services/actions/coordinador";

interface Props {
    filteredSec: Seccion[];
    secPaged: Seccion[];
    secQuery: string;
    setSecQuery: (q: string) => void;
    setSecPage: (p: number) => void;
    secCurrentPage: number;
    secTotalPages: number;
    SEC_COLS: string;
    SEC_HEADERS: string[];
    openAddSec: () => void;
    openEditSec: (s: Seccion) => void;
    setConfirmDelSec: (s: Seccion) => void;
}

export function SeccionesTab({
    filteredSec,
    secPaged,
    secQuery,
    setSecQuery,
    setSecPage,
    secCurrentPage,
    secTotalPages,
    SEC_COLS,
    SEC_HEADERS,
    openAddSec,
    openEditSec,
    setConfirmDelSec,
}: Props) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Secciones registradas</h3>
                <button onClick={openAddSec} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                    <Plus style={{ width: 14, height: 14 }} /> Agregar sección
                </button>
            </div>

            {/* Buscador */}
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={secQuery}
                        onChange={(e) => { setSecQuery(e.target.value); setSecPage(1); }}
                        placeholder="Buscar por año, sección o tutor…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                    <div className={`grid ${SEC_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                        {SEC_HEADERS.map((h, i) => (
                            <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                        ))}
                    </div>
                    {filteredSec.length === 0 ? (
                        <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">No hay secciones que coincidan con la búsqueda.</p>
                    ) : secPaged.map((s, i) => (
                        <div key={s.id} className={`grid ${SEC_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < secPaged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                            <span className="text-sm text-edu-ink font-semibold">{s.anio}</span>
                            <span className="text-[0.8125rem] text-edu-ink-700">{s.seccion}</span>
                            <span className="text-[0.8125rem] text-edu-ink-500">{s.cupo}</span>
                            <span className="text-[0.8125rem] text-edu-ink-700">{s.tutor}</span>
                            <div className="flex items-center gap-3">
                                <button onClick={() => openEditSec(s)} aria-label="Modificar sección" className="text-edu-ink-400 hover:text-edu-purple bg-transparent border-none cursor-pointer p-0 flex items-center">
                                    <Pencil style={{ width: 15, height: 15 }} />
                                </button>
                                <button onClick={() => setConfirmDelSec(s)} aria-label="Eliminar sección" className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center">
                                    <Trash2 style={{ width: 15, height: 15 }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {secTotalPages > 1 && (
                <div className="px-5 py-4 border-t border-edu-border-soft">
                    <Pagination currentPage={secCurrentPage} totalPages={secTotalPages} onPageChange={setSecPage} />
                </div>
            )}
        </div>
    );
}
