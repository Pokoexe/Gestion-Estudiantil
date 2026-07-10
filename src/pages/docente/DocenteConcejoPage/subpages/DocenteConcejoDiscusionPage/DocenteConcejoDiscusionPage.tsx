import { ArrowLeft } from "lucide-react";
import { useDocenteConcejoDiscusion } from "./functions/useDocenteConcejoDiscusion";
import { DiscusionTopbar } from "./ui/DiscusionTopbar";
import { EstudianteHeader } from "./ui/EstudianteHeader";
import { CasoDiscusion } from "./ui/CasoDiscusion";
import { ActividadesExtracurriculares } from "./ui/ActividadesExtracurriculares";
import { NotasMateria } from "./ui/NotasMateria";
import { DecisionButtons } from "./ui/DecisionButtons";
import { ConfirmDecisionModal } from "./modals/ConfirmDecisionModal";

/* ------------------------------------------------------------------ */
/* Página de detalle: revisión de una discusión de notas (Concejo)     */
/* ------------------------------------------------------------------ */

export function DocenteConcejoDiscusionPage() {
    const {
        loading,
        post,
        obs,
        viewMateria,
        setViewMateria,
        confirm,
        setConfirm,
        volver,
        boletin,
        pendiente,
        materias,
        viewNota,
        viewEvals,
        viendoDiscusion,
        confirmarDecision,
    } = useDocenteConcejoDiscusion();

    if (loading) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
                Cargando…
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
                <p className="text-edu-ink-500 text-sm m-0">No se encontró la discusión solicitada.</p>
                <button
                    onClick={volver}
                    className="inline-flex items-center gap-1.5 mt-4 text-[0.8125rem] font-semibold cursor-pointer bg-transparent border-none text-edu-primary"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Concejo
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Barra superior */}
            <DiscusionTopbar estado={post.estado} onVolver={volver} />

            {/* Cabecera: nombre del estudiante + materia / año / sección */}
            <EstudianteHeader post={post} boletin={boletin} />

            {/* Dos columnas: izquierda (motivo + actividades) · derecha (observación + notas) */}
            < div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-5 items-start" >
                {/* ---------------- Columna izquierda ---------------- */}
                < div className="flex flex-col gap-5" >
                    {/* Motivo de la postulación */}
                    <CasoDiscusion post={post} />

                    {/* Actividades extracurriculares (abajo a la izquierda) */}
                    <ActividadesExtracurriculares post={post} />
                </div >

                {/* ---------------- Columna derecha ---------------- */}
                < div className="flex flex-col gap-5" >
                    {/* Notas de la materia + selector de materia */}
                    <NotasMateria
                        post={post}
                        materias={materias}
                        viewMateria={viewMateria}
                        setViewMateria={setViewMateria}
                        viewNota={viewNota}
                        viewEvals={viewEvals}
                        viendoDiscusion={viendoDiscusion}
                    />
                </div >
            </div >

            {/* Dos botones grandes: aceptar o rechazar (con confirmación) */}
            <DecisionButtons
                post={post}
                pendiente={pendiente}
                onAceptar={() => setConfirm("Aceptada")}
                onRechazar={() => setConfirm("Rechazada")}
            />

            {/* Modal de confirmación */}
            {confirm && (
                <ConfirmDecisionModal
                    confirm={confirm}
                    post={post}
                    obs={obs}
                    onConfirm={confirmarDecision}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div >
    );
}
