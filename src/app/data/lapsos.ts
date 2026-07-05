/**
 * Fuente única de verdad de los lapsos académicos (período 2026-I).
 *
 * El resto de la maqueta escribía literales sueltos como "Lapso II · 2026-I"
 * (EvaluadorDashboard, EvalCronograma) o promedios por lapso dispersos
 * (DirAcademico). Este módulo centraliza esa definición para que el badge del
 * header y el filtro de lapso de las páginas de notas usen los mismos datos.
 *
 * El lapso ACTUAL es el II, coincidiendo con las pantallas existentes
 * (cierre 31 jul 2026).
 */

export type LapsoId = 1 | 2 | 3;

export type LapsoEstado = "finalizado" | "en_curso" | "proximo";

export interface Lapso {
  id: LapsoId;
  /** Numeral romano ("I", "II", "III"). */
  roman: string;
  /** Etiqueta corta ("Lapso II"). */
  label: string;
  /** Período académico ("2026-I"). */
  periodo: string;
  /** Etiqueta completa ("Lapso II · 2026-I"). */
  fullLabel: string;
  /** Rango del lapso (ISO). */
  inicio: string;
  cierre: string;
  /** Rango del lapso en texto ("2 de junio de 2026"). */
  inicioLabel: string;
  cierreLabel: string;
  estado: LapsoEstado;
}

export const PERIODO = "2026-I";

export const LAPSOS: Lapso[] = [
  {
    id: 1,
    roman: "I",
    label: "Lapso I",
    periodo: PERIODO,
    fullLabel: `Lapso I · ${PERIODO}`,
    inicio: "2026-04-14",
    cierre: "2026-05-30",
    inicioLabel: "14 de abril de 2026",
    cierreLabel: "30 de mayo de 2026",
    estado: "finalizado",
  },
  {
    id: 2,
    roman: "II",
    label: "Lapso II",
    periodo: PERIODO,
    fullLabel: `Lapso II · ${PERIODO}`,
    inicio: "2026-06-02",
    cierre: "2026-07-31",
    inicioLabel: "2 de junio de 2026",
    cierreLabel: "31 de julio de 2026",
    estado: "en_curso",
  },
  {
    id: 3,
    roman: "III",
    label: "Lapso III",
    periodo: PERIODO,
    fullLabel: `Lapso III · ${PERIODO}`,
    inicio: "2026-08-03",
    cierre: "2026-09-30",
    inicioLabel: "3 de agosto de 2026",
    cierreLabel: "30 de septiembre de 2026",
    estado: "proximo",
  },
];

/** Lapso académico en curso (mostrado en el header de todos los roles). */
export const CURRENT_LAPSO_ID: LapsoId = 2;

export const getLapso = (id: LapsoId): Lapso =>
  LAPSOS.find((l) => l.id === id) ?? LAPSOS[1];

export const CURRENT_LAPSO = getLapso(CURRENT_LAPSO_ID);
