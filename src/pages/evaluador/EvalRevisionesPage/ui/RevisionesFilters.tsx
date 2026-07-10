import { Search } from "lucide-react";
import { LapsoFilter } from "@shared/ui/LapsoFilter";
import type { RevEstado } from "@shared/services/actions/evaluador";

interface RevisionesFiltersProps {
  query: string;
  onQuery: (q: string) => void;
  estadoFilter: "todos" | RevEstado;
  onEstado: (e: "todos" | RevEstado) => void;
  teal: string;
}

export function RevisionesFilters({
  query,
  onQuery,
  estadoFilter,
  onEstado,
  teal: _teal,
}: RevisionesFiltersProps) {
  return (
    <div className="px-5 py-3 flex gap-2 items-center flex-wrap border-b border-edu-border-soft">
      <LapsoFilter />
      <div className="relative flex-1 min-w-[180px]">
        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Buscar docente, materia o sección…"
          className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
        />
      </div>
      <select
        value={estadoFilter}
        onChange={(e) => onEstado(e.target.value as "todos" | RevEstado)}
        className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink-700 bg-edu-subtle outline-none cursor-pointer transition-colors focus:border-teal-600"
      >
        <option value="todos">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Aprobado">Aprobado</option>
        <option value="Revisión solicitada">Revisión solicitada</option>
      </select>
    </div>
  );
}
