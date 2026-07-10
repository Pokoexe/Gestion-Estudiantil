/**
 * Cliente axios de la maqueta.
 *
 * Es una instancia REAL de axios (`api.get(...)`, `api.post(...)`, …) pero su
 * `adapter` está reemplazado por uno maquetado: en vez de salir a la red,
 * resuelve cada petición contra la tabla de rutas en memoria (ver ./server) y
 * devuelve los datos maquetados tras una latencia simulada.
 *
 * Un interceptor de petición adjunta la sesión maquetada (token Bearer) en cada
 * llamada, tal y como se haría contra un backend real. Para migrar a un backend
 * de verdad bastaría con eliminar la línea `api.defaults.adapter = mockAdapter`.
 */

import axios, {
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "./session";
import { resolveRoute } from "./server/router";

/** Prefijo común de todos los "endpoints" (solo estético, no sale a la red). */
export const API_BASE_URL = "/api";

/** Latencia simulada de cada petición, en milisegundos. 0 = sin latencia. */
export const MOCK_LATENCY_MS = 0;

export const api = axios.create({ baseURL: API_BASE_URL });

// --- Interceptor de sesión: adjunta el token maquetado en cada petición. ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token, user } = getSession();
  config.headers.set("Authorization", `Bearer ${token}`);
  config.headers.set("X-User-Role", user.role);
  return config;
});

function parseBody(data: unknown): any {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

function makeAxiosError(config: InternalAxiosRequestConfig, status: number, message: string) {
  const error = new Error(message) as Error & Record<string, unknown>;
  error.isAxiosError = true;
  error.config = config;
  error.response = {
    status,
    statusText: status === 404 ? "Not Found" : "Error",
    data: { message },
    headers: {},
    config,
  };
  return error;
}

// --- Adapter maquetado: resuelve la petición contra el "servidor" en memoria. ---
const mockAdapter: AxiosAdapter = async (config): Promise<AxiosResponse> => {
  const method = (config.method ?? "get").toLowerCase();
  let path = config.url ?? "";
  if (path.startsWith(API_BASE_URL)) path = path.slice(API_BASE_URL.length);
  if (!path.startsWith("/")) path = `/${path}`;

  // Latencia simulada (opcional) para imitar una llamada de red real.
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  }

  const match = resolveRoute(method, path);
  if (!match) {
    return Promise.reject(
      makeAxiosError(config, 404, `[mock] Sin ruta para ${method.toUpperCase()} ${path}`),
    );
  }

  const data = await match.handler({
    params: match.params,
    query: (config.params ?? {}) as Record<string, unknown>,
    body: parseBody(config.data),
  });

  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    request: {},
  } as AxiosResponse;
};

api.defaults.adapter = mockAdapter;
