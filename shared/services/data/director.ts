/**
 * Datos maquetados del rol Director.
 *
 * Reúne los datos estáticos que antes vivían incrustados en las páginas del
 * director (dashboard ejecutivo, panorama académico, finanzas globales, cursos
 * y actividades extracurriculares y gestión de personal). Los expone el
 * "servidor" maquetado a través de las rutas de `../server/routes/director.routes.ts`.
 *
 * Solo se mueven las SERIES DE DATOS (registros que representan contenido puro).
 * Los mapas presentacionales (metadatos de estado, acentos, íconos, plantillas
 * de columnas y listas de opciones) permanecen en cada página.
 *
 * NOTA: las páginas de Inscripciones del Director (lista y detalle) reutilizan
 * el dominio compartido `../data/inscripciones` — no se recrean aquí.
 */

import type { LapsoId } from "./lapsos";

/* ================================================================== */
/* Dashboard ejecutivo (DirectorDashboard)                             */
/* ================================================================== */

/** Punto de la serie de matrícula y asistencia mensual. */
export interface EnrollmentPoint {
  mes: string;
  matricula: number;
  asistencia: number;
}

export const ENROLLMENT: EnrollmentPoint[] = [
  { mes: "Feb", matricula: 574, asistencia: 88 },
  { mes: "Mar", matricula: 586, asistencia: 90 },
  { mes: "Abr", matricula: 595, asistencia: 89 },
  { mes: "May", matricula: 601, asistencia: 92 },
  { mes: "Jun", matricula: 608, asistencia: 91 },
  { mes: "Jul", matricula: 612, asistencia: 93 },
];

/** Punto de la serie financiera: recaudado por moneda vs. sin pagar. */
export interface FinancePoint {
  mes: string;
  usd: number;
  cop: number;
  bs: number;
  sinPagar: number;
}

export const FINANCE: FinancePoint[] = [
  { mes: "Feb", usd: 6200, cop: 5400, bs: 4300, sinPagar: 3100 },
  { mes: "Mar", usd: 6800, cop: 5900, bs: 4700, sinPagar: 2900 },
  { mes: "Abr", usd: 7100, cop: 6300, bs: 5100, sinPagar: 3300 },
  { mes: "May", usd: 7600, cop: 6800, bs: 5400, sinPagar: 2600 },
  { mes: "Jun", usd: 8100, cop: 7000, bs: 5800, sinPagar: 2800 },
  { mes: "Jul", usd: 8450, cop: 7280, bs: 6120, sinPagar: 2380 },
];

/** Próximas actividades mostradas en el dashboard. */
export interface DashActivity {
  name: string;
  type: "Deportiva" | "Cultural" | "Académica";
  date: string;
  owner: string;
}

export const ACTIVITIES: DashActivity[] = [
  { name: "Feria de Ciencias", type: "Académica", date: "12 jul 2026", owner: "Prof. Alejandro Morales" },
  { name: "Torneo interseccional de fútbol", type: "Deportiva", date: "18 jul 2026", owner: "Prof. Ricardo Salas" },
  { name: "Festival de talentos", type: "Cultural", date: "24 jul 2026", owner: "Prof. Daniela Herrera" },
  { name: "Olimpiada de Matemática", type: "Académica", date: "30 jul 2026", owner: "Prof. Carmen Villalobos" },
];

/** Hitos del cierre de lapso (dashboard). */
export interface Milestone {
  label: string;
  done: boolean;
}

export const MILESTONES: Milestone[] = [
  { label: "Notas cargadas", done: true },
  { label: "Boletines generados", done: true },
  { label: "Discusiones de casos", done: false },
];

/* ================================================================== */
/* Panorama académico (DirAcademicoPage)                               */
/* ================================================================== */

/** Fila de la tabla de secciones por año. */
export interface SectionRow {
  year: string;
  section: string;
  students: number;
  average: number;
  attendance: number;
}

export const SECTIONS: SectionRow[] = [
  { year: "1.º Año", section: "A / B / C", students: 96, average: 16.4, attendance: 94 },
  { year: "2.º Año", section: "A / B / C", students: 90, average: 15.9, attendance: 92 },
  { year: "3.º Año", section: "A / B / C", students: 88, average: 15.2, attendance: 89 },
  { year: "4.º Año", section: "A / B / C", students: 84, average: 15.6, attendance: 90 },
  { year: "5.º Año", section: "A / B / C", students: 79, average: 16.1, attendance: 93 },
  { year: "6.º Año", section: "A / B", students: 58, average: 14.8, attendance: 87 },
];

