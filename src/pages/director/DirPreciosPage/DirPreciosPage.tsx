import { Tag } from "lucide-react";
import { accent } from "@themes/tokens";
import { useDirPrecios } from "./functions/useDirPrecios";
import { PreciosKpiRow } from "./ui/PreciosKpiRow";
import { PreciosHistorialTable } from "./ui/PreciosHistorialTable";

export function DirPreciosPage() {
    const {
        loading,
        query,
        setQuery,
        estadoFilter,
        setEstadoFilter,
        page,
        setPage,
        vigente,
        KPIS,
        filtered,
        totalPages,
        currentPage,
        paged,
        COLS,
        HEADERS,
    } = useDirPrecios();

    if (loading)
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando…
            </div>
        );

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.amber.bg }}>
                    <Tag style={{ width: 22, height: 22, color: accent.amber.fg }} />
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Precios</h2>
                    <p className="m-0 text-edu-ink-500 text-[0.8125rem]">
                        Mensualidad, morosidad y descuentos de la institución · Período {vigente.periodo}
                    </p>
                </div>
            </div>

            {/* KPIs del cuadro de precios vigente */}
            <PreciosKpiRow KPIS={KPIS} />

            {/* Tabla de historial de precios */}
            <PreciosHistorialTable
                filtered={filtered}
                paged={paged}
                query={query}
                setQuery={setQuery}
                estadoFilter={estadoFilter}
                setEstadoFilter={setEstadoFilter}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                currentPage={currentPage}
                COLS={COLS}
                HEADERS={HEADERS}
            />
        </div>
    );
}
