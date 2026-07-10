import { Search, Server, Database, MessageCircle, CreditCard, Mail } from "lucide-react";
import { color, accent } from "@themes/tokens";
import { useEstadoPage } from "./functions/useEstadoPage";
import type { ServiceState, ServiceTipo, ServiceKey } from "@shared/services/actions/misc";

const SVC_COLS = "grid-cols-[36px_2fr_110px_130px_100px_1fr]";

type AccentKey = keyof typeof accent;

const SERVICE_STYLE: Record<ServiceKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }> = {
  api:      { icon: Server,        tone: "blue"  },
  db:       { icon: Database,      tone: "green" },
  whatsapp: { icon: MessageCircle, tone: "green" },
  pagos:    { icon: CreditCard,    tone: "amber" },
  correo:   { icon: Mail,          tone: "red"   },
};

const STATE_STYLE: Record<ServiceState, { bg: string; fg: string }> = {
  Operativo: { bg: color.successBg, fg: color.success       },
  Degradado: { bg: color.warningBg, fg: color.warningStrong },
  Caído:     { bg: color.dangerBg,  fg: color.danger        },
};

const TIPO_STYLE: Record<ServiceTipo, { bg: string; fg: string }> = {
  interno: { bg: color.primary50, fg: color.primary },
  externo: { bg: color.subtle,    fg: color.ink500  },
};

export function ProgramadorEstadoPage() {
  const {
    loading,
    query,
    setQuery,
    estadoFilter,
    setEstadoFilter,
    tipoFilter,
    setTipoFilter,
    filtered,
  } = useEstadoPage();

  if (loading) {
    return (
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-10 text-center text-edu-ink-400 text-sm">
        Cargando…
      </div>
    );
  }

  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Estado de servicios</h3>
          <p className="mt-0.5 text-edu-ink-400 text-[0.78rem]">Monitoreo en tiempo real de los servicios del sistema</p>
        </div>

        <div className="px-5 py-3 border-b border-edu-border-soft flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-4 h-4 text-edu-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio…"
              className="w-full border-[1.5px] border-edu-border rounded-edu-control pl-9 pr-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as ServiceState | "")}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary cursor-pointer"
          >
            <option value="">Estado: todos</option>
            <option value="Operativo">Operativo</option>
            <option value="Degradado">Degradado</option>
            <option value="Caído">Caído</option>
          </select>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as ServiceTipo | "")}
            className="border-[1.5px] border-edu-border rounded-edu-control px-3 py-2 text-[0.8125rem] text-edu-ink bg-edu-subtle outline-none transition-colors focus:border-edu-primary cursor-pointer"
          >
            <option value="">Tipo: todos</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className={`grid ${SVC_COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
              {["", "Servicio", "Tipo", "Estado", "Latencia", "Detalle"].map((h, i) => (
                <span key={i} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-[0.8125rem] text-edu-ink-400 m-0 px-5 py-10 text-center">
                No hay servicios que coincidan con los filtros.
              </p>
            ) : (
              filtered.map((svc, i) => {
                const style = SERVICE_STYLE[svc.key];
                const Icon = style.icon;
                const tone = accent[style.tone];
                const stateStyle = STATE_STYLE[svc.state];
                const tipoStyle = TIPO_STYLE[svc.tipo];
                return (
                  <div
                    key={svc.key}
                    className={`grid ${SVC_COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < filtered.length - 1 ? "border-b border-edu-border-soft" : ""}`}
                  >
                    <div
                      className="w-[30px] h-[30px] rounded-edu-chip flex items-center justify-center shrink-0"
                      style={{ backgroundColor: tone.bg }}
                    >
                      <Icon style={{ width: "15px", height: "15px", color: tone.fg }} />
                    </div>
                    <span className="text-sm text-edu-ink font-semibold">{svc.name}</span>
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit capitalize"
                      style={{ backgroundColor: tipoStyle.bg, color: tipoStyle.fg }}
                    >
                      {svc.tipo}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold" style={{ color: stateStyle.fg }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stateStyle.fg }} />
                      {svc.state}
                    </span>
                    <span className="font-mono text-[0.8125rem] text-edu-ink font-bold">{svc.metric}</span>
                    <span className="text-[0.8125rem] text-edu-ink-500">{svc.detail}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
  );
}
