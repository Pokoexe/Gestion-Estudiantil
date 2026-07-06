/**
 * Rutas maquetadas del dominio Inscripciones (panel del Director).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lecturas: la lista de inscripciones y la serie mensual del gráfico. La
 * cuota (`INSCRIPCION_FEE`) y las config presentacionales (`TIPO_META`,
 * `ESTADO_META`) NO se exponen como endpoints: las páginas las importan directo.
 * La mutación de aceptar/rechazar la hacen las páginas en sitio sobre el store.
 */

import { defineRoutes } from "../types";
import { INSCRIPCIONES, INSCRIPCION_CHART } from "../../data/inscripciones";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/inscripciones",
    description: "Lista de inscripciones del panel del Director.",
    handler: () => INSCRIPCIONES,
  },
  {
    method: "get",
    path: "/inscripciones/serie",
    description: "Serie mensual de inscripciones: estudiantes nuevos vs. reinscritos.",
    handler: () => INSCRIPCION_CHART,
  },
]);
