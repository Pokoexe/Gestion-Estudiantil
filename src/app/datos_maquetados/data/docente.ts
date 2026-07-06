/**
 * Datos maquetados del dominio Docente — contenido estático de las páginas del
 * rol DOCENTE (grupo A): dashboard, secciones y horario.
 *
 * Aquí viven SOLO los datos de dominio (clases, secciones, estudiantes, plan de
 * evaluación de una sección, entregas pendientes y la matriz del horario). Los
 * mapas presentacionales (iconos, colores por estado/tipo, plantillas de grid)
 * permanecen en cada página.
 */

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export interface TodayClass {
    time: string;
    subject: string;
    section: string;
    room: string;
    status: "En curso" | "Próxima";
}

export interface ScheduleDay {
    day: string;
    classes: { time: string; subject: string; section: string; color: string }[];
}

export const TODAY_CLASSES: TodayClass[] = [
    { time: "07:00", subject: "Ciencias Naturales", section: "4.º B", room: "Lab 102", status: "En curso" },
    { time: "09:30", subject: "Biología", section: "5.º A", room: "Aula 204", status: "Próxima" },
    { time: "11:15", subject: "Ciencias de la Tierra", section: "3.º C", room: "Aula 108", status: "Próxima" },
];

export const SCHEDULE: ScheduleDay[] = [
    {
        day: "Lun",
        classes: [
            { time: "07:00", subject: "Ciencias Naturales", section: "4.º B", color: "#dbeafe" },
            { time: "09:30", subject: "Química", section: "5.º B", color: "#ffedd5" },
            { time: "11:15", subject: "Ciencias Naturales", section: "4.º A", color: "#dbeafe" },
        ],
    },
    {
        day: "Mar",
        classes: [
            { time: "08:00", subject: "Biología", section: "5.º A", color: "#dcfce7" },
            { time: "10:00", subject: "Ciencias de la Tierra", section: "3.º C", color: "#ede9fe" },
        ],
    },
    {
        day: "Mié",
        classes: [
            { time: "07:00", subject: "Ciencias Naturales", section: "4.º B", color: "#dbeafe" },
            { time: "09:30", subject: "Biología", section: "5.º A", color: "#dcfce7" },
            { time: "11:15", subject: "Ciencias de la Tierra", section: "3.º C", color: "#ede9fe" },
        ],
    },
    {
        day: "Jue",
        classes: [
            { time: "08:00", subject: "Química", section: "5.º B", color: "#ffedd5" },
            { time: "10:00", subject: "Ciencias Naturales", section: "4.º A", color: "#dbeafe" },
        ],
    },
    {
        day: "Vie",
        classes: [
            { time: "07:00", subject: "Biología", section: "5.º A", color: "#dcfce7" },
            { time: "09:30", subject: "Ciencias de la Tierra", section: "3.º C", color: "#ede9fe" },
        ],
    },
];

/* ------------------------------------------------------------------ */
/* Secciones                                                           */
/* ------------------------------------------------------------------ */

export interface Seccion {
    id: number;
    subject: string;
    grade: string;
    students: number;
    attendance: number;
    average: number;
    accent: string;
}

export interface Estudiante {
    id: number;
    name: string;
    cedula: string;
    attendance: number;
    average: number;
    /** Nota obtenida en cada evaluación del plan (alineado al orden de PLAN). null = sin entregar/pendiente. */
    grades: (number | null)[];
}

export type EvalEstado = "Calificada" | "En curso" | "Pendiente";
export type EvalTipo = "exam" | "lab" | "presentation" | "essay";

export interface EvaluacionPlan {
    id: number;
    name: string;
    type: EvalTipo;
    weight: number;
    date: string;
    horario: string;
    status: EvalEstado;
    description: string;
    topics?: string[];
    material?: string;
}

export interface Pendiente {
    student: string;
    evaluation: string;
    hasEvidence: boolean;
    evidenceUrl?: string;
}

export const SECCIONES: Seccion[] = [
    { id: 1, subject: "Ciencias Naturales", grade: "4.º Año B", students: 6, attendance: 94, average: 15.8, accent: "#dbeafe" },
    { id: 2, subject: "Biología", grade: "5.º Año A", students: 6, attendance: 91, average: 16.4, accent: "#dcfce7" },
    { id: 3, subject: "Ciencias de la Tierra", grade: "3.º Año C", students: 6, attendance: 88, average: 13.9, accent: "#ede9fe" },
    { id: 4, subject: "Química", grade: "5.º Año B", students: 6, attendance: 96, average: 14.7, accent: "#ffedd5" },
];

