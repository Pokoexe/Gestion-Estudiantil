import { Plus, BookOpen, Pencil, Trash2, Search } from "lucide-react";
import { accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import type { Materia, Nivel } from "@shared/services/actions/coordinador";

interface Props {
    filteredMat: Materia[];
    matPaged: Materia[];
    matQuery: string;
    setMatQuery: (q: string) => void;
    setMatPage: (p: number) => void;
    matCurrentPage: number;
    matTotalPages: number;
    MAT_COLS: string;
    MAT_HEADERS: string[];
    NIVEL_META: Record<Nivel, { cls: string }>;
    PER_PAGE: number;
    openAddMat: () => void;
    openEditMat: (m: Materia) => void;
    setConfirmDelMat: (m: Materia) => void;
}

export function MateriasTab({
    filteredMat,
    matPaged,
    matQuery,
    setMatQuery,
    setMatPage,
    matCurrentPage,
    matTotalPages,
    MAT_COLS,
    MAT_HEADERS,
    NIVEL_META,
    PER_PAGE,
    openAddMat,
    openEditMat,
    setConfirmDelMat,
}: Props) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                {/* Título + contador (el contador va aquí solo en móvil) */}
                <div className="flex items-center justify-between gap-3">
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Materias del plan de estudios</h3>
                    <span className="md:hidden text-[0.8rem] text-edu-ink-400 font-medium">{filteredMat.length} materia{filteredMat.length === 1 ? "" : "s"}</span>
                </div>

                {/* Contador (solo desktop) + botón (w-full en móvil) */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="hidden md:inline text-[0.8rem] text-edu-ink-400 font-medium">{filteredMat.length} materia{filteredMat.length === 1 ? "" : "s"}</span>
                    <button onClick={openAddMat} className="w-full md:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-edu-control text-[0.8rem] font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                        <Plus style={{ width: 14, height: 14 }} /> Agregar materia
                    </button>
                </div>
            </div>

            {/* Buscador */}
            <div className="px-5 py-3 border-b border-edu-border-soft">
                <div className="relative">
                    <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={matQuery}
                        onChange={(e) => { setMatQuery(e.target.value); setMatPage(1); }}
                        placeholder="Buscar materia…"
                        className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div>
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className={`grid ${MAT_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {MAT_HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>
                        {filteredMat.length === 0 ? (
                            <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">No hay materias que coincidan con la búsqueda.</p>
                        ) : (
                            matPaged.map((m, i) => (
                                <div key={m.id} className={`grid ${MAT_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < matPaged.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                                    <span className="text-[0.8125rem] text-edu-ink-500 font-semibold">{(matCurrentPage - 1) * PER_PAGE + i + 1}</span>
                                    <span className="text-sm text-edu-ink font-semibold flex items-center gap-2">
                                        <BookOpen className="text-edu-purple" style={{ width: 15, height: 15 }} />
                                        {m.nombre}
                                    </span>
                                    <span className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${NIVEL_META[m.nivel].cls}`}>{m.nivel}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => openEditMat(m)} aria-label={`Modificar ${m.nombre}`} className="text-edu-ink-400 hover:text-edu-purple bg-transparent border-none cursor-pointer p-0 flex items-center">
                                            <Pencil style={{ width: 15, height: 15 }} />
                                        </button>
                                        <button onClick={() => setConfirmDelMat(m)} aria-label={`Eliminar ${m.nombre}`} className="text-edu-ink-400 hover:text-edu-danger bg-transparent border-none cursor-pointer p-0 flex items-center">
                                            <Trash2 style={{ width: 15, height: 15 }} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {matTotalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={matCurrentPage} totalPages={matTotalPages} onPageChange={setMatPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
