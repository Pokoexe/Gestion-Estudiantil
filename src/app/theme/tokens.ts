/**
 * Tokens de diseño compartidos — extraídos de la maqueta original (EduManage).
 * Todas las vistas de todos los roles deben referenciar estos valores para
 * mantener un único sistema visual consistente.
 *
 * Idioma de la interfaz: español neutro (Latinoamérica).
 */

export const color = {
  // Marca / primario
  primary: "#1a56db",
  primaryHover: "#1447c0",
  primaryLoading: "#3b6fd4",
  primary50: "#eff6ff",
  primary100: "#dbeafe",
  primary200: "#bfdbfe",

  // Texto (tinta)
  ink: "#111827",
  ink700: "#374151",
  ink500: "#6b7280",
  ink400: "#9ca3af",
  ink300: "#d1d5db",

  // Superficies y fondos
  bg: "#f3f4f6",
  surface: "#ffffff",
  subtle: "#f9fafb",
  tintSurface: "#fafbff",

  // Bordes
  border: "#e5e7eb",
  borderSoft: "#f3f4f6",

  // Semánticos
  success: "#16a34a",
  successBg: "#dcfce7",
  warning: "#b45309",
  warningStrong: "#ca8a04",
  warningBg: "#fef9c3",
  danger: "#dc2626",
  dangerStrong: "#ef4444",
  dangerBg: "#fee2e2",
  purple: "#7c3aed",
  purpleBg: "#ede9fe",

  // Externos
  whatsapp: "#25d366",
} as const;

export const radius = {
  card: "14px",
  control: "10px",
  chip: "8px",
  pill: "99px",
} as const;

export const font = {
  h1: "1.6rem",
  h2: "1.25rem",
  h3: "1rem",
  body: "0.9375rem",
  sm: "0.875rem",
  xs: "0.8125rem",
  micro: "0.75rem",
  nano: "0.7rem",
} as const;

/** Sombra estándar para popovers / menús flotantes. */
export const shadow = {
  menu: "0 4px 16px rgba(0,0,0,0.08)",
  panel: "0 8px 24px rgba(0,0,0,0.1)",
} as const;

/** Paleta de acentos de tarjeta reutilizable (fondo + ícono). */
export const accent = {
  blue: { bg: color.primary50, fg: color.primary },
  green: { bg: color.successBg, fg: color.success },
  amber: { bg: color.warningBg, fg: color.warning },
  red: { bg: color.dangerBg, fg: color.danger },
  purple: { bg: color.purpleBg, fg: color.purple },
} as const;
