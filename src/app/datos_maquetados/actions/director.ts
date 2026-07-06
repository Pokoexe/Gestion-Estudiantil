/**
 * Actions del rol Director — SDK cliente de los "endpoints" maquetados.
 *
 * Cada función simula una llamada real a un endpoint usando axios (`api.get`),
 * con la sesión adjunta por el interceptor. Devuelven directamente el `data` de
 * la respuesta para que las páginas las consuman con `useFetch`.
 */

import { api } from "../client";
import type {
  EnrollmentPoint,
  FinancePoint,
  DashActivity,
  Milestone,
  SectionRow,
  PerformancePoint,
  RendimientoLapsoPoint,
  AsistenciaMesPoint,
  AcademicoLapsoAjustes,
  Incident,
  MonthlyIncomePoint,
  Debtor,
  PendingPayment,
  Activity,
  Teacher,
  Meeting,
  ScheduleRow,
} from "../data/director";

export type {
  EnrollmentPoint,
  FinancePoint,
  DashActivity,
  Milestone,
  SectionRow,
  PerformancePoint,
  RendimientoLapsoPoint,
  AsistenciaMesPoint,
  AcademicoLapsoAjustes,
  Incident,
  MonthlyIncomePoint,
  Debtor,
  PendingPayment,
  Activity,
  ActType,
  ActStatus,
  Teacher,
  TeacherState,
  Meeting,
  ScheduleRow,
} from "../data/director";

/* ---------------------------- Dashboard ejecutivo -------------------------- */

/** GET /director/dashboard/matricula — serie de matrícula y asistencia. */
export async function getMatricula(): Promise<EnrollmentPoint[]> {
  const { data } = await api.get<EnrollmentPoint[]>("/director/dashboard/matricula");
  return data;
}

/** GET /director/dashboard/finanzas — serie financiera por moneda. */
export async function getFinanzasDashboard(): Promise<FinancePoint[]> {
  const { data } = await api.get<FinancePoint[]>("/director/dashboard/finanzas");
  return data;
}

/** GET /director/dashboard/actividades — próximas actividades. */
export async function getDashboardActividades(): Promise<DashActivity[]> {
  const { data } = await api.get<DashActivity[]>("/director/dashboard/actividades");
  return data;
}

/** GET /director/dashboard/hitos — hitos del cierre de lapso. */
export async function getHitos(): Promise<Milestone[]> {
  const { data } = await api.get<Milestone[]>("/director/dashboard/hitos");
  return data;
}

/* ---------------------------- Panorama académico -------------------------- */

/** GET /director/academico/secciones — tabla de secciones por año. */
export async function getSecciones(): Promise<SectionRow[]> {
  const { data } = await api.get<SectionRow[]>("/director/academico/secciones");
  return data;
}

/** GET /director/academico/rendimiento — rendimiento promedio por año. */
export async function getRendimiento(): Promise<PerformancePoint[]> {
  const { data } = await api.get<PerformancePoint[]>("/director/academico/rendimiento");
  return data;
}

/** GET /director/academico/rendimiento-lapso — rendimiento promedio por lapso. */
export async function getRendimientoLapso(): Promise<RendimientoLapsoPoint[]> {
  const { data } = await api.get<RendimientoLapsoPoint[]>("/director/academico/rendimiento-lapso");
  return data;
}

/** GET /director/academico/asistencia-mes — asistencia promedio mensual. */
export async function getAsistenciaMes(): Promise<AsistenciaMesPoint[]> {
  const { data } = await api.get<AsistenciaMesPoint[]>("/director/academico/asistencia-mes");
  return data;
}

/** GET /director/academico/ajustes-lapso — ajustes agregados por lapso. */
export async function getAcademicoAjustes(): Promise<AcademicoLapsoAjustes> {
  const { data } = await api.get<AcademicoLapsoAjustes>("/director/academico/ajustes-lapso");
  return data;
}

/** GET /director/academico/incidencias — incidencias recientes. */
export async function getIncidencias(): Promise<Incident[]> {
  const { data } = await api.get<Incident[]>("/director/academico/incidencias");
  return data;
}

/* ---------------------------- Finanzas globales --------------------------- */

/** GET /director/finanzas/ingresos — serie de ingresos mensuales. */
export async function getIngresos(): Promise<MonthlyIncomePoint[]> {
  const { data } = await api.get<MonthlyIncomePoint[]>("/director/finanzas/ingresos");
  return data;
}

/** GET /director/finanzas/deudores — representantes deudores. */
export async function getDeudores(): Promise<Debtor[]> {
  const { data } = await api.get<Debtor[]>("/director/finanzas/deudores");
  return data;
}

/** GET /director/finanzas/pagos-pendientes — pagos por confirmar. */
export async function getPagosPendientes(): Promise<PendingPayment[]> {
  const { data } = await api.get<PendingPayment[]>("/director/finanzas/pagos-pendientes");
  return data;
}

/* -------------------- Actividades extracurriculares ----------------------- */

/** GET /director/actividades — cursos y actividades extracurriculares. */
export async function getActividades(): Promise<Activity[]> {
  const { data } = await api.get<Activity[]>("/director/actividades");
  return data;
}

/* ---------------------------- Gestión de personal ------------------------- */

/** GET /director/personal/docentes — plantilla docente. */
export async function getDocentes(): Promise<Teacher[]> {
  const { data } = await api.get<Teacher[]>("/director/personal/docentes");
  return data;
}

/** GET /director/personal/reuniones — reuniones de personal. */
export async function getReuniones(): Promise<Meeting[]> {
  const { data } = await api.get<Meeting[]>("/director/personal/reuniones");
  return data;
}

/** GET /director/personal/horario — asignación de docentes por hora. */
export async function getHorario(): Promise<ScheduleRow[]> {
  const { data } = await api.get<ScheduleRow[]>("/director/personal/horario");
  return data;
}
