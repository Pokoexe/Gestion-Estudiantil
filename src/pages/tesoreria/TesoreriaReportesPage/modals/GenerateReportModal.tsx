import { FilePlus2, X } from "lucide-react";
import type { ReportType } from "@shared/services/actions/tesoreria";

type Form = { type: ReportType; date: string; desc: string };

type Props = {
  form: Form;
  setForm: (f: Form) => void;
  responsable: string;
  setResponsable: (v: string) => void;
  reportTypes: ReportType[];
  responsables: string[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

export function GenerateReportModal({ form, setForm, responsable, setResponsable, reportTypes, responsables, onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-success-bg flex items-center justify-center">
              <FilePlus2 className="w-4 h-4 text-edu-success" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Generar reporte</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Tipo de eventualidad</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ReportType })}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-success"
            >
              {reportTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Fecha</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Ej. 3 jul 2026"
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full focus:border-edu-success"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-edu-ink-700 text-sm font-medium">Responsable</label>
              <select
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full cursor-pointer focus:border-edu-success"
              >
                {responsables.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-edu-ink-700 text-sm font-medium">Descripción</label>
            <textarea
              required
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Describe la eventualidad, causa y medidas tomadas…"
              rows={4}
              className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none transition-colors bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-success"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
              Cancelar
            </button>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-success text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:brightness-95">
              <FilePlus2 className="w-4 h-4" />
              Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
