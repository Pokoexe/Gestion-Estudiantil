/**
 * Store en memoria (mock) de las reparaciones del docente.
 * Cada reparación corresponde a una materia/sección reprobada y contiene
 * las evaluaciones de recuperación (con su horario), similar a un plan de
 * evaluación pero con la separación de oportunidades del período de reparación.
 */

import { LAPSO } from "./plans";

export { LAPSO };

export type ReparacionEstado = "creada" | "por_crear";

export interface ReparacionEval {
    id: number;
    content: string; // tema / nombre de la evaluación de recuperación
    description: string;
    date: string;
    horario: string; // día y hora
    files: string[];
}

export interface Reparacion {
    id: number;
    subject: string;
    section: string;
    status: ReparacionEstado;
    count: number;
    /** Id de la materia en RepairCoursePage (vista de reparación) para las creadas. */
    courseId?: string;
    evaluations?: ReparacionEval[];
}

export const MIN_REP = 4;

export let REPARACIONES: Reparacion[] = [
    {
        id: 1,
        subject: "Química",
        section: "5.º Año B",
        status: "creada",
        count: 4,
        courseId: "11",
        evaluations: [
            { id: 1, content: "Diagnóstico inicial", description: "Prueba diagnóstica de los contenidos reprobados.", date: "2026-07-14", horario: "Lun · 07:00 – 08:30", files: [] },
            { id: 2, content: "Taller de refuerzo", description: "Taller práctico guiado en laboratorio.", date: "2026-07-21", horario: "Lun · 07:00 – 08:30", files: [] },
            { id: 3, content: "Proyecto integrador", description: "Proyecto aplicado de recuperación.", date: "2026-07-28", horario: "Mié · 09:00 – 10:30", files: [] },
            { id: 4, content: "Examen final de recuperación", description: "Examen que integra todos los contenidos.", date: "2026-08-04", horario: "Mié · 09:00 – 10:30", files: [] },
        ],
    },
    { id: 2, subject: "Física", section: "5.º Año A", status: "por_crear", count: 0 },
    { id: 3, subject: "Inglés", section: "4.º Año B", status: "por_crear", count: 0 },
    { id: 5, subject: "Biología", section: "4.º Año A", status: "por_crear", count: 0 },
    { id: 6, subject: "Castellano", section: "3.º Año C", status: "por_crear", count: 0 },
    { id: 7, subject: "Ciencias Naturales", section: "5.º Año A", status: "por_crear", count: 0 },
    {
        id: 4,
        subject: "Matemática",
        section: "3.º Año C",
        status: "creada",
        count: 4,
        courseId: "12",
        evaluations: [
            { id: 1, content: "Diagnóstico inicial", description: "", date: "2026-07-15", horario: "Mar · 08:00 – 09:30", files: [] },
            { id: 2, content: "Taller de factorización", description: "", date: "2026-07-22", horario: "Mar · 08:00 – 09:30", files: [] },
            { id: 3, content: "Prueba corta", description: "", date: "2026-07-29", horario: "Jue · 10:00 – 11:30", files: [] },
            { id: 4, content: "Examen final de recuperación", description: "", date: "2026-08-05", horario: "Jue · 10:00 – 11:30", files: [] },
        ],
    },
];

export const getReparacionById = (id: string | number | undefined): Reparacion | undefined =>
    REPARACIONES.find((r) => String(r.id) === String(id));

export function saveReparacion(id: number, evaluations: ReparacionEval[]): void {
    REPARACIONES = REPARACIONES.map((r) =>
        r.id === id ? { ...r, status: "creada", count: evaluations.length, evaluations } : r,
    );
}
