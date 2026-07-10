import { X, MessageSquareWarning, FileCheck2 } from "lucide-react";

type Props = {
    modal: { id: number; docente: string };
    observacion: string;
    setObservacion: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
};

export function RechazoModal({ modal, observacion, setObservacion, onSubmit, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-edu-control bg-edu-danger-bg flex items-center justify-center">
                            <MessageSquareWarning className="w-4 h-4 text-edu-danger" />
                        </div>
                        <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Rechazar planificación</h3>
                    </div>
                    <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-5 flex flex-col gap-4">
                    <p className="m-0 text-[0.8125rem] text-edu-ink-500">Indícale a <span className="font-semibold text-edu-ink-700">{modal.docente}</span> el motivo del rechazo para que corrija su entrega.</p>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-edu-ink-700 text-sm font-medium">Observación</label>
                        <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} rows={4} required placeholder="Ej. Falta el cronograma de evaluaciones del lapso." className="border-[1.5px] border-edu-border rounded-edu-control px-3.5 py-2.5 text-edu-ink outline-none bg-edu-subtle text-[0.9375rem] w-full resize-none focus:border-edu-primary" />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer hover:bg-edu-subtle">Cancelar</button>
                        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-danger text-white text-sm font-semibold border-none cursor-pointer hover:opacity-90">
                            <FileCheck2 className="w-4 h-4" />
                            Rechazar entrega
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
