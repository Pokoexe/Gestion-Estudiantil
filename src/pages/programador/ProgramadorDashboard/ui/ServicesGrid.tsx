import { accent } from "@themes/tokens";
import type { ServiceState, ServiceKey } from "@shared/services/actions/misc";
import { SectionHeader } from "./SectionHeader";

type AccentKey = keyof typeof accent;

interface ServiceItem {
  key: ServiceKey;
  name: string;
  detail: string;
  state: ServiceState;
  metric: string;
}

interface ServicesGridProps {
  services: ServiceItem[];
  SERVICE_STYLE: Record<ServiceKey, { icon: React.FC<{ style?: React.CSSProperties }>; tone: AccentKey }>;
  SERVICE_STATE: Record<ServiceState, { fg: string; label: string }>;
}

export function ServicesGrid({ services, SERVICE_STYLE, SERVICE_STATE }: ServicesGridProps) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <SectionHeader title="Estado de servicios / integraciones" link="Ver panel de estado" />
      <div
        className="grid gap-3 px-5 py-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
      >
        {services.map((svc) => {
          const style = SERVICE_STYLE[svc.key];
          const Icon = style.icon;
          const tone = accent[style.tone];
          const st = SERVICE_STATE[svc.state];
          return (
            <div key={svc.name} className="border border-edu-border rounded-edu-control p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div
                  className="w-[34px] h-[34px] rounded-edu-chip flex items-center justify-center"
                  style={{ backgroundColor: tone.bg }}
                >
                  <Icon style={{ width: "17px", height: "17px", color: tone.fg }} />
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold"
                  style={{ color: st.fg }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: st.fg }}
                  />
                  {st.label}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-edu-ink">{svc.name}</div>
                <div className="text-xs text-edu-ink-400 mt-0.5">{svc.detail}</div>
              </div>
              <div className="flex items-baseline gap-1.5 border-t border-edu-border-soft pt-2.5">
                <span className="text-[1.1rem] font-bold text-edu-ink">{svc.metric}</span>
                <span className="text-[0.7rem] text-edu-ink-400">latencia</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
