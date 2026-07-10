/**
 * Tipos del "servidor" maquetado.
 *
 * El adapter de axios (ver ../client.ts) resuelve cada petición contra una
 * tabla de rutas (ver ./router.ts). Cada ruta declara su método, su path (con
 * parámetros estilo `:id`) y un handler que devuelve los datos maquetados.
 */

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

/** Contexto que recibe el handler de una ruta al resolverse una petición. */
export interface MockRequestCtx {
  /** Parámetros de ruta extraídos del path (p. ej. `/materias/:id` → `{ id }`). */
  params: Record<string, string>;
  /** Query string (`config.params` de axios). */
  query: Record<string, unknown>;
  /** Cuerpo de la petición (POST/PUT/PATCH), ya parseado. */
  body: any;
}

export type RouteHandler = (ctx: MockRequestCtx) => unknown | Promise<unknown>;

export interface MockRoute {
  method: HttpMethod;
  /** Path relativo al baseURL, con parámetros `:param`. Ej: `/estudiante/materias`. */
  path: string;
  handler: RouteHandler;
  /** Descripción corta para la documentación de endpoints (ENDPOINTS.md). */
  description?: string;
}

export interface RouteMatch {
  handler: RouteHandler;
  params: Record<string, string>;
}

/** Azúcar para declarar rutas con tipado en cada archivo `*.routes.ts`. */
export function defineRoutes(routes: MockRoute[]): MockRoute[] {
  return routes;
}
