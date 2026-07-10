/**
 * Datos maquetados del rol Docente — dominio de EVALUACIÓN / CURSOS (grupo B).
 *
 * Reúne las SERIES DE DATOS estáticas que antes vivían incrustadas en las
 * páginas del docente: postulaciones a actividades extracurriculares,
 * calificaciones por lapso, y cursos extracurriculares del docente. Los expone
 * el "servidor" maquetado a través de `../server/routes/docente-eval.routes.ts`.
 *
 * Solo se mueven registros de CONTENIDO. Los mapas presentacionales (metadatos
 * de estado/tipo con iconos y colores, plantillas de columnas, listas de
 * opciones de <select>) permanecen en cada página.
 */

import type { LapsoId } from "./lapsos";

/* ================================================================== */
/* Postulaciones a actividades extracurriculares                       */
/* (DocentePostulacionesPage)                                          */
/* ================================================================== */

export type TipoActividad = "Cultural" | "Deportiva" | "Científica" | "Artística";
export type EstadoPostulado = "Pendiente" | "Aprobado" | "Rechazado";

export interface Postulado {
  id: number;
  nombre: string;
  seccion: string;
  cedula: string;
  estado: EstadoPostulado;
}

export interface Actividad {
  id: number;
  nombre: string;
  tipo: TipoActividad;
  fecha: string;
  lugar: string;
  cupo: number;
  postulados: Postulado[];
}

/** Estudiantes que pueden postularse a las actividades. */
export interface EstudianteDisponible {
  id: number;
  nombre: string;
  seccion: string;
  cedula: string;
}

export const ESTUDIANTES_DISPONIBLES: EstudianteDisponible[] = [
  { id: 101, nombre: "Carlos Mendoza", seccion: "4.º Año B", cedula: "V-28.123.456" },
  { id: 102, nombre: "Valeria Contreras", seccion: "3.º Año A", cedula: "V-29.234.567" },
  { id: 103, nombre: "Daniel Peña", seccion: "2.º Año B", cedula: "V-30.345.678" },
  { id: 104, nombre: "Isabella Moreno", seccion: "4.º Año C", cedula: "V-28.456.789" },
  { id: 105, nombre: "Sebastián Torres", seccion: "5.º Año A", cedula: "V-27.567.890" },
  { id: 106, nombre: "Gabriela Ríos", seccion: "1.º Año D", cedula: "V-31.678.901" },
  { id: 107, nombre: "Andrés López", seccion: "3.º Año B", cedula: "V-29.789.012" },
  { id: 108, nombre: "Fernanda Castro", seccion: "5.º Año C", cedula: "V-27.890.123" },
];

export const ACTIVIDADES_INICIALES: Actividad[] = [
  {
    id: 1,
    nombre: "Danzas Tradicionales Venezolanas",
    tipo: "Cultural",
    fecha: "2026-07-10",
    lugar: "Tariba, Táchira",
    cupo: 25,
    postulados: [
      { id: 11, nombre: "Valeria Contreras", seccion: "3.º Año A", cedula: "V-29.234.567", estado: "Aprobado" },
      { id: 12, nombre: "Daniel Peña", seccion: "2.º Año B", cedula: "V-30.345.678", estado: "Pendiente" },
    ],
  },
  {
    id: 2,
    nombre: "Feria de Ciencias Regionales",
    tipo: "Científica",
    fecha: "2026-07-18",
    lugar: "San Cristóbal, Táchira",
    cupo: 15,
    postulados: [
      { id: 21, nombre: "Sebastián Torres", seccion: "5.º Año A", cedula: "V-27.567.890", estado: "Pendiente" },
    ],
  },
  {
    id: 3,
    nombre: "Torneo Intercolegial de Ajedrez",
    tipo: "Deportiva",
    fecha: "2026-08-05",
    lugar: "Colegio San José, Rubio",
    cupo: 10,
    postulados: [],
  },
  {
    id: 4,
    nombre: "Exposición de Arte Escolar",
    tipo: "Artística",
    fecha: "2026-08-20",
    lugar: "Sala Cultural Municipal, San Cristóbal",
    cupo: 20,
    postulados: [],
  },
  {
    id: 5,
    nombre: "Festival de Música Estudiantil",
    tipo: "Cultural",
    fecha: "2026-09-05",
    lugar: "Auditorio Central, San Cristóbal",
    cupo: 30,
    postulados: [],
  },
  {
    id: 6,
    nombre: "Olimpiada Regional de Matemáticas",
    tipo: "Científica",
    fecha: "2026-09-12",
    lugar: "Universidad Nacional, Táchira",
    cupo: 12,
    postulados: [
      { id: 61, nombre: "Carlos Mendoza", seccion: "4.º Año B", cedula: "V-28.123.456", estado: "Pendiente" },
    ],
  },
  {
    id: 7,
    nombre: "Encuentro Deportivo Regional",
    tipo: "Deportiva",
    fecha: "2026-09-25",
    lugar: "Polideportivo Municipal, Rubio",
    cupo: 18,
    postulados: [],
  },
];

