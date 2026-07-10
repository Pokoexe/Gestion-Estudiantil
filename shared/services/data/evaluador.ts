/* ------------------------------------------------------------------ */
/* Datos ficticios del rol EVALUADOR                                    */
/*                                                                      */
/* Solo se centralizan aquí los DATOS estáticos que vivían inline en    */
/* las páginas (métricas del dashboard, cola de revisiones). Los mapas  */
/* presentacionales (iconos, colores/tonos, clases, grid-cols) siguen   */
/* en las páginas.                                                      */
/* ------------------------------------------------------------------ */

import type { LapsoId } from "./lapsos";

/* ---------------------------- Dashboard ---------------------------- */

/** Clave estable que enlaza cada métrica/acción con su presentación en la página. */
export type DashboardKpiKey = "revisiones" | "examenes" | "boletines";
export type DashboardActionKey = "planilla" | "cronograma" | "boletin" | "discusion";

export interface DashboardKpi {
  key: DashboardKpiKey;
  value: string;
  foot: string;
}

export interface DashboardChartItem {
  estado: string;
  cantidad: number;
}

export interface EvaluadorDashboard {
  kpis: DashboardKpi[];
  /** Distribución de revisiones por estado (gráfico de barras). */
  chart: DashboardChartItem[];
}

export const DASHBOARD: EvaluadorDashboard = {
  kpis: [
    { key: "revisiones", value: "7", foot: "3 vencen esta semana" },
    { key: "examenes", value: "3", foot: "Enviados por 3 docentes" },
    { key: "boletines", value: "12", foot: "de 15 secciones" },
  ],
  chart: [
    { estado: "Pendiente", cantidad: 7 },
    { estado: "Aprobado", cantidad: 12 },
    { estado: "Cambios", cantidad: 3 },
  ],
};

/* --------------------------- Revisiones ---------------------------- */

export type RevTipo = "Exámenes" | "Planes de evaluación" | "Temas de reparación";
export type RevEstado = "Pendiente" | "Aprobado" | "Revisión solicitada";

export interface Revision {
  id: number;
  lapso: LapsoId;
  docente: string;
  materia: string;
  seccion: string;
  tipo: RevTipo;
  fecha: string;
  estado: RevEstado;
  adjunto: string;
  observacion?: string;
}

export const REVISIONES: Revision[] = [
  // Lapso II (en curso)
  { id: 1, lapso: 2, docente: "Prof. María Fernández", materia: "Biología", seccion: "5.º Año A", tipo: "Planes de evaluación", fecha: "28 jun 2026", estado: "Pendiente", adjunto: "plan_biologia_5A.pdf" },
  { id: 2, lapso: 2, docente: "Prof. José Rangel", materia: "Ciencias Naturales", seccion: "4.º Año B", tipo: "Exámenes", fecha: "27 jun 2026", estado: "Pendiente", adjunto: "examen_u3_4B.pdf" },
  { id: 3, lapso: 2, docente: "Prof. Carmen Ortega", materia: "Química", seccion: "5.º Año B", tipo: "Planes de evaluación", fecha: "25 jun 2026", estado: "Aprobado", adjunto: "plan_quimica_5B.pdf" },
  { id: 4, lapso: 2, docente: "Prof. Luis Guerra", materia: "Física", seccion: "5.º Año A", tipo: "Temas de reparación", fecha: "24 jun 2026", estado: "Revisión solicitada", adjunto: "reparacion_fisica_5A.pdf", observacion: "Faltan los objetivos de la Unidad 2 y el cronograma del período de reparación." },
  { id: 5, lapso: 2, docente: "Prof. Ana Díaz", materia: "Matemáticas", seccion: "3.º Año C", tipo: "Exámenes", fecha: "23 jun 2026", estado: "Aprobado", adjunto: "examen_lapso2_3C.pdf" },
  { id: 6, lapso: 2, docente: "Prof. Pedro Salas", materia: "Ciencias de la Tierra", seccion: "3.º Año C", tipo: "Temas de reparación", fecha: "22 jun 2026", estado: "Pendiente", adjunto: "reparacion_ct_3C.pdf" },
  { id: 7, lapso: 2, docente: "Prof. María Fernández", materia: "Biología", seccion: "4.º Año A", tipo: "Exámenes", fecha: "21 jun 2026", estado: "Pendiente", adjunto: "examen_u2_4A.pdf" },
  { id: 8, lapso: 2, docente: "Prof. Gabriel Suárez", materia: "Historia", seccion: "4.º Año B", tipo: "Planes de evaluación", fecha: "20 jun 2026", estado: "Revisión solicitada", adjunto: "plan_historia_4B.pdf", observacion: "El peso del examen final supera el 30% permitido. Ajustar la ponderación." },
  { id: 9, lapso: 2, docente: "Prof. Ana Díaz", materia: "Matemáticas", seccion: "5.º Año B", tipo: "Exámenes", fecha: "19 jun 2026", estado: "Pendiente", adjunto: "examen_u4_5B.pdf" },
  // Lapso I (finalizado) — entregas ya validadas
  { id: 10, lapso: 1, docente: "Prof. María Fernández", materia: "Biología", seccion: "5.º Año A", tipo: "Planes de evaluación", fecha: "18 may 2026", estado: "Aprobado", adjunto: "plan_biologia_5A_l1.pdf" },
  { id: 11, lapso: 1, docente: "Prof. José Rangel", materia: "Ciencias Naturales", seccion: "4.º Año B", tipo: "Exámenes", fecha: "15 may 2026", estado: "Aprobado", adjunto: "examen_u1_4B.pdf" },
];