/** Punto del gráfico de rendimiento por año. */
export interface PerformancePoint {
  anio: string;
  promedio: number;
}

export const PERFORMANCE: PerformancePoint[] = [
  { anio: "1.º", promedio: 16.4 },
  { anio: "2.º", promedio: 15.9 },
  { anio: "3.º", promedio: 15.2 },
  { anio: "4.º", promedio: 15.6 },
  { anio: "5.º", promedio: 16.1 },
  { anio: "6.º", promedio: 14.8 },
];

/** Punto del gráfico de rendimiento por lapso. */
export interface RendimientoLapsoPoint {
  lapso: string;
  promedio: number;
}

export const RENDIMIENTO_LAPSO: RendimientoLapsoPoint[] = [
  { lapso: "Lapso I", promedio: 15.1 },
  { lapso: "Lapso II", promedio: 15.6 },
  { lapso: "Lapso III", promedio: 15.8 },
];

/** Punto del gráfico de asistencia mensual. */
export interface AsistenciaMesPoint {
  mes: string;
  asistencia: number;
}

export const ASISTENCIA_MES: AsistenciaMesPoint[] = [
  { mes: "Feb", asistencia: 88 },
  { mes: "Mar", asistencia: 90 },
  { mes: "Abr", asistencia: 89 },
  { mes: "May", asistencia: 92 },
  { mes: "Jun", asistencia: 91 },
  { mes: "Jul", asistencia: 93 },
];

/** Ajustes agregados aplicados según el lapso seleccionado. */
export interface AcademicoLapsoAjustes {
  promedioPorLapso: Record<LapsoId, number>;
  deltaPromedio: Record<LapsoId, number>;
  deltaAsistencia: Record<LapsoId, number>;
}

export const ACADEMICO_LAPSO_AJUSTES: AcademicoLapsoAjustes = {
  promedioPorLapso: { 1: 15.1, 2: 15.6, 3: 15.8 },
  deltaPromedio: { 1: -0.5, 2: 0, 3: 0.2 },
  deltaAsistencia: { 1: -2, 2: 0, 3: 1 },
};

/** Incidencia reciente mostrada en el panorama académico. */
export interface Incident {
  who: string;
  role: "Docente" | "Estudiante";
  detail: string;
  date: string;
  level: "alta" | "media" | "baja";
}

export const INCIDENTS: Incident[] = [
  { who: "Prof. Ricardo Salas", role: "Docente", detail: "Retraso reiterado en carga de notas", date: "1 jul", level: "media" },
  { who: "Luis Fernández — 4.º B", role: "Estudiante", detail: "Ausencia injustificada (3 días)", date: "30 jun", level: "alta" },
  { who: "María Colmenares — 5.º A", role: "Estudiante", detail: "Incidente disciplinario en aula", date: "29 jun", level: "media" },
  { who: "Prof. Daniela Herrera", role: "Docente", detail: "Solicitud de permiso académico", date: "28 jun", level: "baja" },
];

/* ================================================================== */
/* Finanzas globales (DirFinanzasPage)                                 */
/* ================================================================== */

/** Punto de la serie de ingresos mensuales (equivalente en USD). */
export interface MonthlyIncomePoint {
  mes: string;
  ingresos: number;
}

export const MONTHLY: MonthlyIncomePoint[] = [
  { mes: "Feb", ingresos: 6800 },
  { mes: "Mar", ingresos: 7250 },
  { mes: "Abr", ingresos: 7020 },
  { mes: "May", ingresos: 7980 },
  { mes: "Jun", ingresos: 8210 },
  { mes: "Jul", ingresos: 8450 },
];

/** Representante deudor. */
export interface Debtor {
  id: number;
  name: string;
  student: string;
  months: number;
  amount: string;
  phone: string;
}

export const DEBTORS: Debtor[] = [
  { id: 1, name: "Carmen Rojas", student: "Luis Fernández — 4.º B", months: 3, amount: "600 USD", phone: "0414-123..." },
  { id: 2, name: "Pedro Malavé", student: "Andrea Malavé — 2.º A", months: 2, amount: "400 USD", phone: "0424-556..." },
  { id: 3, name: "Yolanda Pérez", student: "Diego Pérez — 5.º C", months: 4, amount: "800 USD", phone: "0416-778..." },
  { id: 4, name: "José Guerra", student: "Marta Guerra — 1.º B", months: 1, amount: "200 USD", phone: "0412-990..." },
];

/** Pago por confirmar. */
export interface PendingPayment {
  id: number;
  rep: string;
  amount: string;
  method: string;
  date: string;
}

