import { X, UserPlus } from "lucide-react";
import { type Actividad } from "@shared/services/actions/docente-eval";
import { TIPO_META } from "../functions/useDocentePostulaciones";

interface EstudianteDisponible {
    id: number;
    nombre: string;
    seccion: string;
    cedula: string;
}

interface PostularModalProps {
    selectedAct: Actividad;
    selectedMeta: (typeof TIPO_META)[keyof typeof TIPO_META];
    disponibles: EstudianteDisponible[];
    estudianteId: number;
    setEstudianteId: (v: number) => void;
    setShowPostular: (v: boolean) => void;
    confirmarPostulacion: () => void;
}

export function PostularModal({
    selectedAct,
    selectedMeta,
    disponibles,
    estudianteId,
    setEstudianteId,
    setShowPostular,
    confirmarPostulacion,
}: PostularModalProps) {
    return (
        <div
            className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowPostular(false)}
        >
            <div
                className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: selectedMeta.ac.bg }}>
                            <UserPlus style={{ width: 16, height: 16, color: selectedMeta.ac.fg }} />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Postular estudiante</h3>
                    </div>
                    <button
                        onClick={() => setShowPostular(false)}
                        aria-label="Cerrar"
                        className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
                    >
                        <X style={{ width: 16, height: 16 }} />
                    </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                    <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
                        Actividad: <strong>{selectedAct.nombre}</strong>
                    </div>

                    {disponibles.length === 0 ? (
                        <p className="text-[0.8125rem] text-edu-ink-400 m-0 text-center py-2">
                            Todos los estudiantes disponibles ya están postulados.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-edu-ink-700 text-sm font-medium">Seleccionar estudiante</label>
                            <select
                                value={estudianteId}
                                onChange={(e) => setEstudianteId(Number(e.target.value))}
                                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-primary"
                            >
                                {disponibles.map((e) => (
                                    <option key={e.id} value={e.id}>{e.nombre} · {e.seccion}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => setShowPostular(false)}
                            className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle"
                        >
                            Cancelar
                        </button>
                        {disponibles.length > 0 && (
                            <button
                                type="button"
                                onClick={confirmarPostulacion}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
                                style={{ backgroundColor: selectedMeta.ac.fg }}
                            >
                                <UserPlus style={{ width: 16, height: 16 }} />
                                Postular
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
