/**
 * Store en memoria (mock) de las planificaciones del docente.
 * Estructura casi idéntica al plan de evaluación, pero con "sesiones/temas"
 * en lugar de evaluaciones ponderadas.
 */

import { MATERIA_OPTIONS, SECCION_OPTIONS, LAPSO } from "./plans";

export { MATERIA_OPTIONS, SECCION_OPTIONS, LAPSO };

export type PlanifEstado = "approved" | "review" | "draft" | "changes";

export interface PlanifSesion {
    id: number;
    content: string; // tema / título de la sesión
    description: string; // objetivos y actividades
    date: string;
    files: string[];
}

export interface Planificacion {
    id: number;
    subject: string;
    section: string;
    count: number;
    status: PlanifEstado;
    note?: string;
    sessions?: PlanifSesion[];
}

export const MIN_SESIONES = 3;

export let PLANIFICACIONES: Planificacion[] = [
    { id: 1, subject: "Biología", section: "5.º Año A", count: 6, status: "approved" },
    { id: 2, subject: "Ciencias Naturales", section: "4.º Año B", count: 5, status: "review", note: "En espera de aprobación del coordinador" },
    { id: 3, subject: "Química", section: "5.º Año B", count: 4, status: "changes", note: "El coordinador solicitó detallar las actividades de la semana 3" },
    { id: 4, subject: "Ciencias de la Tierra", section: "3.º Año C", count: 5, status: "draft" },
];

export const getPlanifById = (id: string | number | undefined): Planificacion | undefined =>
    PLANIFICACIONES.find((p) => String(p.id) === String(id));

interface PlanifInput {
    subject: string;
    section: string;
    sessions: PlanifSesion[];
}

export function addPlanif(data: PlanifInput): Planificacion {
    const planif: Planificacion = {
        id: Date.now(),
        subject: data.subject,
        section: data.section,
        count: data.sessions.length,
        status: "review",
        note: "Planificación enviada al coordinador para su revisión",
        sessions: data.sessions,
    };
    PLANIFICACIONES = [planif, ...PLANIFICACIONES];
    return planif;
}

export function updatePlanif(id: number, data: PlanifInput): void {
    PLANIFICACIONES = PLANIFICACIONES.map((p) =>
        p.id === id
            ? {
                  ...p,
                  subject: data.subject,
                  section: data.section,
                  count: data.sessions.length,
                  status: "review",
                  note: "Planificación actualizada · enviada al coordinador",
                  sessions: data.sessions,
              }
            : p,
    );
}
