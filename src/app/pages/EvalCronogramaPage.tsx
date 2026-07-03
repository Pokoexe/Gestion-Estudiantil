import { useState } from "react";
import { CalendarClock, Save, CheckCircle2, AlertTriangle, CalendarDays } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";

interface CronogramaFila {
  id: number;
  materia: string;
  seccion: string;
  docente: string;
  fechas: string[]; // fechas ISO de las evaluaciones
}

const FILAS: CronogramaFila[] = [
  { id: 1, materia: "Biología", seccion: "5.º Año A", docente: "Prof. María Fernández", fechas: ["2026-07-06", "2026-07-15", "2026-07-27", "2026-08-10"] },
  { id: 2, materia: "Ciencias Naturales", seccion: "4.º Año B", docente: "Prof. José Rangel", fechas: ["2026-07-07", "2026-07-09", "2026-07-24"] },
  { id: 3, materia: "Química", seccion: "5.º Año B", docente: "Prof. Carmen Ortega", fechas: ["2026-07-08", "2026-07-20", "2026-08-03"] },
  { id: 4, materia: "Física", seccion: "5.º Año A", docente: "Prof. Luis Guerra", fechas: ["2026-07-10", "2026-07-13", "2026-07-28"] },
  { id: 5, materia: "Matemáticas", seccion: "3.º Año C", docente: "Prof. Ana Díaz", fechas: ["2026-07-06", "2026-07-22", "2026-08-05"] },
];

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const fmt = (iso: string): string => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
};

const diasEntre = (a: string, b: string): number => {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
};

const COLS = "grid-cols-[1.3fr_0.9fr_1.2fr_2.2fr_1fr]";
const HEADERS = ["Materia", "Sección", "Docente", "Fechas de evaluación", "Validación"];

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalCronogramaPage() {
  const [minDias, setMinDias] = useState(7);
  const [maxDias, setMaxDias] = useState(20);
  const [guardado, setGuardado] = useState(false);

  // Evalúa si todas las separaciones de una fila cumplen el rango [min, max]
  const evaluarFila = (fechas: string[]): { ok: boolean; min: number; max: number } => {
    const orden = [...fechas].sort();
    let menor = Infinity;
    let mayor = 0;
    for (let i = 1; i < orden.length; i++) {
      const d = diasEntre(orden[i - 1], orden[i]);
      menor = Math.min(menor, d);
      mayor = Math.max(mayor, d);
    }
    const ok = menor >= minDias && mayor <= maxDias;
    return { ok, min: menor === Infinity ? 0 : menor, max: mayor };
  };

  const totalOk = FILAS.filter((f) => evaluarFila(f.fechas).ok).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado descriptivo */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-edu-card flex items-center justify-center shrink-0" style={{ backgroundColor: TEAL_BG }}>
          <CalendarClock className="w-7 h-7" style={{ color: TEAL }} />
        </div>
        <div>
          <p className="text-edu-ink text-[1.05rem] font-bold m-0">Cronograma de evaluación</p>
          <p className="text-edu-ink-500 text-[0.85rem] m-0 mt-0.5">
            Define el tiempo mínimo y máximo de separación entre evaluaciones. El sistema valida cada materia y sección.
          </p>
        </div>
      </div>

      {/* Reglas de separación */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Reglas de separación</h3>
        </div>
        <div className="px-5 py-[18px] flex flex-wrap items-end gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Tiempo mínimo (días)</label>
            <input
              type="number"
              min={1}
              value={minDias}
              onChange={(e) => { setMinDias(Number(e.target.value)); setGuardado(false); }}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-40 focus:border-teal-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Tiempo máximo (días)</label>
            <input
              type="number"
              min={1}
              value={maxDias}
              onChange={(e) => { setMaxDias(Number(e.target.value)); setGuardado(false); }}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-40 focus:border-teal-600"
            />
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control text-[0.8125rem] font-medium" style={{ backgroundColor: TEAL_BG, color: TEAL }}>
            <CheckCircle2 className="w-4 h-4" />
            {totalOk} de {FILAS.length} materias cumplen las reglas
          </div>
          <button
            type="button"
            onClick={() => setGuardado(true)}
            className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90 ml-auto"
            style={{ backgroundColor: TEAL }}
          >
            <Save className="w-4 h-4" />
            Guardar cronograma
          </button>
        </div>
        {guardado && (
          <div className="mx-5 mb-4 flex items-center gap-2 px-3.5 py-2.5 rounded-edu-control bg-edu-success-bg text-edu-success text-[0.8125rem] font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Cronograma guardado correctamente.
          </div>
        )}
      </div>

      {/* Tabla por materia + sección */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Calendario por materia y sección</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{FILAS.length} programaciones</span>
        </div>
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">{h}</span>
          ))}
        </div>
        {FILAS.map((f, i) => {
          const ev = evaluarFila(f.fechas);
          const orden = [...f.fechas].sort();
          return (
            <div key={f.id} className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < FILAS.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
              <span className="text-sm text-edu-ink font-medium">{f.materia}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{f.seccion}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{f.docente}</span>
              <div className="flex flex-wrap gap-1.5">
                {orden.map((fecha, j) => {
                  const sep = j > 0 ? diasEntre(orden[j - 1], fecha) : null;
                  const muyJunta = sep !== null && sep < minDias;
                  return (
                    <span
                      key={fecha}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-edu-chip text-[0.72rem] font-medium border ${muyJunta ? "border-edu-danger bg-edu-danger-bg text-edu-danger" : "border-edu-border-soft bg-edu-subtle text-edu-ink-700"}`}
                      title={sep !== null ? `${sep} días desde la anterior` : "Primera evaluación"}
                    >
                      <CalendarDays className="w-3 h-3" />
                      {fmt(fecha)}
                    </span>
                  );
                })}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ev.ok ? "bg-edu-success-bg text-edu-success" : "bg-edu-danger-bg text-edu-danger"}`}>
                {ev.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {ev.ok ? "OK" : "Muy juntas"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
