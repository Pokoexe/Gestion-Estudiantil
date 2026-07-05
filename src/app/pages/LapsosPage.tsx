import { useState } from "react";
import {
  Plus,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { LAPSOS, CURRENT_LAPSO_ID, type Lapso } from "../data/lapsos";

const TEAL = "#0d9488";
const TEAL_BG = "#ccfbf1";
const TEAL_50 = "#f0fdfa";

const TODAY = "2026-07-05";

type LocalLapso = Omit<Lapso, "id"> & { id: number };

function diasEntre(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function fmtFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${Number(d)} ${meses[Number(m) - 1]} ${y}`;
}

function fmtFechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-");
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${Number(d)} de ${meses[Number(m) - 1]} de ${y}`;
}

const PER_PAGE = 6;

const COLS = "grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr_auto]";
const HEADERS = ["Lapso", "Período", "Inicio", "Cierre", "Estado", ""];

export function LapsosPage() {
  const [lapsos, setLapsos] = useState<LocalLapso[]>(LAPSOS.map((l) => ({ ...l })));

  const [editTarget, setEditTarget] = useState<number | null>(null);
  const [editInicio, setEditInicio] = useState("");
  const [editCierre, setEditCierre] = useState("");

  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoForm, setNuevoForm] = useState({ roman: "", periodo: "2026-I", inicio: "", cierre: "" });

  const [page, setPage] = useState(1);

  const current = lapsos.find((l) => l.id === CURRENT_LAPSO_ID)!;
  const diasTotal = Math.max(1, diasEntre(current.inicio, current.cierre));
  const diasTrans = Math.min(diasTotal, Math.max(0, diasEntre(current.inicio, TODAY)));
  const progreso = Math.round((diasTrans / diasTotal) * 100);

  const totalPages = Math.max(1, Math.ceil(lapsos.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = lapsos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openEdit = (id: number) => {
    const l = lapsos.find((lp) => lp.id === id)!;
    setEditInicio(l.inicio);
    setEditCierre(l.cierre);
    setEditTarget(id);
  };

  const guardarCierre = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget === null) return;
    setLapsos((prev) =>
      prev.map((l) =>
        l.id === editTarget
          ? {
              ...l,
              inicio: editInicio,
              cierre: editCierre,
              inicioLabel: fmtFechaLarga(editInicio),
              cierreLabel: fmtFechaLarga(editCierre),
            }
          : l
      )
    );
    setEditTarget(null);
  };

  const agregarLapso = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = Math.max(...lapsos.map((l) => l.id)) + 1;
    setLapsos((prev) => [
      ...prev,
      {
        id: nextId,
        roman: nuevoForm.roman,
        label: `Lapso ${nuevoForm.roman}`,
        periodo: nuevoForm.periodo,
        fullLabel: `Lapso ${nuevoForm.roman} · ${nuevoForm.periodo}`,
        inicio: nuevoForm.inicio,
        cierre: nuevoForm.cierre,
        inicioLabel: fmtFechaLarga(nuevoForm.inicio),
        cierreLabel: fmtFechaLarga(nuevoForm.cierre),
        estado: "proximo",
      },
    ]);
    setShowNuevo(false);
    setNuevoForm({ roman: "", periodo: "2026-I", inicio: "", cierre: "" });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Lapso en curso */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Lapso académico en curso</h3>
            <p className="mt-0.5 mb-0 text-edu-ink-400 text-[0.775rem]">Gestión y fechas del período vigente</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openEdit(current.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold border-[1.5px] border-edu-border text-edu-ink-700 bg-edu-surface cursor-pointer transition-colors hover:bg-edu-subtle"
            >
              <Pencil className="w-3.5 h-3.5" />
              Modificar cierre
            </button>
            <button
              onClick={() => setShowNuevo(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-edu-control text-[0.8125rem] font-semibold text-white border-none cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo lapso
            </button>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-[18px]">
          <div className="flex justify-between items-start flex-wrap gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[1.1rem] font-bold text-edu-ink">{current.fullLabel}</span>
                <span
                  className="inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold"
                  style={{ backgroundColor: TEAL_BG, color: TEAL }}
                >
                  En curso
                </span>
              </div>
              <p className="mt-1 mb-0 text-[0.8rem] text-edu-ink-500">
                Cierre del lapso:{" "}
                <strong className="text-edu-ink-700">{current.cierreLabel}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-[1.4rem] font-bold" style={{ color: TEAL }}>
                {progreso} %
              </div>
              <div className="text-[0.72rem] text-edu-ink-400">del lapso transcurrido</div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
              <div
                className="h-full rounded-edu-pill"
                style={{ width: `${progreso}%`, backgroundColor: TEAL }}
              />
            </div>
            <div className="flex justify-between text-[0.7rem] text-edu-ink-400">
              <span>{fmtFecha(current.inicio)}</span>
              <span>Hoy · {fmtFecha(TODAY)}</span>
              <span>{fmtFecha(current.cierre)}</span>
            </div>
          </div>

          <p className="m-0 text-[0.775rem] text-edu-ink-400">
            Inicio: <strong className="text-edu-ink-700">{current.inicioLabel}</strong>
            {" — "}
            Cierre: <strong className="text-edu-ink-700">{current.cierreLabel}</strong>
          </p>
        </div>
      </div>

      {/* Tabla de todos los lapsos */}
      <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Todos los lapsos</h3>
          <span className="text-[0.8rem] text-edu-ink-400 font-medium">{lapsos.length} lapsos registrados</span>
        </div>

        {/* Cabecera */}
        <div className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
              {h}
            </span>
          ))}
        </div>

        {paged.map((l, i) => {
          const isActual = l.id === CURRENT_LAPSO_ID;
          return (
            <div
              key={l.id}
              className={`grid ${COLS} px-5 py-[13px] items-center ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-edu-ink font-medium">{l.label}</span>
                {isActual && (
                  <span
                    className="inline-flex items-center px-2 py-[2px] rounded-edu-pill text-[0.65rem] font-semibold"
                    style={{ backgroundColor: TEAL_BG, color: TEAL }}
                  >
                    actual
                  </span>
                )}
              </div>
              <span className="text-[0.8125rem] text-edu-ink-500">{l.periodo}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{fmtFecha(l.inicio)}</span>
              <span className="text-[0.8125rem] text-edu-ink-500">{fmtFecha(l.cierre)}</span>
              <span>
                {l.estado === "en_curso" ? (
                  <span
                    className="inline-flex items-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold"
                    style={{ backgroundColor: TEAL_BG, color: TEAL }}
                  >
                    En curso
                  </span>
                ) : l.estado === "finalizado" ? (
                  <span className="inline-flex items-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold bg-slate-100 text-slate-500">
                    Finalizado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-[4px] rounded-edu-pill text-[0.7rem] font-semibold bg-edu-warning-bg text-edu-warning">
                    Próximo
                  </span>
                )}
              </span>
              <button
                onClick={() => openEdit(l.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-edu-chip text-[0.75rem] font-medium text-edu-ink-600 bg-edu-subtle border border-edu-border-soft cursor-pointer transition-colors hover:bg-edu-border-soft"
              >
                <Pencil className="w-3 h-3" />
                Cierre
              </button>
            </div>
          );
        })}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-edu-border-soft">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal: modificar cierre */}
      {editTarget !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setEditTarget(null)}
        >
          <div
            className="bg-edu-surface rounded-edu-card w-full max-w-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-edu-control flex items-center justify-center"
                  style={{ backgroundColor: TEAL_50 }}
                >
                  <Pencil className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Modificar fechas del lapso</h3>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                aria-label="Cerrar"
                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={guardarCierre} className="p-5 flex flex-col gap-4">
              <div className="px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft text-[0.8125rem] text-edu-ink-700">
                {lapsos.find((l) => l.id === editTarget)?.fullLabel}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Inicio</label>
                  <input
                    type="date"
                    value={editInicio}
                    onChange={(e) => setEditInicio(e.target.value)}
                    required
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Cierre</label>
                  <input
                    type="date"
                    value={editCierre}
                    onChange={(e) => setEditCierre(e.target.value)}
                    required
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: nuevo lapso */}
      {showNuevo && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowNuevo(false)}
        >
          <div
            className="bg-edu-surface rounded-edu-card w-full max-w-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-edu-control flex items-center justify-center"
                  style={{ backgroundColor: TEAL_50 }}
                >
                  <Plus className="w-4 h-4" style={{ color: TEAL }} />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Añadir nuevo lapso</h3>
              </div>
              <button
                onClick={() => setShowNuevo(false)}
                aria-label="Cerrar"
                className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={agregarLapso} className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Numeral (romano)</label>
                  <input
                    type="text"
                    value={nuevoForm.roman}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, roman: e.target.value })}
                    placeholder="IV"
                    required
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Período</label>
                  <input
                    type="text"
                    value={nuevoForm.periodo}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, periodo: e.target.value })}
                    placeholder="2026-II"
                    required
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Inicio</label>
                  <input
                    type="date"
                    value={nuevoForm.inicio}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, inicio: e.target.value })}
                    required
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-edu-ink-700 text-sm font-medium">Cierre</label>
                  <input
                    type="date"
                    value={nuevoForm.cierre}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, cierre: e.target.value })}
                    required
                    className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowNuevo(false)}
                  className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control text-white text-sm font-semibold border-none cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: TEAL }}
                >
                  <Save className="w-4 h-4" />
                  Añadir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
