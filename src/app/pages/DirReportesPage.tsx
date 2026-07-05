import { useState } from "react";
import {
  Download,
  Users,
  GraduationCap,
  ShieldCheck,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import { color, accent } from "../theme/tokens";

/* ------------------------------------------------------------------ */
/* Datos ficticios                                                     */
/* ------------------------------------------------------------------ */

interface Indicator {
  label: string;
  value: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
}

const INDICATORS: Indicator[] = [
  { label: "Matrícula total", value: "612", icon: Users, ac: accent.blue, hint: "+38 vs. período anterior" },
  { label: "Promedio institucional", value: "15,8", icon: GraduationCap, ac: accent.amber, hint: "Escala 0 – 20" },
  { label: "Solvencia", value: "78 %", icon: ShieldCheck, ac: accent.purple, hint: "478 representantes al día" },
  { label: "Asistencia anual", value: "91 %", icon: ClipboardCheck, ac: accent.green, hint: "Promedio 2026-I" },
];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function DirReportesPage() {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado de sección */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-edu-ink font-bold text-xl">Estadísticas generales de la institución</h2>
          <p className="m-0 mt-1 text-edu-ink-400 text-[0.85rem]">
            Indicadores clave · Período 2026-I
          </p>
        </div>
        <button
          onClick={handleExport}
          className={`inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold border-none cursor-pointer transition-colors ${
            exported ? "bg-edu-success text-white" : "text-white hover:opacity-90"
          }`}
          style={exported ? undefined : { backgroundColor: color.warning }}
        >
          {exported ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {exported ? "Reporte generado" : "Exportar reporte"}
        </button>
      </div>

      {/* Indicadores clave */}
      <div className="grid grid-cols-4 gap-4">
        {INDICATORS.map((ind) => {
          const Icon = ind.icon;
          return (
            <div key={ind.label} className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-edu-ink-500 text-[0.72rem] font-medium m-0 uppercase tracking-[0.05em]">{ind.label}</p>
                  <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{ind.value}</p>
                </div>
                <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: ind.ac.bg }}>
                  <Icon style={{ width: "20px", height: "20px", color: ind.ac.fg }} />
                </div>
              </div>
              <p className="text-edu-ink-400 text-[0.72rem] m-0">{ind.hint}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
