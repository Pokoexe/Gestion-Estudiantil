import { Palette } from "lucide-react";
import { THEMES } from "@/pages/Auth/LandingPage/functions/themes";
import type { LandingConfig, ThemeId } from "@/pages/Auth/LandingPage/interfaces/types";
import { Group } from "./Group";

export function TabPlantillas({
  config,
  setTemplate,
  patch,
}: {
  config: LandingConfig;
  setTemplate: (t: ThemeId) => void;
  patch: (p: Partial<LandingConfig>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Plantilla */}
      <Group title="Plantilla y fondo" icon={Palette} defaultOpen>
        <label className="text-[0.75rem] font-semibold text-edu-ink-500">Plantilla base</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.values(THEMES)).map((th) => {
            const Icon = th.icon;
            const active = config.template === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setTemplate(th.id)}
                className={`flex flex-col items-start gap-2 rounded-edu-control border-[1.5px] p-3 text-left cursor-pointer transition-all ${active ? "border-edu-primary bg-edu-primary-50" : "border-edu-border bg-edu-surface hover:border-edu-primary-200"
                  }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-edu-chip" style={{ backgroundImage: th.ctaGradient }}>
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="text-[0.82rem] font-bold text-edu-ink">{th.name}</span>
                <span className="text-[0.68rem] leading-tight text-edu-ink-400">{th.tagline}</span>
              </button>
            );
          })}
        </div>
        <label className="mt-1 text-[0.75rem] font-semibold text-edu-ink-500">Fondo</label>
        <div className="flex flex-wrap gap-1.5">
          {THEMES[config.template].backgrounds.map((bg) => {
            const active = config.background === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => patch({ background: bg.id })}
                className={`rounded-edu-pill border-[1.5px] px-3 py-1.5 text-[0.76rem] font-medium cursor-pointer transition-colors ${active ? "border-edu-primary bg-edu-primary-50 text-edu-primary" : "border-edu-border bg-edu-surface text-edu-ink-600 hover:bg-edu-subtle"
                  }`}
              >
                {bg.label}
              </button>
            );
          })}
        </div>
      </Group>
    </div>
  );
}
