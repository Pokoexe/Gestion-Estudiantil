/**
 * Filtro de lapso reutilizable para las páginas de notas / evaluaciones.
 *
 * Es un <select> ligado al LapsoContext: al cambiarlo se actualiza el lapso
 * seleccionado y la página vuelve a filtrar sus datos por ese período. No
 * afecta al badge del header (que siempre muestra el lapso en curso).
 */

import { CalendarRange } from "lucide-react";
import { LAPSOS, CURRENT_LAPSO_ID, type LapsoId } from "../datos_maquetados/data/lapsos";
import { useLapso } from "../context/LapsoContext";

interface LapsoFilterProps {
  /** Texto de la etiqueta. `null` la oculta. Por defecto "Lapso". */
  label?: string | null;
  /** Tamaño del control. "sm" para barras de filtro, "md" para formularios. */
  size?: "sm" | "md";
  /** Clases extra para el contenedor. */
  className?: string;
}

export function LapsoFilter({ label = "Lapso", size = "sm", className = "" }: LapsoFilterProps) {
  const { selectedId, setSelectedId } = useLapso();

  const pad = size === "md" ? "px-3.5 py-2.5 text-[0.9375rem]" : "px-3 py-2 text-[0.8125rem]";

  return (
    <label className={`flex w-full md:w-auto justify-between md:justify-start items-center gap-2 shrink-0 ${className}`}>
      {label !== null && (
        <div>
          <span className="flex items-center gap-1.5 text-edu-ink-500 text-[0.8125rem] font-medium">
            <CalendarRange className="w-4 h-4 text-edu-primary shrink-0" />
            {label}
          </span>
        </div>
      )}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(Number(e.target.value) as LapsoId)}
        aria-label="Filtrar por lapso"
        className={`border-[1.5px] border-edu-border rounded-edu-control ${pad} text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-edu-primary`}
      >
        {LAPSOS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
            {l.id === CURRENT_LAPSO_ID ? " · actual" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
