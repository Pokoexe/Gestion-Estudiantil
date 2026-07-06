/**
 * Datos maquetados del rol Tesorería.
 *
 * Reúne las COLECCIONES inline estáticas que antes vivían en el top-level de
 * cada página del rol (dashboard, pagos, solvencia, confirmar, inventario,
 * reportes) para servirlas vía los "endpoints" de `../server/routes/tesoreria`.
 *
 * NO se incluyen aquí los mapas presentacionales (label/clase/color/iconos,
 * grid-cols, listas de opciones de <select>): esos siguen en las páginas, tal
 * como el resto de dominios (p. ej. `TIPO_META`/`ESTADO_META` en inscripciones).
 */

/* ------------------------------------------------------------------ */
/* Tipos compartidos                                                   */
/* ------------------------------------------------------------------ */

export type Currency = "USD" | "Bs." | "COP";

/* ---------- Dashboard ---------- */

/** Punto de la serie mensual de recaudo (gráfico del dashboard). */
export interface CollectionPoint {
  mes: string;
  monto: number;
}

/** Pago manual pendiente de confirmar, tal como se muestra en el dashboard. */
export interface DashboardPendingPay {
  id: number;
  rep: string;
  student: string;
  amount: string;
  method: string;
  date: string;
  ref: string;
}

/** Representante moroso listado en el dashboard. */
export interface Debtor {
  id: number;
  rep: string;
  student: string;
  months: number;
  amount: string;
}

/* ---------- Pagos ---------- */

export type Method = "Efectivo" | "Transferencia";
export type PayStatus = "confirmed" | "review";

export interface Payment {
  id: number;
  rep: string;
  student: string;
  amount: number;
  currency: Currency;
  date: string;
  method: Method;
  status: PayStatus;
}

/** Punto de la serie de recaudo semanal en USD (gráfico de la página de pagos). */
export interface WeeklyCollectionPoint {
  dia: string;
  monto: number;
}

/* ---------- Solvencia ---------- */

export interface Representative {
  id: number;
  rep: string;
  students: string;
  months: number; // 0 = solvente
  amount: number; // 0 = solvente
  currency: Currency;
  phone: string;
}

/* ---------- Confirmar pagos ---------- */

export interface PendingPay {
  id: number;
  rep: string;
  student: string;
  amount: number;
  currency: Currency;
  bank: string;
  ref: string;
  date: string;
}

/* ---------- Inventario ---------- */

export type ItemStatus = "ok" | "low" | "out";

export interface InvItem {
  id: number;
  name: string;
  category: string;
  qty: number;
  unit: number; // valor unitario en USD
  status: ItemStatus;
}

export interface Movement {
  id: number;
  itemId: number;
  item: string;
  qty: number;
  note: string;
  date: string;
}

/* ---------- Reportes ---------- */

export type ReportType =
  | "Ausencia de clases"
  | "Falla de servicios"
  | "Suspensión"
  | "Incidente"
  | "Mantenimiento";
export type ReportStatus = "abierto" | "en_proceso" | "cerrado";

