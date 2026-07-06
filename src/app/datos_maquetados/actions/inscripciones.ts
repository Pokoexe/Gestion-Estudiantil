/**
 * Actions del dominio Inscripciones — SDK cliente de los "endpoints" maquetados.
 *
 * Lecturas (`api.get`): la lista de inscripciones y la serie mensual del gráfico.
 *
 * La cuota de inscripción (`INSCRIPCION_FEE`) y las config presentacionales
 * (`TIPO_META`, `ESTADO_META`) NO se envuelven en endpoint: las páginas las
 * siguen importando directamente desde `../data/inscripciones`. La mutación de
 * aceptar/rechazar se hace en sitio sobre el store, tal como en la maqueta.
 */

import { api } from "../client";
import type { Inscripcion } from "../data/inscripciones";

export type { Inscripcion, InscripcionEstado, InscripcionTipo } from "../data/inscripciones";

/** Punto de la serie mensual de inscripciones. */
export interface InscripcionChartPoint {
  mes: string;
  nuevos: number;
  reinscritos: number;
}

/** GET /inscripciones — lista de inscripciones del panel del Director. */
export async function getInscripciones(): Promise<Inscripcion[]> {
  const { data } = await api.get<Inscripcion[]>("/inscripciones");
  return data;
}

/** GET /inscripciones/serie — serie mensual: nuevos vs. reinscritos. */
export async function getInscripcionesChart(): Promise<InscripcionChartPoint[]> {
  const { data } = await api.get<InscripcionChartPoint[]>("/inscripciones/serie");
  return data;
}
