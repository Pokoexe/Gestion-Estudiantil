/**
 * Store en memoria (mock) de los planes de evaluación del docente.
 * Compartido entre el listado (DocentePlanesPage) y el formulario
 * (DocentePlanFormPage) para que los cambios se reflejen entre vistas.
 */

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

export let PLANS: Plan[] = [
    { id: 1, subject: "Biología", section: "5.º Año A", count: 5, status: "approved" },
    { id: 2, subject: "Ciencias Naturales", section: "4.º Año B", count: 5, status: "review", note: "En espera de aprobación del evaluador" },
    { id: 3, subject: "Química", section: "5.º Año B", count: 4, status: "changes", note: "El evaluador solicitó ajustar la ponderación de la Unidad 2" },
    { id: 4, subject: "Ciencias de la Tierra", section: "3.º Año C", count: 4, status: "draft" },
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
