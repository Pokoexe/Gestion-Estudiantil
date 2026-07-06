/**
 * Sesión MAQUETADA (mock).
 *
 * Representa al usuario "autenticado" de la maqueta. NO implementa lógica de
 * autenticación real: es solo un objeto en memoria que el cliente axios adjunta
 * en cada petición (cabecera `Authorization: Bearer <token>`) para simular cómo
 * viajaría la sesión hacia un backend real.
 *
 * Para conectar un backend de verdad más adelante bastaría con reemplazar
 * `getSession()` por la lectura del token real (localStorage, cookie, etc.).
 */

export type RoleId =
  | "estudiante"
  | "docente"
  | "coordinador"
  | "evaluador"
  | "tesoreria"
  | "director"
  | "programador";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: RoleId;
}

export interface Session {
  /** Token JWT ficticio (no se valida en ningún sitio). */
  token: string;
  user: MockUser;
}

/** Sesión activa por defecto de la maqueta. */
export const MOCK_SESSION: Session = {
  token: "mock.jwt.eyJzdWIiOiJ1LTAwMSIsInJvbGUiOiJlc3R1ZGlhbnRlIn0.demo",
  user: {
    id: "u-001",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@edugestion.edu",
    role: "estudiante",
  },
};

let current: Session = MOCK_SESSION;

/** Devuelve la sesión maquetada activa. */
export function getSession(): Session {
  return current;
}

/**
 * Cambia la sesión activa (útil para explorar la maqueta como otro rol).
 * No persiste ni valida nada.
 */
export function setSession(session: Session): void {
  current = session;
}

/** Cabecera de autorización con el token de la sesión maquetada. */
export function getAuthHeader(): Record<string, string> {
  return { Authorization: `Bearer ${current.token}` };
}
