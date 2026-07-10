import { PlusCircle } from "lucide-react";
import { useDocenteCursos } from "./functions/useDocenteCursos";
import { InscripcionesChart } from "./ui/InscripcionesChart";
import { CursosKpis } from "./ui/CursosKpis";
import { CursosTable } from "./ui/CursosTable";

export function DocenteCursosPage() {
    const {
        navigate,
        query,
        setQuery,
        statusFilter,
        setStatusFilter,
        setPage,
        loading,
        CHART_DATA,
        KPIS,
        filtered,
        totalPages,
        currentPage,
        paged,
    } = useDocenteCursos();

    if (loading) return <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">Cargando…</div>;

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.35rem]">Mis cursos</h2>
                    <p className="text-edu-ink-500 text-sm mt-1 m-0">Cursos extracurriculares solicitados y aceptados</p>
                </div>

            </div> */}

            {/* Grid superior */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                <InscripcionesChart data={CHART_DATA} />
                <CursosKpis kpis={KPIS} />
            </div>

            <button
                onClick={() => navigate("/docente/cursos/nuevo")}
                className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
            >
                <PlusCircle className="w-4 h-4" />
                Solicitar curso
            </button>

            {/* Tabla de cursos */}
            <CursosTable
                filtered={filtered}
                paged={paged}
                query={query}
                setQuery={setQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setPage={setPage}
                currentPage={currentPage}
                totalPages={totalPages}
                navigate={navigate}
            />
        </div>
    );
}
