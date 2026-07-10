import { Wrench, Clock, CircleAlert } from "lucide-react";

interface SummaryCardsProps {
    pendienteCount: number;
    reprobadoCount: number;
    repairingCount: number;
}

/** Bloques resumen: materias pendientes, reprobadas y en reparación. */
export function SummaryCards({ pendienteCount, reprobadoCount, repairingCount }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Materias pendientes */}
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Materias pendientes
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {pendienteCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-warning-bg flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-edu-warning" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Materias con tareas o evaluaciones pendientes
                </p>
            </div>

            {/* Reprobadas */}
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            Reprobadas
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {reprobadoCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-danger-bg flex items-center justify-center shrink-0">
                        <CircleAlert className="w-5 h-5 text-edu-danger" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Materias que necesitan recuperación
                </p>
            </div>

            {/* En reparación */}
            <div className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">
                            En reparación
                        </p>
                        <p className="text-edu-ink text-[1.4rem] font-bold mt-1">
                            {repairingCount}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-edu-control bg-edu-primary-100 flex items-center justify-center shrink-0">
                        <Wrench className="w-5 h-5 text-edu-primary" />
                    </div>
                </div>
                <p className="text-edu-ink-400 text-xs m-0">
                    Materias con plan de recuperación activo
                </p>
            </div>
        </div>
    );
}
