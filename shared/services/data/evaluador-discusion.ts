/* ------------------------------------------------------------------ */
/* Datos ficticios de estudiantes en riesgo / reparación (evaluador)   */
/* ------------------------------------------------------------------ */
/**
 * Store en memoria (mock) de los estudiantes en riesgo académico que el
 * evaluador revisa desde la vista de Reparaciones. Cada estudiante trae el
 * estado de sus materias (aprobada / reprobada / pendiente / reparando).
 *
 * Las derivaciones presentacionales (donut, KPIs, conteos) NO viven aquí:
 * se calculan en la página a partir de esta lista.
 */

export type MatStatus = "aprobada" | "reprobada" | "pendiente" | "reparando";

export interface Materia {
  name: string;
  status: MatStatus;
}

export interface StudentRow {
  id: number;
  name: string;
  cedula: string;
  anio: string;
  seccion: string;
  materias: Materia[];
}

export const ESTUDIANTES_REPARACION: StudentRow[] = [
  {
    id: 1, name: "Carlos Mendoza", cedula: "V-28.451.200", anio: "4to", seccion: "A",
    materias: [
      { name: "Matemática", status: "reprobada" },
      { name: "Física", status: "pendiente" },
      { name: "Historia", status: "aprobada" },
      { name: "Inglés", status: "aprobada" },
      { name: "Química", status: "reprobada" },
    ],
  },
  {
    id: 2, name: "Ana González", cedula: "V-29.102.334", anio: "4to", seccion: "B",
    materias: [
      { name: "Matemática", status: "pendiente" },
      { name: "Historia", status: "reprobada" },
      { name: "Inglés", status: "aprobada" },
      { name: "Química", status: "aprobada" },
      { name: "Literatura", status: "pendiente" },
    ],
  },
  {
    id: 3, name: "Miguel Torres", cedula: "V-30.200.111", anio: "5to", seccion: "A",
    materias: [
      { name: "Física", status: "reprobada" },
      { name: "Química", status: "reprobada" },
      { name: "Biología", status: "reprobada" },
      { name: "Historia", status: "aprobada" },
      { name: "Inglés", status: "aprobada" },
    ],
  },
  {
    id: 4, name: "Sofía Ramírez", cedula: "V-28.700.220", anio: "3ro", seccion: "C",
    materias: [
      { name: "Matemática", status: "reprobada" },
      { name: "Geografía", status: "pendiente" },
      { name: "Historia", status: "aprobada" },
      { name: "Inglés", status: "aprobada" },
      { name: "Literatura", status: "aprobada" },
    ],
  },
  {
    id: 5, name: "Luis Herrera", cedula: "V-31.050.405", anio: "5to", seccion: "B",
    materias: [
      { name: "Matemática", status: "pendiente" },
      { name: "Física", status: "pendiente" },
      { name: "Historia", status: "aprobada" },
      { name: "Inglés", status: "reprobada" },
      { name: "Química", status: "aprobada" },
    ],
  },
  {
    id: 6, name: "Valentina Díaz", cedula: "V-29.900.876", anio: "4to", seccion: "A",
    materias: [
      { name: "Literatura", status: "reprobada" },
      { name: "Inglés", status: "pendiente" },
      { name: "Matemática", status: "aprobada" },
      { name: "Física", status: "aprobada" },
      { name: "Química", status: "aprobada" },
    ],
  },
  {
    id: 7, name: "Pedro Castillo", cedula: "V-30.445.120", anio: "3ro", seccion: "A",
    materias: [
      { name: "Biología", status: "reprobada" },
      { name: "Geografía", status: "reprobada" },
      { name: "Historia", status: "pendiente" },
      { name: "Inglés", status: "aprobada" },
      { name: "Matemática", status: "aprobada" },
    ],
  },
  {
    id: 8, name: "Camila Flores", cedula: "V-28.312.990", anio: "3ro", seccion: "B",
    materias: [
      { name: "Química", status: "pendiente" },
      { name: "Física", status: "aprobada" },
      { name: "Matemática", status: "aprobada" },
      { name: "Historia", status: "aprobada" },
      { name: "Literatura", status: "reprobada" },
    ],
  },
  {
    id: 9, name: "Andrés Morales", cedula: "V-31.200.654", anio: "5to", seccion: "C",
    materias: [
      { name: "Matemática", status: "reprobada" },
      { name: "Física", status: "reprobada" },
      { name: "Química", status: "reprobada" },
      { name: "Inglés", status: "pendiente" },
      { name: "Historia", status: "aprobada" },
    ],
  },
  {
    id: 10, name: "Isabella Ruiz", cedula: "V-29.567.008", anio: "4to", seccion: "C",
    materias: [
      { name: "Geografía", status: "pendiente" },
      { name: "Biología", status: "pendiente" },
      { name: "Historia", status: "aprobada" },
      { name: "Literatura", status: "aprobada" },
      { name: "Inglés", status: "aprobada" },
    ],
  },
  {
    id: 11, name: "Sebastián Vega", cedula: "V-30.890.230", anio: "3ro", seccion: "C",
    materias: [
      { name: "Matemática", status: "reprobada" },
      { name: "Historia", status: "reprobada" },
      { name: "Inglés", status: "aprobada" },
      { name: "Literatura", status: "aprobada" },
      { name: "Geografía", status: "aprobada" },
    ],
  },
  {
    id: 12, name: "Mariana López", cedula: "V-28.150.440", anio: "5to", seccion: "A",
    materias: [
      { name: "Inglés", status: "reprobada" },
      { name: "Literatura", status: "pendiente" },
      { name: "Matemática", status: "aprobada" },
      { name: "Historia", status: "aprobada" },
      { name: "Biología", status: "aprobada" },
    ],
  },
];
