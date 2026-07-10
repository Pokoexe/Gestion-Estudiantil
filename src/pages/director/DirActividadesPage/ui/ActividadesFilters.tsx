import { Search } from "lucide-react";
import { color } from "@themes/tokens";
import type { ActType } from "@shared/services/actions/director";

interface ActividadesFiltersProps {
  query: string;
  setQuery: (v: string) => void;
  filter: ActType | "Todas";
  setFilter: (v: ActType | "Todas") => void;
  setPage: (v: number) => void;
  filters: (ActType | "Todas")[];
  filteredCount: number;
}

export function ActividadesFilters({
  query,
  setQuery,
  filter,
  setFilter,
  setPage,
  filters,
  filteredCount,
}: ActividadesFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Buscar por nombre o docente…"
          className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-surface outline-none transition-colors focus:border-edu-warning"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-edu-pill text-[0.8rem] font-semibold border cursor-pointer transition-colors ${
                active ? "text-white border-transparent" : "bg-edu-surface text-edu-ink-500 border-edu-border hover:bg-edu-subtle"
              }`}
              style={active ? { backgroundColor: color.warning } : undefined}
            >
              {f}
            </button>
          );
        })}
        <span className="ml-auto text-[0.8rem] text-edu-ink-400 self-center">
          {filteredCount} resultado{filteredCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
