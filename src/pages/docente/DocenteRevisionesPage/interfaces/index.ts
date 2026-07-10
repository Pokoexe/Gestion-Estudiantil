import type { LapsoId } from "@shared/services/data/lapsos";

export type RevType = "examen" | "tema" | "planificacion" | "plan";
export type RevEstado = "Por revisar" | "Cambios enviados";

export interface Revision {
    id: string;
    lapso: LapsoId;
    type: RevType;
    title: string;
    materia: string;
    seccion: string;
    fecha: string;
    adjunto: string;
    estado: RevEstado;
    detalle?: string;
}
