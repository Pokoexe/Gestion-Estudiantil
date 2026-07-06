/**
 * Punto de entrada de la capa de datos maquetados.
 *
 * Las páginas normalmente importan:
 *   - `useFetch` desde aquí, y
 *   - las funciones-action + tipos desde `./actions/<dominio>`.
 *
 * Ejemplo:
 *   import { useFetch } from "../datos_maquetados";
 *   import { getMaterias, type Subject } from "../datos_maquetados/actions/estudiante";
 */

export { api, API_BASE_URL, MOCK_LATENCY_MS } from "./client";
export { useFetch, type FetchState } from "./useFetch";
export {
  getSession,
  setSession,
  getAuthHeader,
  MOCK_SESSION,
  type Session,
  type MockUser,
  type RoleId,
} from "./session";
