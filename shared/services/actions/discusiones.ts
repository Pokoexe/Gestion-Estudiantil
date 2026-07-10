/**
 * Actions del dominio Discusiones — SDK cliente de los "endpoints" maquetados.
 *
 * Las lecturas usan `api.get`; las mutaciones usan `api.post` / `api.patch` y
 * su handler reutiliza la función mutadora original que muta el store en
 * memoria (`postularEstudiante`, `decidirPostulacion`), devolviendo el estado
 * actualizado de las postulaciones.
 *
 * La helper pura (`fmtFechaPost`) NO se envuelve en endpoint: las páginas la
 * siguen importando directamente desde `../data/discusiones`.
 */

import { api } from "@shared/services/client";
import type { Postulacion } from "@shared/services/data/discusiones";

export type { Postulacion, PostEstado } from "@shared/services/data/discusiones";

/** GET /discusiones/postulaciones — postulaciones para discusión de notas. */
export async function getPostulaciones(): Promise<Postulacion[]> {
  const { data } = await api.get<Postulacion[]>("/discusiones/postulaciones");
  return data;
}

/** GET /discusiones/materias — materias disponibles para postular. */
export async function getMateriasDiscusion(): Promise<string[]> {
  const { data } = await api.get<string[]>("/discusiones/materias");
  return data;
}

/** GET /discusiones/anios — años / secciones disponibles para postular. */
export async function getAniosDiscusion(): Promise<string[]> {
  const { data } = await api.get<string[]>("/discusiones/anios");
  return data;
}

/**
 * POST /discusiones/postular — el evaluador postula un estudiante ante el
 * Concejo (queda Pendiente). Devuelve la lista actualizada de postulaciones.
 */
export async function postularEstudiante(
  postulacion: Omit<Postulacion, "id" | "estado">,
): Promise<Postulacion[]> {
  const { data } = await api.post<Postulacion[]>("/discusiones/postular", postulacion);
  return data;
}

/**
 * PATCH /discusiones/postulaciones/:id/decidir — el Concejo decide (acepta o
 * rechaza) una postulación pendiente. Devuelve la lista actualizada.
 */
export async function decidirPostulacion(
  id: number,
  estado: "Aceptada" | "Rechazada",
  observacion: string,
): Promise<Postulacion[]> {
  const { data } = await api.patch<Postulacion[]>(
    `/discusiones/postulaciones/${id}/decidir`,
    { estado, observacion },
  );
  return data;
}
