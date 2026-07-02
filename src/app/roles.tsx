import type { LucideIcon } from "lucide-react";
import {
  Home,
  Layers,
  Calendar,
  BarChart2,
  Star,
  CreditCard,
  MessageSquare,
  Users,
  ClipboardList,
  CheckSquare,
  ClipboardCheck,
  FileCheck2,
  CalendarClock,
  FileText,
  Gavel,
  LayoutTemplate,
  Wallet,
  Receipt,
  Package,
  PieChart,
  GraduationCap,
  Building2,
  Landmark,
  UserCog,
  Activity,
  ScrollText,
  Plug,
  Settings,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { color } from "./theme/tokens";

export type RoleId =
  | "estudiante"
  | "docente"
  | "coordinador"
  | "evaluador"
  | "tesoreria"
  | "director"
  | "programador";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  /** Ruta relativa a la base del rol ("" = índice / panel principal). */
  to: string;
  /** true si la vista ya está construida (navegable). */
  ready?: boolean;
}

export interface RoleConfig {
  id: RoleId;
  /** Nombre del rol tal como se muestra. */
  label: string;
  /** Descripción corta para el selector del login. */
  blurb: string;
  /** Ícono del rol (selector y encabezados). */
  icon: LucideIcon;
  /** Acento visual (solo para el selector de roles). */
  accent: string;
  /** Persona de demostración. */
  user: { name: string; initials: string; roleLabel: string };
  /** Título que aparece en el encabezado del panel principal. */
  homeTitle: string;
  nav: NavItem[];
}

export const ROLES: Record<RoleId, RoleConfig> = {
  estudiante: {
    id: "estudiante",
    label: "Estudiante",
    blurb: "Horario, notas, solvencia, plan de evaluación y actividades.",
    icon: GraduationCap,
    accent: color.primary,
    user: { name: "Carlos Mendoza", initials: "CM", roleLabel: "Estudiante · 4.º Año B" },
    homeTitle: "Panel del Estudiante",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: Layers, label: "Mis materias", to: "materias", ready: true },
      { icon: Calendar, label: "Horario", to: "horario" },
      { icon: BarChart2, label: "Calificaciones", to: "calificaciones" },
      { icon: Star, label: "Extracurriculares", to: "extracurriculares" },
      { icon: CreditCard, label: "Pagos", to: "pagos" },
      { icon: MessageSquare, label: "Mensajes", to: "mensajes" },
    ],
  },

  docente: {
    id: "docente",
    label: "Docente",
    blurb: "Secciones asignadas, asistencia, notas y planes de evaluación.",
    icon: BookOpen,
    accent: "#0ea5e9",
    user: { name: "Prof. Alejandro Morales", initials: "AM", roleLabel: "Docente · Ciencias Naturales" },
    homeTitle: "Panel del Docente",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: Users, label: "Mis secciones", to: "secciones" },
      { icon: Calendar, label: "Horario", to: "horario" },
      { icon: ClipboardList, label: "Planes de evaluación", to: "planes" },
      { icon: CheckSquare, label: "Asistencia", to: "asistencia" },
      { icon: BarChart2, label: "Calificaciones", to: "calificaciones" },
      { icon: MessageSquare, label: "Mensajes", to: "mensajes" },
    ],
  },

  coordinador: {
    id: "coordinador",
    label: "Coordinador",
    blurb: "Reuniones, actividades, planificaciones, incidencias y personas.",
    icon: CalendarDays,
    accent: "#7c3aed",
    user: { name: "Lic. Marta Sánchez", initials: "MS", roleLabel: "Coordinación Académica" },
    homeTitle: "Panel de Coordinación",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: CalendarDays, label: "Reuniones", to: "reuniones" },
      { icon: Star, label: "Actividades", to: "actividades" },
      { icon: ClipboardCheck, label: "Planificaciones", to: "planificaciones" },
      { icon: FileText, label: "Incidencias", to: "incidencias" },
      { icon: Layers, label: "Secciones y materias", to: "secciones" },
      { icon: Users, label: "Personas", to: "personas" },
    ],
  },

  evaluador: {
    id: "evaluador",
    label: "Evaluador",
    blurb: "Revisión de exámenes, cronograma, boletines y discusión de notas.",
    icon: FileCheck2,
    accent: "#0d9488",
    user: { name: "Ing. Rafael Ortega", initials: "RO", roleLabel: "Departamento de Evaluación" },
    homeTitle: "Panel de Evaluación",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: FileCheck2, label: "Revisiones", to: "revisiones" },
      { icon: CalendarClock, label: "Cronograma", to: "cronograma" },
      { icon: FileText, label: "Boletines", to: "boletines" },
      { icon: Gavel, label: "Discusión de notas", to: "discusion" },
      { icon: LayoutTemplate, label: "Plantillas", to: "plantillas" },
    ],
  },

  tesoreria: {
    id: "tesoreria",
    label: "Tesorería",
    blurb: "Pagos en 3 monedas, solvencia, confirmaciones e inventario.",
    icon: Wallet,
    accent: "#16a34a",
    user: { name: "Sra. Lucía Peña", initials: "LP", roleLabel: "Administración · Tesorería" },
    homeTitle: "Panel de Tesorería",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: CreditCard, label: "Pagos", to: "pagos" },
      { icon: Receipt, label: "Solvencia", to: "solvencia" },
      { icon: ClipboardCheck, label: "Por confirmar", to: "confirmar" },
      { icon: Package, label: "Inventario", to: "inventario" },
      { icon: PieChart, label: "Reportes", to: "reportes" },
    ],
  },

  director: {
    id: "director",
    label: "Director",
    blurb: "Visión global: académico, finanzas, personal y actividades.",
    icon: Building2,
    accent: "#b45309",
    user: { name: "Dra. Elena Vargas", initials: "EV", roleLabel: "Dirección General" },
    homeTitle: "Panel de Dirección",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: GraduationCap, label: "Académico", to: "academico" },
      { icon: Landmark, label: "Finanzas", to: "finanzas" },
      { icon: Users, label: "Personal", to: "personal" },
      { icon: Star, label: "Actividades", to: "actividades" },
      { icon: PieChart, label: "Reportes", to: "reportes" },
    ],
  },

  programador: {
    id: "programador",
    label: "Programador",
    blurb: "Usuarios y roles, estado del sistema, registros y configuración.",
    icon: Settings,
    accent: "#334155",
    user: { name: "Admin del Sistema", initials: "SA", roleLabel: "Programador · Soporte técnico" },
    homeTitle: "Panel del Sistema",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: UserCog, label: "Usuarios y roles", to: "usuarios" },
      { icon: Activity, label: "Estado del sistema", to: "estado" },
      { icon: ScrollText, label: "Registros", to: "registros" },
      { icon: Plug, label: "Integraciones", to: "integraciones" },
      { icon: Settings, label: "Configuración", to: "configuracion" },
    ],
  },
};

export const ROLE_ORDER: RoleId[] = [
  "estudiante",
  "docente",
  "coordinador",
  "evaluador",
  "tesoreria",
  "director",
  "programador",
];

/** Deriva el rol activo a partir del primer segmento de la URL. */
export function roleFromPath(pathname: string): RoleId {
  const seg = pathname.split("/").filter(Boolean)[0] as RoleId | undefined;
  return seg && seg in ROLES ? seg : "estudiante";
}
