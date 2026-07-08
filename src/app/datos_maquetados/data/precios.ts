/**
 * Datos ficticios de precios para el panel del Director.
 *
 * Cada registro (`EsquemaPrecio`) representa el cuadro de precios aplicado en un
 * período escolar: mensualidad, recargo por morosidad, día en que empieza a
 * cobrarse la morosidad y los descuentos por hermanos e hijos de docentes.
 *
 * El primer registro con estado `"vigente"` es la configuración actual: de él se
 * alimentan los KPIs de la página. El resto son esquemas históricos que se
 * muestran en la tabla con buscador y paginación.
 */

export type PrecioEstado = "vigente" | "historico";

export interface EsquemaPrecio {
    id: number;
    /** Período escolar al que aplica el cuadro de precios (ej. "2026-2027"). */
    periodo: string;
    /** Cuota mensual por estudiante. */
    mensualidad: string;
    /** Recargo que se cobra al pasar el día de corte (morosidad). */
    morosidad: string;
    /** Día del mes a partir del cual se aplica el recargo por morosidad. */
    inicioMorosidad: number;
    /** Descuento por cada hermano/a inscrito en la institución. */
    descHermanos: string;
    /** Descuento para hijos de docentes de la institución. */
    descDocentes: string;
    /** "vigente" = cuadro de precios actual; "historico" = períodos anteriores. */
    estado: PrecioEstado;
    /** Quién registró/aprobó el cuadro de precios. */
    registradoPor: string;
    /** Fecha en que quedó registrado el cuadro de precios. */
    fechaRegistro: string;
}

/**
 * Historial de cuadros de precios. El registro `vigente` va primero; los demás
 * son los que ha habido antes (de más reciente a más antiguo).
 */
export const PRECIOS_HISTORIAL: EsquemaPrecio[] = [
    {
        id: 1, periodo: "2026-2027",
        mensualidad: "$ 35,00", morosidad: "$ 5,00", inicioMorosidad: 5,
        descHermanos: "15 %", descDocentes: "50 %",
        estado: "vigente", registradoPor: "Dra. Elena Vargas", fechaRegistro: "1 sep 2026",
    },
    {
        id: 2, periodo: "2025-2026",
        mensualidad: "$ 30,00", morosidad: "$ 5,00", inicioMorosidad: 5,
        descHermanos: "15 %", descDocentes: "50 %",
        estado: "historico", registradoPor: "Dra. Elena Vargas", fechaRegistro: "2 sep 2025",
    },
    {
        id: 3, periodo: "2024-2025",
        mensualidad: "$ 25,00", morosidad: "$ 4,00", inicioMorosidad: 7,
        descHermanos: "10 %", descDocentes: "50 %",
        estado: "historico", registradoPor: "Dra. Elena Vargas", fechaRegistro: "4 sep 2024",
    },
    {
        id: 4, periodo: "2023-2024",
        mensualidad: "$ 22,00", morosidad: "$ 4,00", inicioMorosidad: 7,
        descHermanos: "10 %", descDocentes: "40 %",
        estado: "historico", registradoPor: "Lic. Marta Sánchez", fechaRegistro: "5 sep 2023",
    },
    {
        id: 5, periodo: "2022-2023",
        mensualidad: "$ 18,00", morosidad: "$ 3,00", inicioMorosidad: 10,
        descHermanos: "10 %", descDocentes: "40 %",
        estado: "historico", registradoPor: "Lic. Marta Sánchez", fechaRegistro: "6 sep 2022",
    },
    {
        id: 6, periodo: "2021-2022",
        mensualidad: "$ 15,00", morosidad: "$ 3,00", inicioMorosidad: 10,
        descHermanos: "5 %", descDocentes: "30 %",
        estado: "historico", registradoPor: "Lic. Marta Sánchez", fechaRegistro: "3 sep 2021",
    },
    {
        id: 7, periodo: "2020-2021",
        mensualidad: "$ 12,00", morosidad: "$ 2,00", inicioMorosidad: 10,
        descHermanos: "5 %", descDocentes: "30 %",
        estado: "historico", registradoPor: "Prof. Alejandro Morales", fechaRegistro: "7 sep 2020",
    },
    {
        id: 8, periodo: "2019-2020",
        mensualidad: "$ 10,00", morosidad: "$ 2,00", inicioMorosidad: 15,
        descHermanos: "5 %", descDocentes: "25 %",
        estado: "historico", registradoPor: "Prof. Alejandro Morales", fechaRegistro: "9 sep 2019",
    },
];

/** Config presentacional del estado del cuadro de precios (badge de la tabla). */
export const PRECIO_ESTADO_META: Record<PrecioEstado, { label: string; cls: string }> = {
    vigente: { label: "Vigente", cls: "bg-edu-success-bg text-edu-success" },
    historico: { label: "Histórico", cls: "bg-edu-subtle text-edu-ink-500" },
};
