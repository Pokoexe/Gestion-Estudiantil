/* ------------------------------------------------------------------ */
/* Configuración de la plantilla del plan de evaluación                */
/* ------------------------------------------------------------------ */

export type CampoTipo = "Texto" | "Número" | "Fecha" | "Selección" | "Sí / No";

export interface Campo {
  id: number;
  nombre: string;
  tipo: CampoTipo;
}

export const TIPOS: CampoTipo[] = ["Texto", "Número", "Fecha", "Selección", "Sí / No"];

/** Campos por defecto que llenarán los docentes. Todos son obligatorios. */
export const CAMPOS_DEFAULT: Campo[] = [
  { id: 1, nombre: "Materia", tipo: "Texto" },
  { id: 2, nombre: "Sección", tipo: "Selección" },
  { id: 3, nombre: "Docente responsable", tipo: "Texto" },
  { id: 4, nombre: "Lapso", tipo: "Selección" },
  { id: 5, nombre: "Objetivo / competencia", tipo: "Texto" },
  { id: 6, nombre: "Tipo de evaluación", tipo: "Selección" },
  { id: 7, nombre: "Ponderación (%)", tipo: "Número" },
  { id: 8, nombre: "Fecha de aplicación", tipo: "Fecha" },
];
