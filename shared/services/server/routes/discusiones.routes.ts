/**
 * Rutas maquetadas del dominio Discusiones (postulaciones para discusión de notas).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Los endpoints mutadores reutilizan las funciones que mutan el store en
 * memoria (`postularEstudiante`, `decidirPostulacion`) y devuelven el estado
 * actualizado de `POSTULACIONES`.
 */

import { defineRoutes } from "../types";
import {
  POSTULACIONES,
  MATERIAS_DISCUSION,
  ANIOS_DISCUSION,
  postularEstudiante,
  decidirPostulacion,
  type Postulacion,
} from "../../data/discusiones";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/discusiones/postulaciones",
    description: "Lista de postulaciones para discusión de notas ante el Concejo.",
    handler: () => POSTULACIONES,
  },
  {
    method: "get",
    path: "/discusiones/materias",
    description: "Materias disponibles para postular una discusión.",
    handler: () => MATERIAS_DISCUSION,
  },
  {
    method: "get",
    path: "/discusiones/anios",
    description: "Años / secciones disponibles para postular una discusión.",
    handler: () => ANIOS_DISCUSION,
  },
  {
    method: "post",
    path: "/discusiones/postular",
    description: "El evaluador postula un estudiante ante el Concejo (queda Pendiente).",
    handler: ({ body }) => {
      postularEstudiante(body as Omit<Postulacion, "id" | "estado">);
      return POSTULACIONES;
    },
  },
  {
    method: "patch",
    path: "/discusiones/postulaciones/:id/decidir",
    description: "El Concejo decide (acepta o rechaza) una postulación pendiente.",
    handler: ({ params, body }) => {
      const { estado, observacion } = body as {
        estado: "Aceptada" | "Rechazada";
        observacion: string;
      };
      decidirPostulacion(Number(params.id), estado, observacion ?? "");
      return POSTULACIONES;
    },
  },
]);
