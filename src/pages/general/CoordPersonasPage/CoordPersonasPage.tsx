import { Plus } from "lucide-react";
import { accent } from "@themes/tokens";
import { useCoordPersonas } from "./functions/useCoordPersonas";
import { SeccionesDonut } from "./ui/SeccionesDonut";
import { PersonasKpis } from "./ui/PersonasKpis";
import { EstudiantesTable } from "./ui/EstudiantesTable";
import { EstudianteModal } from "./modals/EstudianteModal";

export function CoordPersonasPage() {
    const {
        emptyEst,
        estModal, setEstModal,
        SECCIONES_DATA, TOTAL_SECCIONES,
        filteredEst, paged,
        query, setQuery,
        añoFilter, setAñoFilter,
        seccionFilter, setSeccionFilter,
        añosDisponibles, seccionesDisponibles,
        setPage, currentPage, totalPages,
        EST_COLS, EST_HEADERS,
        guardarEstudiante,
    } = useCoordPersonas();

    return (
        <div className="flex flex-col gap-5">
            {/* Encabezado */}
            {/* <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: accent.purple.bg }}>
                        <Users style={{ width: 22, height: 22, color: accent.purple.fg }} />
                    </div>
                    <div>
                        <h2 className="m-0 text-edu-ink font-bold text-[1.15rem]">Estudiantes</h2>
                        <p className="m-0 text-edu-ink-500 text-[0.8125rem]">Directorio de estudiantes del plantel</p>
                    </div>
                </div>

            </div> */}

            {/* Gráfico y tarjetas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <SeccionesDonut SECCIONES_DATA={SECCIONES_DATA} TOTAL_SECCIONES={TOTAL_SECCIONES} />
                <PersonasKpis />
            </div>

            <button onClick={() => setEstModal({ mode: "añadir", data: emptyEst })} className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold cursor-pointer border-none text-white" style={{ backgroundColor: accent.purple.fg }}>
                <Plus style={{ width: 16, height: 16 }} /> Añadir estudiante
            </button>

            {/* Tabla de estudiantes */}
            <EstudiantesTable
                filteredEst={filteredEst}
                paged={paged}
                query={query}
                setQuery={setQuery}
                añoFilter={añoFilter}
                setAñoFilter={setAñoFilter}
                seccionFilter={seccionFilter}
                setSeccionFilter={setSeccionFilter}
                añosDisponibles={añosDisponibles}
                seccionesDisponibles={seccionesDisponibles}
                setPage={setPage}
                currentPage={currentPage}
                totalPages={totalPages}
                EST_COLS={EST_COLS}
                EST_HEADERS={EST_HEADERS}
                onVer={(s) => setEstModal({ mode: "ver", data: s })}
                onModificar={(s) => setEstModal({ mode: "modificar", data: s })}
            />

            {/* Modal estudiante */}
            {estModal && (
                <EstudianteModal
                    estModal={estModal}
                    setEstModal={setEstModal}
                    guardarEstudiante={guardarEstudiante}
                />
            )}
        </div>
    );
}
