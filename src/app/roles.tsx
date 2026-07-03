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
  Wrench,
  IdCard,
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
      { icon: IdCard, label: "Datos del estudiante", to: "datos", ready: true },
      { icon: Layers, label: "Mis materias", to: "materias", ready: true },
      { icon: Wrench, label: "Reparación", to: "reparacion", ready: true },
      { icon: BarChart2, label: "Calificaciones", to: "calificaciones", ready: true },
      { icon: ClipboardList, label: "Mis evaluaciones", to: "evaluaciones", ready: true },
      { icon: BookOpen, label: "Cursos y actividades", to: "cursos", ready: true },
      { icon: CreditCard, label: "Pagos", to: "pagos", ready: true },
      { icon: MessageSquare, label: "Mensajes", to: "mensajes", ready: true },
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
      { icon: Users, label: "Mis secciones", to: "secciones", ready: true },
      { icon: Calendar, label: "Horario", to: "horario", ready: true },
      { icon: ClipboardList, label: "Planes de evaluación", to: "planes", ready: true },
      { icon: CheckSquare, label: "Asistencia", to: "asistencia", ready: true },
      { icon: BarChart2, label: "Calificaciones", to: "calificaciones", ready: true },
      { icon: MessageSquare, label: "Mensajes", to: "mensajes", ready: true },
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
      { icon: CalendarDays, label: "Reuniones", to: "reuniones", ready: true },
      { icon: Star, label: "Actividades", to: "actividades", ready: true },
      { icon: ClipboardCheck, label: "Planificaciones", to: "planificaciones", ready: true },
      { icon: FileText, label: "Incidencias", to: "incidencias", ready: true },
      { icon: Layers, label: "Secciones y materias", to: "secciones", ready: true },
      { icon: Users, label: "Personas", to: "personas", ready: true },
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
      { icon: FileCheck2, label: "Revisiones", to: "revisiones", ready: true },
      { icon: CalendarClock, label: "Cronograma", to: "cronograma", ready: true },
      { icon: FileText, label: "Boletines", to: "boletines", ready: true },
      { icon: Gavel, label: "Discusión de notas", to: "discusion", ready: true },
      { icon: LayoutTemplate, label: "Plantillas", to: "plantillas", ready: true },
    ],
  },

  tesoreria: {
    id: "tesoreria",
    label: "Administración",
    blurb: "Pagos en 3 monedas, solvencia, confirmaciones e inventario.",
    icon: Wallet,
    accent: "#16a34a",
    user: { name: "Sra. Lucía Peña", initials: "LP", roleLabel: "Administración · Tesorería" },
    homeTitle: "Panel de Administración",
    nav: [
      { icon: Home, label: "Inicio", to: "", ready: true },
      { icon: CreditCard, label: "Pagos", to: "pagos", ready: true },
      { icon: Receipt, label: "Solvencia", to: "solvencia", ready: true },
      { icon: ClipboardCheck, label: "Por confirmar", to: "confirmar", ready: true },
      { icon: Package, label: "Inventario", to: "inventario", ready: true },
      { icon: PieChart, label: "Reportes", to: "reportes", ready: true },
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
      { icon: GraduationCap, label: "Académico", to: "academico", ready: true },
      { icon: Landmark, label: "Finanzas", to: "finanzas", ready: true },
      { icon: Users, label: "Personal", to: "personal", ready: true },
      { icon: Star, label: "Actividades", to: "actividades", ready: true },
      { icon: PieChart, label: "Reportes", to: "reportes", ready: true },
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
