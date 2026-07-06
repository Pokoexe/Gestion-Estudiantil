/**
 * Store en memoria (mock) de las postulaciones para discusión de notas.
 *
 * El evaluador postula estudiantes (EvalDiscusionPage) y el Concejo de
 * Profesores acepta o rechaza cada discusión (DocenteConcejoPage). Ambas
 * vistas comparten este store para que el flujo evaluador → concejo sea real.
 */

import { CURRENT_LAPSO_ID, type LapsoId } from "./lapsos";

export type PostEstado = "Pendiente" | "Aceptada" | "Rechazada";

export interface Postulacion {
    id: number;
    /** Lapso al que corresponde la discusión. Si falta, se asume el lapso en curso. */
    lapso?: LapsoId;
    estudiante: string;
    materia: string;
    /** Año / sección del estudiante postulado. */
    anio: string;
    nota: number;
    motivo: string;
    actividades: string[];
    estado: PostEstado;
    observacion?: string;
    /** Fecha propuesta por el evaluador para presentar el caso al Concejo (ISO). */
    fechaPresentacion?: string;
}

/** Formatea una fecha ISO (YYYY-MM-DD) a DD/MM/YYYY. */
export function fmtFechaPost(iso?: string): string {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return d && m && y ? `${d}/${m}/${y}` : iso;
}

export const MATERIAS_DISCUSION = [
    "Castellano",
    "Matemáticas",
    "Biología",
    "Química",
    "Física",
    "Historia",
    "Inglés",
];

export const ANIOS_DISCUSION = [
    "1.º Año A",
    "2.º Año A",
    "3.º Año A",
    "3.º Año C",
    "4.º Año A",
    "4.º Año B",
    "5.º Año A",
    "5.º Año B",
];

export let POSTULACIONES: Postulacion[] = [
    // Lapso II (en curso)
    {
        id: 1,
        lapso: 2,
        estudiante: "Carlos Bracho",
        materia: "Matemáticas",
        anio: "4.º Año A",
        nota: 9,
        motivo: "Reprobó por 1 punto tras mejorar notablemente en las últimas evaluaciones.",
        actividades: ["Selección de baloncesto (2 pts.)", "Ayudante de laboratorio (1 pt.)"],
        estado: "Pendiente",
    },
    {
        id: 2,
        lapso: 2,
        estudiante: "Eduardo Marín",
        materia: "Física",
        anio: "5.º Año B",
        nota: 7,
        motivo: "Situación familiar durante el lapso; recuperó en actividades finales.",
        actividades: ["Grupo de teatro (2 pts.)"],
        estado: "Pendiente",
    },
    // Lapso I (finalizado) — ya decididas por el Concejo
    {
        id: 3,
        lapso: 1,
        estudiante: "Jesús Alvarado",
        materia: "Química",
        anio: "5.º Año B",
        nota: 8,
        motivo: "Constancia en las asignaciones prácticas de la última unidad.",
        actividades: ["Coro institucional (1 pt.)", "Brigada ecológica (2 pts.)"],
        estado: "Aceptada",
        observacion: "Se aprueba con nota mínima considerando las actividades extracurriculares.",
    },
    {
        id: 4,
        lapso: 1,
        estudiante: "Gustavo Linares",
        materia: "Historia",
        anio: "3.º Año A",
        nota: 9,
        motivo: "Solicita revisión de la ponderación del proyecto final.",
        actividades: ["Periódico escolar (1 pt.)"],
        estado: "Rechazada",
        observacion: "No alcanza los objetivos mínimos; se mantiene la nota.",
    },
    {
        id: 5,
        lapso: 1,
        estudiante: "María Fernández",
        materia: "Biología",
        anio: "4.º Año B",
        nota: 9,
        motivo: "Mejoró notablemente en las evaluaciones finales tras un inicio irregular.",
        actividades: ["Coro institucional (1 pt.)"],
        estado: "Aceptada",
        observacion: "Aprobada considerando la constancia en la última unidad.",
    },
    {
        id: 6,
        lapso: 1,
        estudiante: "Luis Rondón",
        materia: "Matemáticas",
        anio: "5.º Año A",
        nota: 8,
        motivo: "Solicita revisión de la ponderación del último examen.",
        actividades: ["Selección de fútbol (2 pts.)"],
        estado: "Rechazada",
        observacion: "Se mantiene la nota; no alcanza el mínimo requerido.",
    },
    {
        id: 7,
        lapso: 1,
        estudiante: "Andrea Gómez",
        materia: "Inglés",
        anio: "3.º Año A",
        nota: 9,
        motivo: "Participación destacada en las actividades del lapso.",
        actividades: ["Club de debate (1 pt.)", "Periódico escolar (1 pt.)"],
        estado: "Aceptada",
        observacion: "Aprobada por el Concejo.",
    },
    {
        id: 8,
        lapso: 1,
        estudiante: "Pedro Salazar",
        materia: "Física",
        anio: "4.º Año A",
        nota: 8,
        motivo: "Recuperó parcialmente durante la última unidad.",
        actividades: ["Brigada ecológica (2 pts.)"],
        estado: "Rechazada",
        observacion: "No alcanza los objetivos mínimos del lapso.",
    },
];

/** El evaluador postula un estudiante ante el Concejo (queda Pendiente). */
export function postularEstudiante(data: Omit<Postulacion, "id" | "estado">): void {
    POSTULACIONES = [
        { ...data, lapso: data.lapso ?? CURRENT_LAPSO_ID, id: Date.now(), estado: "Pendiente" },
        ...POSTULACIONES,
    ];
}

/** El Concejo decide una postulación pendiente. */
export function decidirPostulacion(
    id: number,
    estado: "Aceptada" | "Rechazada",
    observacion: string,
): void {
    POSTULACIONES = POSTULACIONES.map((p) =>
        p.id === id
            ? {
                  ...p,
                  estado,
                  observacion:
                      observacion.trim() ||
                      (estado === "Aceptada" ? "Aprobada por el Concejo." : "Rechazada por el Concejo."),
              }
            : p,
    );
}
