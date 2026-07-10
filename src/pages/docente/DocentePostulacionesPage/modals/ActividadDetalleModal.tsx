import { Calendar, MapPin, Users, X, Search } from "lucide-react";
import { Pagination } from "@shared/ui/Pagination";
import { type Actividad, type EstadoPostulado } from "@shared/services/actions/docente-eval";
import { TIPO_META, ESTADO_META, fmtFecha } from "../functions/useDocentePostulaciones";

interface ActividadDetalleModalProps {
    selectedAct: Actividad;
    selectedMeta: (typeof TIPO_META)[keyof typeof TIPO_META];
    selectedAprobados: number;
    cupoLleno: boolean;
    modalQuery: string;
    setModalQuery: (v: string) => void;
    modalPage: number;
    setModalPage: (v: number) => void;
    filteredPostulados: Actividad["postulados"];
    modalTotalPages: number;
    modalCurrentPage: number;
    pagedPostulados: Actividad["postulados"];
    setConfirmRemove: (v: { postId: number; nombre: string } | null) => void;
    closeDetalle: () => void;
}

export function ActividadDetalleModal({
    selectedAct,
    selectedMeta,
    selectedAprobados,
    cupoLleno,
    modalQuery,
    setModalQuery,
    modalPage,
    setModalPage,
    filteredPostulados,
    modalTotalPages,
    modalCurrentPage,
    pagedPostulados,
    setConfirmRemove,
    closeDetalle,
}: ActividadDetalleModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={closeDetalle}
        >
            <div
                className="bg-edu-surface rounded-edu-card w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-edu-border-soft flex items-start gap-3">
                    <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: selectedMeta.ac.bg }}>
                        {(() => { const Icon = selectedMeta.icon; return <Icon style={{ width: 20, height: 20, color: selectedMeta.ac.fg }} />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="m-0 text-edu-ink font-bold text-[1.05rem] leading-tight">{selectedAct.nombre}</h3>
                            <span className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.7rem] font-semibold shrink-0" style={{ backgroundColor: selectedMeta.ac.bg, color: selectedMeta.ac.fg }}>
                                {selectedAct.tipo}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                            <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                <Calendar style={{ width: 12, height: 12 }} /> {fmtFecha(selectedAct.fecha)}
                            </span>
                            <span className="text-[0.8125rem] text-edu-ink-500 flex items-center gap-1">
                                <MapPin style={{ width: 12, height: 12 }} /> {selectedAct.lugar}
                            </span>
                            <span className={`text-[0.8125rem] font-semibold flex items-center gap-1 ${cupoLleno ? "text-edu-danger" : "text-edu-ink-700"}`}>
                                <Users style={{ width: 12, height: 12 }} />
                                Cupos: {selectedAprobados}/{selectedAct.cupo}
                                {cupoLleno && <span className="ml-1 text-[0.7rem] font-semibold px-1.5 py-[1px] rounded-edu-pill bg-edu-danger-bg text-edu-danger">Lleno</span>}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={closeDetalle}
                        aria-label="Cerrar"
                        className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0"
                    >
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Sección de postulados */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-1.5">
                        <Users style={{ width: 14, height: 14, color: "var(--color-edu-ink-400)" }} />
                        <span className="text-[0.8rem] font-semibold text-edu-ink-700">
                            Estudiantes postulados ({selectedAct.postulados.length})
                        </span>
                    </div>

                    {/* Buscador modal */}
                    {selectedAct.postulados.length > 0 && (
                        <div className="px-5 py-2.5 border-b border-edu-border-soft">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={modalQuery}
                                    onChange={(e) => { setModalQuery(e.target.value); setModalPage(1); }}
                                    placeholder="Buscar por nombre, sección o cédula…"
                                    className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-8 pr-3 py-1.5 text-[0.8rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                                />
                            </div>
                        </div>
                    )}

                    {selectedAct.postulados.length === 0 ? (
                        <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                            Ningún estudiante postulado en esta actividad aún.
                        </div>
                    ) : filteredPostulados.length === 0 ? (
                        <div className="px-5 py-8 text-center text-edu-ink-400 text-sm">
                            No hay resultados para la búsqueda.
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <div className="min-w-[680px]">
                                    <div className="grid grid-cols-[1.8fr_1.2fr_1fr_0.9fr_2rem] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                                        {["Estudiante", "Sección", "Cédula", "Estado", ""].map((h) => (
                                            <span key={h} className="text-[0.68rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                                        ))}
                                    </div>
                                    {pagedPostulados.map((p, j) => {
                                        const st = ESTADO_META[p.estado as EstadoPostulado];
                                        return (
                                            <div
                                                key={p.id}
                                                className={`grid grid-cols-[1.8fr_1.2fr_1fr_0.9fr_2rem] px-5 py-[13px] items-center ${j < pagedPostulados.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                            >
                                                <span className="text-[0.875rem] text-edu-ink font-medium">{p.nombre}</span>
                                                <span className="text-[0.8125rem] text-edu-ink-500">{p.seccion}</span>
                                                <span className="text-[0.8125rem] text-edu-ink-500">{p.cedula}</span>
                                                <span className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${st.cls}`}>
                                                    {p.estado}
                                                </span>
                                                <button
                                                    onClick={() => setConfirmRemove({ postId: p.id, nombre: p.nombre })}
                                                    aria-label="Quitar postulación"
                                                    className="w-6 h-6 rounded-edu-chip flex items-center justify-center text-edu-ink-400 bg-transparent border-none cursor-pointer hover:text-edu-danger hover:bg-edu-danger-bg transition-colors"
                                                >
                                                    <X style={{ width: 12, height: 12 }} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {modalTotalPages > 1 && (
                                <div className="px-5 py-3 border-t border-edu-border-soft">
                                    <Pagination currentPage={modalCurrentPage} totalPages={modalTotalPages} onPageChange={setModalPage} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-edu-border-soft flex justify-end">
                    <button
                        onClick={closeDetalle}
                        className="px-4 py-2 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