export const ESTUDIANTES: Estudiante[] = [
    { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678", attendance: 97, average: 18.2, grades: [18, 19, 18, null, null] },
    { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321", attendance: 92, average: 14.5, grades: [15, null, 14, null, null] },
    { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109", attendance: 88, average: 9.4, grades: [10, 9, null, null, null] },
    { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870", attendance: 95, average: 16.7, grades: [17, 16, 17, null, null] },
    { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542", attendance: 78, average: 8.6, grades: [9, 8, null, null, null] },
    { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233", attendance: 99, average: 17.9, grades: [18, 18, 17, null, null] },
];

export const PLAN: EvaluacionPlan[] = [
    {
        id: 1,
        name: "Prueba escrita · Unidad 1",
        type: "exam",
        weight: 20,
        date: "12 may 2026",
        horario: "Lun · 07:00",
        status: "Calificada",
        description: "Prueba escrita individual sobre los contenidos de la Unidad 1.",
        topics: ["Método científico", "Materia y energía", "Estados de la materia"],
        material: "Guia_Unidad1.pdf",
    },
    {
        id: 2,
        name: "Exposición: El Petróleo",
        type: "presentation",
        weight: 15,
        date: "28 may 2026",
        horario: "Mié · 09:30",
        status: "Calificada",
        description: "Exposición grupal sobre el petróleo, su origen y sus derivados.",
        topics: ["Origen del petróleo", "Refinación", "Impacto ambiental"],
    },
    {
        id: 3,
        name: "Taller práctico de laboratorio",
        type: "lab",
        weight: 20,
        date: "10 jun 2026",
        horario: "Mié · 11:15",
        status: "En curso",
        description: "Taller práctico en el laboratorio sobre reacciones químicas y medición.",
        material: "Instrucciones_Taller.pdf",
    },
    {
        id: 4,
        name: "Informe de investigación",
        type: "essay",
        weight: 25,
        date: "25 jun 2026",
        horario: "Lun · 07:00",
        status: "Pendiente",
        description: "Informe escrito de investigación sobre un tema asignado por el docente.",
    },
    {
        id: 5,
        name: "Examen final · Unidad 3",
        type: "exam",
        weight: 20,
        date: "8 jul 2026",
        horario: "Mié · 09:30",
        status: "Pendiente",
        description: "Examen final que abarca todos los contenidos de la Unidad 3.",
        topics: ["Ecosistemas", "Ciclos biogeoquímicos", "Biodiversidad"],
    },
];

export const PENDIENTES: Pendiente[] = [
    { student: "Carla Valentina Pérez", evaluation: "Taller práctico de laboratorio", hasEvidence: false },
    { student: "Andrea Carolina Suárez", evaluation: "Taller práctico de laboratorio", hasEvidence: true, evidenceUrl: "https://picsum.photos/seed/evidencia-andrea/640/440" },
    { student: "José Gregorio Martínez", evaluation: "Exposición: El Petróleo", hasEvidence: true, evidenceUrl: "https://picsum.photos/seed/evidencia-jose/640/440" },
];

/* ------------------------------------------------------------------ */
/* Horario                                                             */
/* ------------------------------------------------------------------ */

export interface Clase {
    subject: string; // key de Materia
    room: string;
    grade: string;
}

// Matriz [bloque][día] → clase u null
export const HORARIO: (Clase | null)[][] = [
    // 07:00
    [
        { subject: "cn", room: "Lab 102", grade: "4.º B" },
        { subject: "bio", room: "Aula 204", grade: "5.º A" },
        { subject: "cn", room: "Lab 102", grade: "4.º B" },
        { subject: "quim", room: "Lab 101", grade: "5.º B" },
        { subject: "bio", room: "Aula 204", grade: "5.º A" },
    ],
    // 08:30
    [
        { subject: "tierra", room: "Aula 108", grade: "3.º C" },
        null,
        { subject: "bio", room: "Aula 204", grade: "5.º A" },
        { subject: "tierra", room: "Aula 108", grade: "3.º C" },
        { subject: "quim", room: "Lab 101", grade: "5.º B" },
    ],
    // 10:15
    [
        { subject: "quim", room: "Lab 101", grade: "5.º B" },
        { subject: "cn", room: "Lab 102", grade: "4.º B" },
        null,
        { subject: "cn", room: "Lab 102", grade: "4.º B" },
        { subject: "tierra", room: "Aula 108", grade: "3.º C" },
    ],
    // 11:45
    [
        null,
        { subject: "tierra", room: "Aula 108", grade: "3.º C" },
        { subject: "quim", room: "Lab 101", grade: "5.º B" },
        null,
        { subject: "cn", room: "Lab 102", grade: "4.º B" },
    ],
    // 14:00
    [
        { subject: "bio", room: "Aula 204", grade: "5.º A" },
        null,
        { subject: "tierra", room: "Aula 108", grade: "3.º C" },
        { subject: "bio", room: "Aula 204", grade: "5.º A" },
        null,
    ],
];

/** Cada materia del horario corresponde a una sección en docente/secciones. */
export const SUBJECT_TO_SECTION: Record<string, number> = { cn: 1, bio: 2, tierra: 3, quim: 4 };