/* ================================================================== */
/* Calificaciones por lapso (DocenteCalificacionesPage)                */
/* ================================================================== */

export type EvalTipo = "exam" | "lab" | "presentation" | "essay";

export interface Estudiante {
  id: number;
  name: string;
  cedula: string;
  average: number;
  grades: (number | null)[];
}

export interface EvaluacionPlan {
  id: number;
  name: string;
  type: EvalTipo;
  weight: number;
  date: string;
}

export interface LapsoData {
  plan: EvaluacionPlan[];
  estudiantes: Estudiante[];
}

/** Datos completos de calificaciones: años, materias, y contenido por lapso. */
export interface CalificacionesData {
  anios: string[];
  materias: string[];
  porLapso: Record<LapsoId, LapsoData>;
  asistenciaPorLapso: Record<LapsoId, number>;
}

const CAL_ANIOS = ["3.º Año C", "4.º Año B", "5.º Año A", "5.º Año B"];
const CAL_MATERIAS = ["Ciencias Naturales", "Biología", "Ciencias de la Tierra", "Química"];

const CAL_NOMBRES: { id: number; name: string; cedula: string }[] = [
  { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678" },
  { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321" },
  { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109" },
  { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870" },
  { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542" },
  { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233" },
];

const CAL_PLAN_I: EvaluacionPlan[] = [
  { id: 1, name: "Diagnóstico · Unidad 1", type: "exam", weight: 20, date: "16 abr 2026" },
  { id: 2, name: "Exposición: Ecosistemas", type: "presentation", weight: 20, date: "30 abr 2026" },
  { id: 3, name: "Laboratorio · Suelos", type: "lab", weight: 25, date: "14 may 2026" },
  { id: 4, name: "Examen del lapso", type: "exam", weight: 35, date: "28 may 2026" },
];
const CAL_ESTUDIANTES_I: Estudiante[] = [
  { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678", average: 17.8, grades: [18, 17, 18, 18] },
  { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321", average: 13.2, grades: [14, 13, 12, 14] },
  { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109", average: 10.5, grades: [11, 10, 10, 11] },
  { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870", average: 16.0, grades: [16, 15, 17, 16] },
  { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542", average: 9.2, grades: [10, 9, 8, 10] },
  { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233", average: 17.2, grades: [17, 18, 17, 17] },
];

const CAL_PLAN_II: EvaluacionPlan[] = [
  { id: 1, name: "Prueba escrita · Unidad 1", type: "exam", weight: 20, date: "12 jun 2026" },
  { id: 2, name: "Exposición: El Petróleo", type: "presentation", weight: 15, date: "22 jun 2026" },
  { id: 3, name: "Taller práctico de laboratorio", type: "lab", weight: 20, date: "3 jul 2026" },
  { id: 4, name: "Informe de investigación", type: "essay", weight: 25, date: "17 jul 2026" },
  { id: 5, name: "Examen final · Unidad 3", type: "exam", weight: 20, date: "29 jul 2026" },
];
const CAL_ESTUDIANTES_II: Estudiante[] = [
  { id: 1, name: "María Fernanda Rodríguez", cedula: "V-31.245.678", average: 18.2, grades: [18, 19, 18, null, null] },
  { id: 2, name: "José Gregorio Martínez", cedula: "V-30.987.321", average: 14.5, grades: [15, null, 14, null, null] },
  { id: 3, name: "Carla Valentina Pérez", cedula: "V-31.556.109", average: 9.4, grades: [10, 9, null, null, null] },
  { id: 4, name: "Luis Alberto Contreras", cedula: "V-30.442.870", average: 16.7, grades: [17, 16, 17, null, null] },
  { id: 5, name: "Andrea Carolina Suárez", cedula: "V-31.778.542", average: 8.6, grades: [9, 8, null, null, null] },
  { id: 6, name: "Daniel Eduardo Blanco", cedula: "V-30.615.233", average: 17.9, grades: [18, 18, 17, null, null] },
];

const CAL_PLAN_III: EvaluacionPlan[] = [
  { id: 1, name: "Diagnóstico · Unidad 4", type: "exam", weight: 30, date: "7 ago 2026" },
  { id: 2, name: "Proyecto de investigación", type: "essay", weight: 35, date: "28 ago 2026" },
  { id: 3, name: "Examen final del lapso", type: "exam", weight: 35, date: "18 sep 2026" },
];
const CAL_ESTUDIANTES_III: Estudiante[] = CAL_NOMBRES.map((n) => ({
  ...n,
  average: 0,
  grades: [null, null, null],
}));

export const CALIFICACIONES: CalificacionesData = {
  anios: CAL_ANIOS,
  materias: CAL_MATERIAS,
  porLapso: {
    1: { plan: CAL_PLAN_I, estudiantes: CAL_ESTUDIANTES_I },
    2: { plan: CAL_PLAN_II, estudiantes: CAL_ESTUDIANTES_II },
    3: { plan: CAL_PLAN_III, estudiantes: CAL_ESTUDIANTES_III },
  },
  asistenciaPorLapso: { 1: 93.2, 2: 87.4, 3: 0 },
};

/* ================================================================== */
/* Cursos extracurriculares del docente (DocenteCursosPage)            */
/* ================================================================== */

export type CursoStatus = "aceptado" | "solicitado";

export interface DocenteCurso {
  id: number;
  title: string;
  code: string;
  schedule: string;
  enrolledCount: number;
  totalSpots: number;
  status: CursoStatus;
}

export const DOCENTE_CURSOS: DocenteCurso[] = [
  { id: 1, title: "Robótica y automatización", code: "EXT-ROB", schedule: "Lun / Mié · 14:00–15:30", enrolledCount: 18, totalSpots: 20, status: "aceptado" },
  { id: 6, title: "Programación web", code: "EXT-WEB", schedule: "Mar / Jue · 14:00–15:30", enrolledCount: 22, totalSpots: 25, status: "aceptado" },
  { id: 4, title: "Fotografía digital", code: "EXT-FOT", schedule: "Sáb · 09:00–11:00", enrolledCount: 8, totalSpots: 20, status: "aceptado" },
  { id: 2, title: "Oratoria y debate", code: "EXT-ORA", schedule: "Mar / Jue · 15:00–16:00", enrolledCount: 10, totalSpots: 25, status: "solicitado" },
  { id: 5, title: "Guitarra y ensamble musical", code: "EXT-MUS", schedule: "Lun / Mié · 16:00–17:00", enrolledCount: 15, totalSpots: 20, status: "solicitado" },
  { id: 3, title: "Ajedrez estratégico", code: "EXT-AJE", schedule: "Vie · 14:00–16:00", enrolledCount: 12, totalSpots: 15, status: "solicitado" },
];

export interface CursoChartPoint {
  mes: string;
  rob: number;
  web: number;
  fot: number;
}

export const CURSOS_CHART_DATA: CursoChartPoint[] = [
  { mes: "Feb", rob: 5, web: 8, fot: 3 },
  { mes: "Mar", rob: 8, web: 12, fot: 5 },
  { mes: "Abr", rob: 12, web: 16, fot: 6 },
  { mes: "May", rob: 15, web: 19, fot: 7 },
  { mes: "Jun", rob: 17, web: 21, fot: 8 },
  { mes: "Jul", rob: 18, web: 22, fot: 8 },
];

/* ================================================================== */
/* Docente a cargo (DocenteCursosFormPage — tarjeta "Docente a cargo") */
/* ================================================================== */

export interface DocenteActual {
  name: string;
  initials: string;
  role: string;
}

export const DOCENTE_ACTUAL: DocenteActual = {
  name: "Prof. Alejandro Morales",
  initials: "AM",
  role: "Docente · Ciencias Naturales",
};
