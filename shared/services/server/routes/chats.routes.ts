/**
 * Rutas maquetadas del dominio Chats (conversaciones / mensajería).
 * Se auto-registran en el router mediante `import.meta.glob` (ver ../router.ts).
 *
 * Solo lectura: la lista de conversaciones. La helper pura `nowTime` NO se
 * expone como endpoint: las páginas la importan directo de la data.
 */

import { defineRoutes } from "../types";
import { CONVERSATIONS } from "../../data/chats";

export const routes = defineRoutes([
  {
    method: "get",
    path: "/chats",
    description: "Lista de conversaciones (mensajería) del usuario.",
    handler: () => CONVERSATIONS,
  },
]);
