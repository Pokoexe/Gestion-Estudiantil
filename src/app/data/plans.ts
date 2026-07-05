/**
 * Store en memoria (mock) de los planes de evaluación del docente.
 * Compartido entre el listado (DocentePlanesPage) y el formulario
 * (DocentePlanFormPage) para que los cambios se reflejen entre vistas.
 */

import { CURRENT_LAPSO_ID, type LapsoId } from "./lapsos";

export type PlanEstado = "approved" | "review" | "draft" | "changes";

export interface PlanEvaluacion {
    id: number;
    content: string;
    description: string;
    weight: string;
    date: string;
    files: string[];
}

export interface Plan {
    id: number;
    /** Lapso al que pertenece el plan. Si falta, se asume el lapso en curso. */
    lapso?: LapsoId;
    subject: string;
    section: string;
    count: number;
    status: PlanEstado;
    note?: string;
    evaluations?: PlanEvaluacion[];
}

export const MATERIA_OPTIONS = ["Ciencias Naturales", "Biología", "Ciencias de la Tierra", "Química"];
export const SECCION_OPTIONS = ["3.º Año C", "4.º Año A", "4.º Año B", "5.º Año A", "5.º Año B"];

/** Ventana del lapso académico y separación permitida entre evaluaciones. */
export const LAPSO = {
    start: "2026-07-01",
    end: "2026-09-30",
    startLabel: "1 de julio de 2026",
    endLabel: "30 de septiembre de 2026",
    minDays: 5,
    maxDays: 30,
};

export const MIN_EVALS = 4;

const STATIC_EVALS: PlanEvaluacion[] = [
    { id: 1, content: "Evaluación 1", description: "", weight: "25", date: "2026-07-15", files: [] },
    { id: 2, content: "Evaluación 2", description: "", weight: "25", date: "2026-08-05", files: [] },
    { id: 3, content: "Evaluación 3", description: "", weight: "25", date: "2026-08-26", files: [] },
    { id: 4, content: "Evaluación 4", description: "", weight: "25", date: "2026-09-16", files: [] },
];

export let PLANS: Plan[] = [
    // Lapso II (en curso)
    { id: 1, lapso: 2, subject: "Biología", section: "5.º Año A", count: 5, status: "approved", evaluations: STATIC_EVALS },
    { id: 2, lapso: 2, subject: "Ciencias Naturales", section: "4.º Año B", count: 5, status: "review", note: "En espera de aprobación del evaluador", evaluations: STATIC_EVALS },
    { id: 3, lapso: 2, subject: "Química", section: "5.º Año B", count: 4, status: "changes", note: "El evaluador solicitó ajustar la ponderación de la Unidad 2", evaluations: STATIC_EVALS },
    { id: 4, lapso: 2, subject: "Ciencias de la Tierra", section: "3.º Año C", count: 4, status: "draft", evaluations: STATIC_EVALS },
    // Lapso I (finalizado) — planes ya aprobados
    { id: 5, lapso: 1, subject: "Biología", section: "5.º Año A", count: 4, status: "approved", evaluations: STATIC_EVALS },
    { id: 6, lapso: 1, subject: "Ciencias Naturales", section: "4.º Año B", count: 4, status: "approved", evaluations: STATIC_EVALS },
    { id: 7, lapso: 1, subject: "Química", section: "5.º Año B", count: 4, status: "approved", evaluations: STATIC_EVALS },
];

export const getPlanById = (id: string | number | undefined): Plan | undefined =>
    PLANS.find((p) => String(p.id) === String(id));

interface PlanInput {
    subject: string;
    section: string;
    evaluations: PlanEvaluacion[];
}

export function addPlan(data: PlanInput): Plan {
    const plan: Plan = {
        id: Date.now(),
        lapso: CURRENT_LAPSO_ID,
        subject: data.subject,
        section: data.section,
        count: data.evaluations.length,
        status: "review",
        note: "Plan enviado al evaluador para su revisión",
        evaluations: data.evaluations,
    };
    PLANS = [plan, ...PLANS];
    return plan;
}

export function updatePlan(id: number, data: PlanInput): void {
    PLANS = PLANS.map((p) =>
        p.id === id
            ? {
                  ...p,
                  subject: data.subject,
                  section: data.section,
                  count: data.evaluations.length,
                  status: "review",
                  note: "Plan actualizado · enviado al evaluador",
                  evaluations: data.evaluations,
              }
            : p,
    );
}
