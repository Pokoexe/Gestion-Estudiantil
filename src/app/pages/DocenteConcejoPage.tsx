import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Bell,
    History,
    Search,
    ChevronRight,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { useFetch } from "../datos_maquetados";
import { getPostulaciones } from "../datos_maquetados/actions/discusiones";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const PER_PAGE = 5;
const COLS = "grid-cols-[1.6fr_1.2fr_1fr_0.7fr]";
const HEADERS = ["Estudiante", "Materia", "Año", "Nota"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DocenteConcejoPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data: POSTULACIONES, loading } = useFetch(getPostulaciones, []);

    // Solo hay una discusión de notas en curso a la vez.
    const activa = POSTULACIONES.find((p) => p.estado === "Pendiente");
    // Historial: estudiantes ya discutidos. No se revela si fueron aceptados o rechazados.
    const historial = POSTULACIONES.filter((p) => p.estado !== "Pendiente");

    const q = query.trim().toLowerCase();
    const filtrado = historial.filter(
        (p) => !q || `${p.estudiante} ${p.materia} ${p.anio}`.toLowerCase().includes(q),
    );

    const totalPages = Math.max(1, Math.ceil(filtrado.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtrado.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div>
                <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Concejo de Profesores</h2>
                <p className="text-edu-ink-500 text-sm mt-1 m-0">
                    Acepta o rechaza las discusiones de notas de los estudiantes postulados por el evaluador
                </p>
            </div> */}

            {/* Notificación: hay una discusión de notas en curso (clic → detalle) */}
            {activa && (
                <button
                    type="button"
                    onClick={() => navigate(`/docente/concejo/${activa.id}`)}
                    className="w-full text-left flex items-center gap-3.5 px-4 py-4 rounded-edu-card bg-edu-primary-50 border border-edu-primary-200 cursor-pointer transition-colors hover:bg-edu-primary-100"
                >
                    <div className="relative w-11 h-11 rounded-edu-control bg-edu-primary flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-white" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-edu-danger-strong border-2 border-edu-primary-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="m-0 text-[0.95rem] font-bold text-edu-ink">Tienes una discusión de notas en curso</p>
                        <p className="m-0 text-[0.8125rem] text-edu-ink-700 mt-0.5 truncate">
                            {activa.estudiante} · {activa.materia} · {activa.anio} — toca para revisar y decidir.
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-edu-primary shrink-0" />
                </button>
            )}

            {/* Historial de estudiantes postulados (buscador + paginación, sin revelar la decisión) */}
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
                    <History className="w-4 h-4 text-edu-ink-400" />
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Historial de estudiantes postulados</h3>
                    <span className="ml-auto text-[0.8rem] text-edu-ink-400 font-medium">
                        {filtrado.length} registro{filtrado.length === 1 ? "" : "s"}
                    </span>
                </div>

                {/* Buscador */}
                <div className="px-5 py-3 border-b border-edu-border-soft">
                    <div className="relative">
                        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Buscar por estudiante, materia o año…"
                            className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
                        />
                    </div>
                </div>

                {/* Cabecera de tabla */}
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
                            {HEADERS.map((h) => (
                                <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
                            ))}
                        </div>

                        {paged.length === 0 ? (
                            <div className="px-5 py-10 text-center text-edu-ink-400 text-sm">
                                {historial.length === 0
                                    ? "Aún no hay estudiantes discutidos por el Concejo."
                                    : "No hay registros que coincidan con la búsqueda."}
                            </div>
                        ) : (
                            paged.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`grid ${COLS} px-5 py-[13px] items-center ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                                >
                                    <span className="text-sm text-edu-ink font-medium">{p.estudiante}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{p.materia}</span>
                                    <span className="text-[0.8125rem] text-edu-ink-500">{p.anio}</span>
                                    <span className="text-sm text-edu-ink-700 font-semibold">{p.nota}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-edu-border-soft">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </div>
    );
}
