import { accent } from "@themes/tokens";
import type { TipoPersona } from "@shared/services/actions/coordinador";

interface FiltroTipoTabsProps {
    filtro: "Todos" | TipoPersona;
    setFiltro: (f: "Todos" | TipoPersona) => void;
    setPage: (p: number) => void;
}

export function FiltroTipoTabs({ filtro, setFiltro, setPage }: FiltroTipoTabsProps) {
    return (
        <div className="flex gap-1 border-b border-edu-border-soft">
            {(["Todos", "Docente", "Estudiante", "Formato"] as const).map((f) => {
                const active = filtro === f;
                return (
                    <button
                        key={f}
                        type="button"
                        onClick={() => { setFiltro(f); setPage(1); }}
                        className="px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px cursor-pointer bg-transparent transition-colors"
                        style={active ? { borderColor: accent.purple.fg, color: accent.purple.fg } : { borderColor: "transparent", color: "#6b7280" }}
                    >
                        {f === "Todos" || f === "Formato" ? f : f + "s"}
                    </button>
                );
            })}
        </div>
    );
}
