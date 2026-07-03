import { useState } from "react";
import { FileSpreadsheet, Download, CheckCircle2, XCircle, Users } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos y datos ficticios                                             */
/* ------------------------------------------------------------------ */

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";

interface Estudiante {
  nombre: string;
  notas: number[]; // una nota por materia (escala 1–20)
}

const MATERIAS = ["Castellano", "Matemáticas", "Biología", "Química", "Física", "Historia"];

const SECCIONES = ["4.º Año A", "4.º Año B", "5.º Año A", "5.º Año B", "3.º Año C"];
const LAPSOS = ["1.º Lapso", "2.º Lapso", "3.º Lapso"];

const ESTUDIANTES: Estudiante[] = [
  { nombre: "Andreína Colmenares", notas: [18, 16, 19, 15, 17, 18] },
  { nombre: "Carlos Bracho", notas: [12, 9, 14, 11, 10, 13] },
  { nombre: "Daniela Peña", notas: [20, 18, 17, 19, 18, 20] },
  { nombre: "Eduardo Marín", notas: [8, 10, 9, 12, 7, 11] },
  { nombre: "Fabiola Rojas", notas: [16, 15, 18, 14, 16, 17] },
  { nombre: "Gustavo Linares", notas: [11, 13, 10, 9, 12, 14] },
  { nombre: "Héctor Nava", notas: [19, 20, 18, 17, 19, 18] },
  { nombre: "Isabel Quintero", notas: [14, 12, 13, 15, 11, 16] },
  { nombre: "Jesús Alvarado", notas: [9, 8, 11, 7, 10, 9] },
  { nombre: "Karla Mendoza", notas: [17, 18, 16, 19, 15, 17] },
];

const promedio = (notas: number[]): number =>
  Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 100) / 100;

const notaColor = (n: number): string =>
  n >= 10 ? "text-edu-success" : "text-edu-danger font-bold";

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function EvalBoletinesPage() {
  const [seccion, setSeccion] = useState(SECCIONES[0]);
  const [lapso, setLapso] = useState(LAPSOS[1]);
  const [generado, setGenerado] = useState(false);

  const aprobados = ESTUDIANTES.filter((e) => promedio(e.notas) >= 10).length;
  const reprobados = ESTUDIANTES.length - aprobados;

  // Plantilla de columnas de la sábana (inline para que Tailwind no la purgue)
  const gridCols: React.CSSProperties = {
    gridTemplateColumns: `1.6fr repeat(${MATERIAS.length}, 0.7fr) 0.9fr`,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Selector de sección + lapso */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex items-center gap-2">
          <div className="w-8 h-8 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_BG }}>
            <FileSpreadsheet className="w-4 h-4" style={{ color: TEAL }} />
          </div>
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Boletín — sábana de notas</h3>
        </div>
        <div className="px-5 py-[18px] flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Sección</label>
            <select
              value={seccion}
              onChange={(e) => { setSeccion(e.target.value); setGenerado(false); }}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-48 cursor-pointer focus:border-teal-600"
            >
              {SECCIONES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Lapso</label>
            <select
              value={lapso}
              onChange={(e) => { setLapso(e.target.value); setGenerado(false); }}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-40 cursor-pointer focus:border-teal-600"
            >
              {LAPSOS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setGenerado(true)}
            className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL }}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Generar boletín
          </button>
          <button
            type="button"
            disabled={!generado}
            className={`inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold border-[1.5px] transition-colors ${generado ? "border-edu-border bg-edu-surface text-edu-ink-700 hover:bg-edu-subtle cursor-pointer" : "border-edu-border-soft bg-edu-subtle text-edu-ink-300 cursor-not-allowed"}`}
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
        </div>
      </div>

      {generado && (
        <>
          {/* Resumen aprobados / reprobados */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
              <div>
                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">Estudiantes</p>
                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-ink">{ESTUDIANTES.length}</p>
              </div>
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center" style={{ backgroundColor: TEAL_BG }}>
                <Users style={{ width: "20px", height: "20px", color: TEAL }} />
              </div>
            </div>
            <div className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
              <div>
                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">Aprobados</p>
                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-success">{aprobados}</p>
              </div>
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center bg-edu-success-bg">
                <CheckCircle2 style={{ width: "20px", height: "20px" }} className="text-edu-success" />
              </div>
            </div>
            <div className="bg-edu-surface rounded-edu-card p-5 flex justify-between items-start border border-edu-border-soft">
              <div>
                <p className="text-edu-ink-500 text-[0.75rem] font-medium m-0 uppercase tracking-[0.05em]">Reprobados</p>
                <p className="text-[1.6rem] font-bold mt-1.5 m-0 text-edu-danger">{reprobados}</p>
              </div>
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center bg-edu-danger-bg">
                <XCircle style={{ width: "20px", height: "20px" }} className="text-edu-danger" />
              </div>
            </div>
          </div>

          {/* Sábana de notas */}
          <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">{seccion} · {lapso}</h3>
              <span className="text-[0.8rem] text-edu-ink-400 font-medium">Escala 1–20</span>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                {/* Cabecera */}
                <div style={gridCols} className="grid px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                  <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">Estudiante</span>
                  {MATERIAS.map((m) => (
                    <span key={m} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] text-center">{m}</span>
                  ))}
                  <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] text-center">Prom.</span>
                </div>
                {/* Filas */}
                {ESTUDIANTES.map((e, i) => {
                  const prom = promedio(e.notas);
                  return (
                    <div key={e.nombre} style={gridCols} className={`grid px-5 py-[11px] items-center transition-colors hover:bg-edu-subtle ${i < ESTUDIANTES.length - 1 ? "border-b border-edu-border-soft" : ""}`}>
                      <span className="text-sm text-edu-ink font-medium">{e.nombre}</span>
                      {e.notas.map((n, j) => (
                        <span key={j} className={`text-[0.875rem] text-center ${notaColor(n)}`}>{n}</span>
                      ))}
                      <span className={`text-[0.9rem] text-center font-bold ${prom >= 10 ? "text-edu-success" : "text-edu-danger"}`}>{prom.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {!generado && (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 text-center">
          <FileSpreadsheet className="w-8 h-8 mx-auto text-edu-ink-300" />
          <p className="text-edu-ink-500 text-sm mt-3 m-0">Selecciona una sección y un lapso, luego genera el boletín.</p>
        </div>
      )}
    </div>
  );
}
