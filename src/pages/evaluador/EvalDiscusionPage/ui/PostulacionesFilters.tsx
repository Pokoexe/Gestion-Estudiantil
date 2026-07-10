import { Search } from "lucide-react";
import { LapsoFilter } from "@shared/ui/LapsoFilter";

interface Props {
  query: string;
  onQuery: (q: string) => void;
}

export function PostulacionesFilters({ query, onQuery }: Props) {
  return (
    <div className="px-5 py-3 border-b border-edu-border-soft flex gap-2 items-center flex-wrap">
      <LapsoFilter />
      <div className="relative flex-1 min-w-[180px]">
        <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Buscar por estudiante, materia o año…"
          className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-teal-600"
        />
      </div>
    </div>
  );
}
