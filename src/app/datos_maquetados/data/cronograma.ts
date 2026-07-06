/* ------------------------------------------------------------------ */
/* Datos ficticios de planes de evaluación (cronograma del evaluador)  */
/* ------------------------------------------------------------------ */

export type PlanEstado = "en revisión" | "activo";

export interface EvalItem {
  fecha: string; // ISO
  evaluacion: string;
  tipo: string; // Examen, Taller, Exposición, Proyecto…
  porcentaje: number;
}

export interface PlanEval {
  id: number;
  materia: string;
  seccion: string;
  docente: string;
  estado: PlanEstado;
  plantilla: string;
  evaluaciones: EvalItem[];
}

export const ESTADO_LABEL: Record<PlanEstado, string> = {
  "en revisión": "En revisión",
  activo: "Activo",
};

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const fmtFecha = (iso: string): string => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
};

export const fmtFechaLarga = (iso: string): string => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

export const PLANES: PlanEval[] = [
  {
    id: 1, materia: "Biología", seccion: "5.º Año A", docente: "Prof. María Fernández", estado: "activo", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-06", evaluacion: "Examen · Unidad 1", tipo: "Examen", porcentaje: 25 },
      { fecha: "2026-07-15", evaluacion: "Taller de laboratorio", tipo: "Taller", porcentaje: 20 },
      { fecha: "2026-07-27", evaluacion: "Exposición grupal", tipo: "Exposición", porcentaje: 25 },
      { fecha: "2026-08-10", evaluacion: "Examen final del lapso", tipo: "Examen", porcentaje: 30 },
    ],
  },
  {
    id: 2, materia: "Ciencias Naturales", seccion: "4.º Año B", docente: "Prof. José Rangel", estado: "en revisión", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-07", evaluacion: "Prueba corta", tipo: "Examen", porcentaje: 20 },
      { fecha: "2026-07-09", evaluacion: "Proyecto ecológico", tipo: "Proyecto", porcentaje: 40 },
      { fecha: "2026-07-24", evaluacion: "Examen del lapso", tipo: "Examen", porcentaje: 40 },
    ],
  },
  {
    id: 3, materia: "Química", seccion: "5.º Año B", docente: "Prof. Carmen Ortega", estado: "activo", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-08", evaluacion: "Informe de práctica", tipo: "Taller", porcentaje: 30 },
      { fecha: "2026-07-20", evaluacion: "Examen · Estequiometría", tipo: "Examen", porcentaje: 35 },
      { fecha: "2026-08-03", evaluacion: "Examen final", tipo: "Examen", porcentaje: 35 },
    ],
  },
  {
    id: 4, materia: "Física", seccion: "5.º Año A", docente: "Prof. Luis Guerra", estado: "en revisión", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-10", evaluacion: "Taller de cinemática", tipo: "Taller", porcentaje: 25 },
      { fecha: "2026-07-13", evaluacion: "Exposición de proyectos", tipo: "Exposición", porcentaje: 25 },
      { fecha: "2026-07-28", evaluacion: "Examen del lapso", tipo: "Examen", porcentaje: 50 },
    ],
  },
  {
    id: 5, materia: "Matemáticas", seccion: "3.º Año C", docente: "Prof. Ana Díaz", estado: "activo", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-06", evaluacion: "Quiz de álgebra", tipo: "Examen", porcentaje: 20 },
      { fecha: "2026-07-22", evaluacion: "Taller de funciones", tipo: "Taller", porcentaje: 30 },
      { fecha: "2026-08-05", evaluacion: "Examen final", tipo: "Examen", porcentaje: 50 },
    ],
  },
  {
    id: 6, materia: "Historia", seccion: "4.º Año A", docente: "Prof. Gabriel Suárez", estado: "activo", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-09", evaluacion: "Línea de tiempo", tipo: "Taller", porcentaje: 25 },
      { fecha: "2026-07-21", evaluacion: "Ensayo histórico", tipo: "Proyecto", porcentaje: 35 },
      { fecha: "2026-08-04", evaluacion: "Examen del lapso", tipo: "Examen", porcentaje: 40 },
    ],
  },
  {
    id: 7, materia: "Castellano", seccion: "1.º Año A", docente: "Prof. Rosa Elena Díaz", estado: "en revisión", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-11", evaluacion: "Comprensión lectora", tipo: "Examen", porcentaje: 30 },
      { fecha: "2026-07-25", evaluacion: "Exposición oral", tipo: "Exposición", porcentaje: 30 },
      { fecha: "2026-08-08", evaluacion: "Redacción final", tipo: "Proyecto", porcentaje: 40 },
    ],
  },
  {
    id: 8, materia: "Inglés", seccion: "2.º Año B", docente: "Prof. Karina Suárez", estado: "activo", plantilla: "Plantilla estándar",
    evaluaciones: [
      { fecha: "2026-07-12", evaluacion: "Vocabulary quiz", tipo: "Examen", porcentaje: 20 },
      { fecha: "2026-07-23", evaluacion: "Speaking activity", tipo: "Exposición", porcentaje: 30 },
      { fecha: "2026-08-06", evaluacion: "Final exam", tipo: "Examen", porcentaje: 50 },
    ],
  },
];