export interface Report {
  id: number;
  title: string;
  type: ReportType;
  date: string;
  author: string;
  status: ReportStatus;
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

/** Recaudo mensual en USD — últimos 6 meses (gráfico del dashboard). */
export const MONTHLY_COLLECTION: CollectionPoint[] = [
  { mes: "Ene", monto: 6120 },
  { mes: "Feb", monto: 6980 },
  { mes: "Mar", monto: 7540 },
  { mes: "Abr", monto: 7210 },
  { mes: "May", monto: 7520 },
  { mes: "Jun", monto: 8450 },
];

/** Pagos manuales por confirmar mostrados en el dashboard. */
export const PENDING_PAYMENTS: DashboardPendingPay[] = [
  { id: 1, rep: "María Fernanda Rojas", student: "Diego Rojas · 4to A", amount: "$ 65", method: "Transferencia", date: "28 jun 2026", ref: "Zelle · 4821" },
  { id: 2, rep: "Carlos Alberto Guerra", student: "Valentina Guerra · 1ro B", amount: "Bs 2.400", method: "Transferencia", date: "29 jun 2026", ref: "Pago Móvil · 0102" },
  { id: 3, rep: "Yohana Piñango", student: "Samuel Piñango · 6to A", amount: "$ 130.000", method: "Transferencia", date: "30 jun 2026", ref: "Nequi COP · 3390" },
  { id: 4, rep: "Ronald Betancourt", student: "Isabella Betancourt · 3ro C", amount: "$ 65", method: "Transferencia", date: "30 jun 2026", ref: "Zelle · 7715" },
  { id: 5, rep: "Génesis Alvarado", student: "Mateo Alvarado · 2do A", amount: "Bs 2.400", method: "Transferencia", date: "1 jul 2026", ref: "Pago Móvil · 0134" },
];

/** Representantes sin solvencia mostrados en el dashboard. */
export const DEBTORS: Debtor[] = [
  { id: 1, rep: "Pedro Nava", student: "Andrés Nava · 5to B", months: 3, amount: "$ 195" },
  { id: 2, rep: "Luisana Mendoza", student: "Camila Mendoza · 1ro A", amount: "Bs 7.200", months: 3 },
  { id: 3, rep: "Jorge Emilio Castro", student: "Sofía Castro · 4to C", months: 2, amount: "$ 130" },
  { id: 4, rep: "Neida Contreras", student: "Luis Contreras · 3ro A", months: 5, amount: "$ 390.000" },
  { id: 5, rep: "Wilmer Ochoa", student: "Gabriel Ochoa · 6to B", months: 1, amount: "$ 65" },
  { id: 6, rep: "Aracelis Duque", student: "Daniela Duque · 2do C", months: 4, amount: "Bs 9.600" },
];

/* ------------------------------------------------------------------ */
/* Pagos                                                               */
/* ------------------------------------------------------------------ */

export const PAYMENTS: Payment[] = [
  { id: 1, rep: "María Fernanda Rojas", student: "Diego Rojas · 4.º A", amount: 65, currency: "USD", date: "1 jul 2026", method: "Efectivo", status: "confirmed" },
  { id: 2, rep: "Carlos Alberto Guerra", student: "Valentina Guerra · 1.º B", amount: 2400, currency: "Bs.", date: "1 jul 2026", method: "Transferencia", status: "confirmed" },
  { id: 3, rep: "Yohana Piñango", student: "Samuel Piñango · 6.º A", amount: 260000, currency: "COP", date: "30 jun 2026", method: "Transferencia", status: "confirmed" },
  { id: 4, rep: "Ronald Betancourt", student: "Isabella Betancourt · 3.º C", amount: 65, currency: "USD", date: "30 jun 2026", method: "Efectivo", status: "confirmed" },
  { id: 5, rep: "Génesis Alvarado", student: "Mateo Alvarado · 2.º A", amount: 2400, currency: "Bs.", date: "29 jun 2026", method: "Transferencia", status: "review" },
  { id: 6, rep: "Douglas Sánchez", student: "Andrea Sánchez · 5.º B", amount: 65, currency: "USD", date: "28 jun 2026", method: "Efectivo", status: "confirmed" },
  { id: 7, rep: "Marbella Quintero", student: "Josué Quintero · 1.º A", amount: 130000, currency: "COP", date: "27 jun 2026", method: "Transferencia", status: "confirmed" },
  { id: 8, rep: "Alexis Parra", student: "Camila Parra · 4.º B", amount: 4800, currency: "Bs.", date: "26 jun 2026", method: "Efectivo", status: "confirmed" },
];

/** Recaudo semanal del mes en USD (equivalente) — gráfico de la página de pagos. */
export const WEEKLY_COLLECTION: WeeklyCollectionPoint[] = [
  { dia: "Sem 1", monto: 1240 },
  { dia: "Sem 2", monto: 1980 },
  { dia: "Sem 3", monto: 2340 },
  { dia: "Sem 4", monto: 2890 },
];

/* ------------------------------------------------------------------ */
/* Solvencia                                                           */
/* ------------------------------------------------------------------ */

export const REPRESENTATIVES: Representative[] = [
  // En mora
  { id: 1, rep: "Pedro Nava", students: "Andrés Nava · 5.º B", months: 3, amount: 195, currency: "USD", phone: "0414-1122334" },
  { id: 2, rep: "Luisana Mendoza", students: "Camila Mendoza · 1.º A", months: 3, amount: 7200, currency: "Bs.", phone: "0424-5566778" },
  { id: 3, rep: "Jorge Emilio Castro", students: "Sofía Castro · 4.º C, Luis Castro · 2.º B", months: 2, amount: 260, currency: "USD", phone: "0412-9988776" },
  { id: 4, rep: "Neida Contreras", students: "Luis Contreras · 3.º A", months: 5, amount: 650000, currency: "COP", phone: "0416-3344556" },
  { id: 5, rep: "Wilmer Ochoa", students: "Gabriel Ochoa · 6.º B", months: 1, amount: 65, currency: "USD", phone: "0426-7788990" },
  { id: 6, rep: "Aracelis Duque", students: "Daniela Duque · 2.º C", months: 4, amount: 9600, currency: "Bs.", phone: "0414-2211009" },
  { id: 7, rep: "Freddy Colmenares", students: "Yeison Colmenares · 5.º A, Ana Colmenares · 3.º B", months: 2, amount: 130, currency: "USD", phone: "0424-6655443" },
  // Solventes
  { id: 8, rep: "María Fernanda Rojas", students: "Diego Rojas · 4.º A", months: 0, amount: 0, currency: "USD", phone: "0414-3216549" },
  { id: 9, rep: "Carlos Alberto Guerra", students: "Valentina Guerra · 1.º B", months: 0, amount: 0, currency: "Bs.", phone: "0424-1472583" },
  { id: 10, rep: "Yohana Piñango", students: "Samuel Piñango · 6.º A", months: 0, amount: 0, currency: "COP", phone: "0412-7539514" },
  { id: 11, rep: "Ronald Betancourt", students: "Isabella Betancourt · 3.º C", months: 0, amount: 0, currency: "USD", phone: "0416-9515357" },
  { id: 12, rep: "Génesis Alvarado", students: "Mateo Alvarado · 2.º A", months: 0, amount: 0, currency: "Bs.", phone: "0426-3571592" },
  { id: 13, rep: "Douglas Sánchez", students: "Andrea Sánchez · 5.º B", months: 0, amount: 0, currency: "USD", phone: "0414-8529637" },
  { id: 14, rep: "Marbella Quintero", students: "Josué Quintero · 1.º A", months: 0, amount: 0, currency: "COP", phone: "0424-9637418" },
  { id: 15, rep: "Alexis Parra", students: "Camila Parra · 4.º B", months: 0, amount: 0, currency: "Bs.", phone: "0412-1593574" },
  { id: 16, rep: "Rosa Elena Díaz", students: "Miguel Díaz · 3.º A, Laura Díaz · 1.º C", months: 0, amount: 0, currency: "USD", phone: "0416-7412589" },
  { id: 17, rep: "Héctor Villalba", students: "Fabiana Villalba · 6.º B", months: 0, amount: 0, currency: "Bs.", phone: "0426-8523697" },
  { id: 18, rep: "Nancy Peralta", students: "Emilio Peralta · 2.º B", months: 0, amount: 0, currency: "USD", phone: "0414-3698521" },
  { id: 19, rep: "Oswaldo Rincón", students: "Gabriela Rincón · 4.º A", months: 0, amount: 0, currency: "COP", phone: "0424-1234567" },
  { id: 20, rep: "Yelitza Moreno", students: "Santiago Moreno · 5.º C", months: 0, amount: 0, currency: "Bs.", phone: "0412-7654321" },
];

/* ------------------------------------------------------------------ */
/* Confirmar pagos                                                     */
/* ------------------------------------------------------------------ */

export const PENDING: PendingPay[] = [
  { id: 1, rep: "María Fernanda Rojas", student: "Diego Rojas · 4.º A", amount: 65, currency: "USD", bank: "Zelle · Bank of America", ref: "4821-0092", date: "2 jul 2026" },
  { id: 2, rep: "Carlos Alberto Guerra", student: "Valentina Guerra · 1.º B", amount: 2400, currency: "Bs.", bank: "Pago Móvil · Banco de Venezuela", ref: "0102-77341", date: "2 jul 2026" },
  { id: 3, rep: "Yohana Piñango", student: "Samuel Piñango · 6.º A", amount: 260000, currency: "COP", bank: "Nequi · Bancolombia", ref: "3390-1187", date: "1 jul 2026" },
  { id: 4, rep: "Ronald Betancourt", student: "Isabella Betancourt · 3.º C", amount: 65, currency: "USD", bank: "Zelle · Chase", ref: "7715-4408", date: "1 jul 2026" },
  { id: 5, rep: "Génesis Alvarado", student: "Mateo Alvarado · 2.º A", amount: 4800, currency: "Bs.", bank: "Transferencia · Banesco", ref: "0134-98220", date: "30 jun 2026" },
];

/* ------------------------------------------------------------------ */
/* Inventario                                                          */
/* ------------------------------------------------------------------ */

export const INVENTORY: InvItem[] = [
  { id: 1, name: "Sillas de aula", category: "Mobiliario", qty: 340, unit: 12, status: "ok" },
  { id: 2, name: "Mesas de trabajo", category: "Mobiliario", qty: 172, unit: 28, status: "ok" },
  { id: 3, name: "Computadoras de escritorio", category: "Tecnología", qty: 24, unit: 320, status: "low" },
  { id: 4, name: "Tabletas educativas", category: "Tecnología", qty: 6, unit: 150, status: "low" },
  { id: 5, name: "Escobas y coletos", category: "Limpieza", qty: 3, unit: 4, status: "out" },
  { id: 6, name: "Líquidos de limpieza", category: "Limpieza", qty: 42, unit: 3, status: "ok" },
  { id: 7, name: "Pizarras acrílicas", category: "Aula", qty: 28, unit: 22, status: "ok" },
  { id: 8, name: "Resmas de papel bond", category: "Insumos", qty: 90, unit: 5, status: "ok" },
  { id: 9, name: "Globos decorativos", category: "Insumos", qty: 200, unit: 0.3, status: "ok" },
];

export const INVENTORY_MOVEMENTS: Movement[] = [
  { id: 1, itemId: 6, item: "Líquidos de limpieza", qty: 4, note: "Limpieza general de aulas tras la jornada.", date: "1 jul 2026" },
  { id: 2, itemId: 8, item: "Resmas de papel bond", qty: 3, note: "Impresión de boletines del 3.º lapso.", date: "30 jun 2026" },
];

/** Saldo disponible inicial en USD (caja de Administración). */
export const INVENTORY_BALANCE = 8450;

/* ------------------------------------------------------------------ */
/* Reportes                                                            */
/* ------------------------------------------------------------------ */

export const REPORTS: Report[] = [
  { id: 1, title: "Suspensión de clases por falla eléctrica", type: "Ausencia de clases", date: "1 jul 2026", author: "Prof. Marisela Ríos", status: "cerrado" },
  { id: 2, title: "Corte de agua en sede principal", type: "Falla de servicios", date: "28 jun 2026", author: "Coord. Luis Aponte", status: "en_proceso" },
  { id: 3, title: "Ausencia docente 5.º B (reposo médico)", type: "Ausencia de clases", date: "26 jun 2026", author: "Prof. Marisela Ríos", status: "abierto" },
  { id: 4, title: "Reparación de filtraciones en Aula 204", type: "Mantenimiento", date: "20 jun 2026", author: "Coord. Luis Aponte", status: "en_proceso" },
];
