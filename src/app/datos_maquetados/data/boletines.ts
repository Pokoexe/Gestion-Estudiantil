/* ------------------------------------------------------------------ */
/* Datos ficticios de boletines de estudiantes (evaluador)             */
/* ------------------------------------------------------------------ */

import type { LapsoId } from "./lapsos";

export const ANIOS = ["3.º Año", "4.º Año", "5.º Año"];
export const SECCIONES = ["A", "B", "C"];
export const MATERIAS = ["Castellano", "Matemáticas", "Biología", "Química", "Física", "Historia"];

export interface Boletin {
  id: number;
  student: string;
  cedula: string;
  anio: string;
  seccion: string;
  representante: string;
  telefono: string;
  retirado: boolean;
  notas: number[]; // una por MATERIAS
}

export const BOLETINES: Boletin[] = [
  { id: 1, student: "Andreína Colmenares", cedula: "V-31.245.678", anio: "5.º Año", seccion: "A", representante: "Sra. Marbella Colmenares", telefono: "0414-1234567", retirado: true, notas: [18, 16, 19, 15, 17, 18] },
  { id: 2, student: "Carlos Bracho", cedula: "V-31.987.321", anio: "5.º Año", seccion: "A", representante: "Sr. Douglas Bracho", telefono: "0424-2345678", retirado: false, notas: [12, 9, 14, 11, 10, 13] },
  { id: 3, student: "Daniela Peña", cedula: "V-31.556.109", anio: "5.º Año", seccion: "A", representante: "Sra. Lucía Peña", telefono: "0412-3456789", retirado: true, notas: [20, 18, 17, 19, 18, 20] },
  { id: 4, student: "Eduardo Marín", cedula: "V-31.442.870", anio: "5.º Año", seccion: "A", representante: "Sra. Nancy Marín", telefono: "0416-4567890", retirado: false, notas: [8, 10, 9, 12, 7, 11] },
  { id: 5, student: "Fabiola Rojas", cedula: "V-31.778.542", anio: "5.º Año", seccion: "A", representante: "Sr. Ronald Rojas", telefono: "0426-5678901", retirado: true, notas: [16, 15, 18, 14, 16, 17] },
  { id: 6, student: "Gustavo Linares", cedula: "V-31.615.233", anio: "5.º Año", seccion: "A", representante: "Sra. Aracelis Linares", telefono: "0414-6789012", retirado: false, notas: [11, 13, 10, 9, 12, 14] },
  { id: 7, student: "Héctor Nava", cedula: "V-30.902.117", anio: "5.º Año", seccion: "B", representante: "Sr. Pedro Nava", telefono: "0424-7890123", retirado: true, notas: [19, 20, 18, 17, 19, 18] },
  { id: 8, student: "Isabel Quintero", cedula: "V-30.338.904", anio: "5.º Año", seccion: "B", representante: "Sra. Marbella Quintero", telefono: "0412-8901234", retirado: false, notas: [14, 12, 13, 15, 11, 16] },
  { id: 9, student: "Jesús Alvarado", cedula: "V-30.221.556", anio: "5.º Año", seccion: "B", representante: "Sra. Génesis Alvarado", telefono: "0416-9012345", retirado: false, notas: [9, 8, 11, 7, 10, 9] },
  { id: 10, student: "Karla Mendoza", cedula: "V-30.774.109", anio: "5.º Año", seccion: "B", representante: "Sra. Luisana Mendoza", telefono: "0426-0123456", retirado: true, notas: [17, 18, 16, 19, 15, 17] },
  { id: 11, student: "Luis Contreras", cedula: "V-32.115.447", anio: "4.º Año", seccion: "A", representante: "Sra. Neida Contreras", telefono: "0414-1122334", retirado: false, notas: [13, 14, 12, 15, 13, 16] },
  { id: 12, student: "Mariana Guerra", cedula: "V-32.660.918", anio: "4.º Año", seccion: "A", representante: "Sr. Carlos Guerra", telefono: "0424-5566778", retirado: true, notas: [18, 17, 19, 16, 18, 17] },
  { id: 13, student: "Néstor Piñango", cedula: "V-32.309.674", anio: "4.º Año", seccion: "A", representante: "Sra. Yohana Piñango", telefono: "0412-9988776", retirado: false, notas: [10, 9, 12, 8, 11, 10] },
  { id: 14, student: "Oriana Betancourt", cedula: "V-33.501.220", anio: "3.º Año", seccion: "C", representante: "Sr. Wilmer Betancourt", telefono: "0416-3344556", retirado: false, notas: [15, 16, 14, 13, 15, 14] },
  { id: 15, student: "Pablo Duque", cedula: "V-33.118.905", anio: "3.º Año", seccion: "C", representante: "Sra. Aracelis Duque", telefono: "0426-7788990", retirado: true, notas: [12, 11, 13, 10, 12, 13] },
  { id: 16, student: "Quintina Salas", cedula: "V-33.774.612", anio: "3.º Año", seccion: "C", representante: "Sr. Pedro Salas", telefono: "0414-2211009", retirado: false, notas: [17, 18, 16, 19, 17, 18] },
];

export const promedio = (notas: number[]): number =>
  Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 100) / 100;

export const notaColor = (n: number): string => (n >= 10 ? "text-edu-ink" : "text-edu-danger font-bold");

/**
 * Notas del boletín para un lapso dado. Las notas base corresponden al lapso
 * en curso (II); los otros lapsos aplican un ajuste determinista para simular
 * la evolución del estudiante a lo largo del año.
 */
const LAPSO_DELTA: Record<LapsoId, number> = { 1: -1, 2: 0, 3: 1 };

export function notasDe(b: Boletin, lapso: LapsoId): number[] {
  const d = LAPSO_DELTA[lapso];
  return b.notas.map((n) => Math.max(1, Math.min(20, n + d)));
}

/* Desglose de evaluaciones por materia (para la sábana detallada) */
export interface EvalNota {
  nombre: string;
  tipo: string;
  porcentaje: number;
  nota: number;
}

const clampNota = (n: number): number => Math.max(1, Math.min(20, n));

/** Genera las evaluaciones (con su nota) que componen la nota final de una materia. */
export function desglose(notaFinal: number): EvalNota[] {
  return [
    { nombre: "Examen · Unidad 1", tipo: "Examen", porcentaje: 25, nota: clampNota(notaFinal - 1) },
    { nombre: "Taller práctico", tipo: "Taller", porcentaje: 20, nota: clampNota(notaFinal + 1) },
    { nombre: "Exposición", tipo: "Exposición", porcentaje: 25, nota: clampNota(notaFinal) },
    { nombre: "Examen final", tipo: "Examen", porcentaje: 30, nota: clampNota(notaFinal) },
  ];
}

/* Actividades extracurriculares (mock determinista por estudiante) */
const POOL_ACTIVIDADES = [
  "Selección de baloncesto (2 pts.)",
  "Coro institucional (1 pt.)",
  "Grupo de teatro (2 pts.)",
  "Brigada ecológica (2 pts.)",
  "Ayudante de laboratorio (1 pt.)",
  "Periódico escolar (1 pt.)",
  "Club de robótica (2 pts.)",
  "Selección de voleibol (2 pts.)",
];

/** Actividades extracurriculares de un estudiante (1-3, deterministas por id). */
export function actividadesDe(id: number): string[] {
  const n = (id % 3) + 1;
  const out: string[] = [];
  for (let k = 0; k < n; k++) out.push(POOL_ACTIVIDADES[(id * 2 + k) % POOL_ACTIVIDADES.length]);
  return Array.from(new Set(out));
}
