/**
 * Router del "servidor" maquetado.
 *
 * Recolecta AUTOMÁTICAMENTE todas las tablas de rutas declaradas en
 * `./routes/*.routes.ts` usando `import.meta.glob` de Vite. Así, para añadir
 * nuevos "endpoints" basta con crear un archivo `<dominio>.routes.ts` dentro de
 * `./routes/` que exporte `routes` (o `default`): no hay ningún agregador
 * central que editar.
 */

import type { MockRoute, RouteMatch } from "./types";

// Recolección en tiempo de compilación de todos los módulos de rutas.
const modules = import.meta.glob<{ routes?: MockRoute[]; default?: MockRoute[] }>(
  "./routes/*.routes.ts",
  { eager: true },
);

/** Todas las rutas registradas por los distintos dominios. */
export const ALL_ROUTES: MockRoute[] = Object.values(modules).flatMap(
  (m) => m.routes ?? m.default ?? [],
);

interface Compiled {
  route: MockRoute;
  regex: RegExp;
  keys: string[];
}

function compile(path: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  const pattern = path.replace(/:[^/]+/g, (m) => {
    keys.push(m.slice(1));
    return "([^/]+)";
  });
  return { regex: new RegExp(`^${pattern}/?$`), keys };
}

const compiled: Compiled[] = ALL_ROUTES.map((route) => ({ route, ...compile(route.path) }));

/**
 * Busca la primera ruta que coincide con `method` + `path`.
 * Devuelve el handler y los parámetros de ruta extraídos, o `null` si no hay match.
 */
export function resolveRoute(method: string, path: string): RouteMatch | null {
  const clean = path.split("?")[0];
  const m = method.toLowerCase();
  for (const c of compiled) {
    if (c.route.method !== m) continue;
    const match = clean.match(c.regex);
    if (!match) continue;
    const params: Record<string, string> = {};
    c.keys.forEach((k, i) => {
      params[k] = decodeURIComponent(match[i + 1]);
    });
    return { handler: c.route.handler, params };
  }
  return null;
}
