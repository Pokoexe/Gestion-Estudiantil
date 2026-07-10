import { MapPin } from "lucide-react";
import type { NavigateFunction } from "react-router";
import type { Materia } from "../interfaces";

interface Props {
    HORARIO: any[];
    SUBJECT_TO_SECTION: Record<string, any>;
    DIAS: readonly string[];
    BLOQUES: readonly string[];
    materiaMap: Record<string, Materia>;
    navigate: NavigateFunction;
}

export function HorarioTable({ HORARIO, SUBJECT_TO_SECTION, DIAS, BLOQUES, materiaMap, navigate }: Props) {
    return (
        /* Tabla de horario */
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-[860px]">
                    {/* Cabecera */}
                    <div className="grid grid-cols-[0.9fr_repeat(5,1fr)] bg-edu-subtle border-b border-edu-border-soft">
                        <span className="px-4 py-3 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                            Hora
                        </span>
                        {DIAS.map((d) => (
                            <span
                                key={d}
                                className="px-4 py-3 text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] text-center"
                            >
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Filas por bloque */}
                    {BLOQUES.map((bloque, bi) => (
                        <div
                            key={bloque}
                            className={`grid grid-cols-[0.9fr_repeat(5,1fr)] ${bi < BLOQUES.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                        >
                            <div className="px-4 py-3 flex items-center bg-edu-subtle/50">
                                <span className="text-[0.75rem] font-semibold text-edu-ink-700">{bloque}</span>
                            </div>
                            {(HORARIO[bi] ?? []).map((clase: any, di: number) => (
                                <div key={di} className="p-2 border-l border-edu-border-soft min-h-[74px]">
                                    {clase ? (
                                        <button
                                            onClick={() => navigate("/docente/secciones", { state: { seccionId: SUBJECT_TO_SECTION[clase.subject] } })}
                                            className="w-full h-full text-left rounded-edu-chip px-2.5 py-2 flex flex-col gap-1 cursor-pointer border-none transition-[filter] hover:brightness-95"
                                            style={{ backgroundColor: materiaMap[clase.subject].bg }}
                                        >
                                            <span
                                                className="text-[0.75rem] font-semibold leading-tight"
                                                style={{ color: materiaMap[clase.subject].fg }}
                                            >
                                                {materiaMap[clase.subject].name}
                                            </span>
                                            <span className="text-[0.68rem] font-medium text-edu-ink-700">{clase.grade}</span>
                                            <span className="text-[0.68rem] text-edu-ink-500 flex items-center gap-1">
                                                <MapPin style={{ width: "11px", height: "11px" }} />
                                                {clase.room}
                                            </span>
                                        </button>
                                    ) : (
                                        <div className="h-full rounded-edu-chip flex items-center justify-center">
                                            <span className="text-[0.7rem] text-edu-ink-300">Libre</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
