/**
 * Contexto del filtro de lapso.
 *
 * Guarda el lapso SELECCIONADO por el filtro de las páginas de notas para que
 * la selección persista al navegar entre ellas. Es independiente del badge del
 * header, que siempre muestra el lapso actual real (CURRENT_LAPSO) y no cambia
 * con este filtro.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  CURRENT_LAPSO,
  CURRENT_LAPSO_ID,
  getLapso,
  type Lapso,
  type LapsoId,
} from "../datos_maquetados/data/lapsos";

interface LapsoContextValue {
  /** Lapso elegido en el filtro (por defecto, el actual). */
  selectedId: LapsoId;
  setSelectedId: (id: LapsoId) => void;
  /** Objeto del lapso seleccionado. */
  selected: Lapso;
  /** Lapso académico en curso (fijo). */
  current: Lapso;
  /** true si el filtro apunta al lapso en curso. */
  isCurrent: boolean;
}

const LapsoContext = createContext<LapsoContextValue | null>(null);

export function LapsoProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<LapsoId>(CURRENT_LAPSO_ID);

  const value = useMemo<LapsoContextValue>(
    () => ({
      selectedId,
      setSelectedId,
      selected: getLapso(selectedId),
      current: CURRENT_LAPSO,
      isCurrent: selectedId === CURRENT_LAPSO_ID,
    }),
    [selectedId],
  );

  return <LapsoContext.Provider value={value}>{children}</LapsoContext.Provider>;
}

export function useLapso(): LapsoContextValue {
  const ctx = useContext(LapsoContext);
  if (!ctx) {
    throw new Error("useLapso debe usarse dentro de <LapsoProvider>");
  }
  return ctx;
}