export const PENDING: PendingPayment[] = [
  { id: 1, rep: "Ana Beltrán", amount: "200 USD", method: "Zelle", date: "2 jul 2026" },
  { id: 2, rep: "Luis Contreras", amount: "7.300 Bs.", method: "Pago Móvil", date: "1 jul 2026" },
  { id: 3, rep: "María Salcedo", amount: "780.000 COP", method: "Nequi", date: "1 jul 2026" },
];

/* ================================================================== */
/* Cursos y actividades extracurriculares (DirActividadesPage)         */
/* ================================================================== */

export type ActType = "Deportiva" | "Cultural" | "Académica" | "Curso";
export type ActStatus = "Activa" | "Por aceptar";

export interface Activity {
  id: number;
  name: string;
  type: ActType;
  teacher: string;
  enrolled: number;
  capacity: number;
  status: ActStatus;
}

export const ACTIVIDADES: Activity[] = [
  { id: 1, name: "Escuela de fútbol", type: "Deportiva", teacher: "Prof. Ricardo Salas", enrolled: 28, capacity: 30, status: "Activa" },
  { id: 2, name: "Coro estudiantil", type: "Cultural", teacher: "Prof. Daniela Herrera", enrolled: 22, capacity: 25, status: "Activa" },
  { id: 3, name: "Club de robótica", type: "Académica", teacher: "Prof. Alejandro Morales", enrolled: 18, capacity: 20, status: "Activa" },
  { id: 4, name: "Curso de nivelación de Matemática", type: "Curso", teacher: "Prof. Carmen Villalobos", enrolled: 15, capacity: 24, status: "Activa" },
  { id: 5, name: "Taller de teatro", type: "Cultural", teacher: "Prof. Gustavo Peña", enrolled: 9, capacity: 20, status: "Por aceptar" },
  { id: 6, name: "Ajedrez competitivo", type: "Deportiva", teacher: "Prof. Marisol Rangel", enrolled: 12, capacity: 16, status: "Por aceptar" },
];

/* ================================================================== */
/* Gestión de personal (DirPersonalPage)                               */
/* ================================================================== */

export type TeacherState = "Activo" | "Permiso" | "Suplente";

export interface Teacher {
  id: number;
  name: string;
  area: string;
  sections: number;
  attendance: number;
  state: TeacherState;
}

export const TEACHERS: Teacher[] = [
  { id: 1, name: "Alejandro Morales", area: "Ciencias Naturales", sections: 5, attendance: 97, state: "Activo" },
  { id: 2, name: "Carmen Villalobos", area: "Matemática", sections: 6, attendance: 95, state: "Activo" },
  { id: 3, name: "Ricardo Salas", area: "Educación Física", sections: 4, attendance: 88, state: "Activo" },
  { id: 4, name: "Daniela Herrera", area: "Castellano y Literatura", sections: 5, attendance: 92, state: "Permiso" },
  { id: 5, name: "Gustavo Peña", area: "Geografía e Historia", sections: 4, attendance: 90, state: "Activo" },
  { id: 6, name: "Marisol Rangel", area: "Inglés", sections: 6, attendance: 94, state: "Suplente" },
];

export interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  place: string;
  attendees: string;
  status: "Programada" | "Realizada";
}

export const MEETINGS: Meeting[] = [
  { id: 1, title: "Consejo docente — cierre de lapso", date: "8 jul 2026", time: "14:00", place: "Sala de profesores", attendees: "Todo el personal", status: "Programada" },
  { id: 2, title: "Coordinación académica de Ciencias", date: "10 jul 2026", time: "10:00", place: "Aula 204", attendees: "Área de Ciencias", status: "Programada" },
  { id: 3, title: "Revisión de casos disciplinarios", date: "27 jun 2026", time: "09:00", place: "Dirección", attendees: "Coordinación", status: "Realizada" },
];

export interface ScheduleRow {
  block: string;
  monday: string;
  wednesday: string;
  friday: string;
}

export const SCHEDULE: ScheduleRow[] = [
  { block: "07:00 – 08:30", monday: "A. Morales · 4.º B", wednesday: "C. Villalobos · 5.º A", friday: "R. Salas · 3.º C" },
  { block: "08:30 – 10:00", monday: "C. Villalobos · 5.º A", wednesday: "D. Herrera · 4.º A", friday: "G. Peña · 2.º B" },
  { block: "10:15 – 11:45", monday: "M. Rangel · 1.º A", wednesday: "A. Morales · 5.º B", friday: "C. Villalobos · 6.º A" },
];
