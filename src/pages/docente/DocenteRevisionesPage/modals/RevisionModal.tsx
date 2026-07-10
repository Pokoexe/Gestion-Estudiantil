import {
    X,
    FileText,
    Download,
    Upload,
    Send,
    Pencil,
} from "lucide-react";
import type { Revision, RevType } from "../interfaces";

interface RevisionModalProps {
    selected: Revision;
    changeFile: { url: string; name: string; isImage: boolean } | null;
    onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnviar: (id: string) => void;
    onEditar: (r: Revision) => void;
    onClose: () => void;
    TYPE_META: Record<
        RevType,
        { badge: string; block: string; hint: string; icon: React.FC<{ style?: React.CSSProperties }>; bg: string; fg: string }
    >;
}

export function RevisionModal({ selected, changeFile, onChangeFile, onEnviar, onEditar, onClose, TYPE_META }: RevisionModalProps) {
    const m = TYPE_META[selected.type];
    const Icon = m.icon;
    const redirige = selected.type === "planificacion" || selected.type === "plan";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-edu-surface rounded-edu-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
                <>
                    <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-start gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: m.bg }}>
                                <Icon style={{ width: "18px", height: "18px", color: m.fg }} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem] leading-snug">{selected.title}</h3>
                                <div className="text-[0.8rem] text-edu-ink-500 mt-0.5">{selected.materia} · {selected.seccion}</div>
                            </div>
                        </div>
                        <button onClick={onClose} aria-label="Cerrar" className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700 shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                        {selected.detalle && (
                            <div>
                                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium mb-1">Cambio solicitado</div>
                                <p className="text-sm text-edu-ink-700 leading-[1.6] m-0">{selected.detalle}</p>
                            </div>
                        )}

                        {/* Documento actual */}
                        <div className="flex items-center gap-3 p-3 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                            <div className="w-10 h-10 rounded-edu-chip bg-edu-primary-50 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-edu-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-edu-ink truncate">{selected.adjunto}</div>
                                <div className="text-xs text-edu-ink-400">Documento actual</div>
                            </div>
                            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-edu-control border-[1.5px] border-edu-primary-200 bg-edu-primary-50 text-edu-primary text-[0.8125rem] font-semibold cursor-pointer transition-colors hover:bg-edu-primary-100 shrink-0">
                                <Download className="w-3.5 h-3.5" />
                                Descargar
                            </button>
                        </div>

                        {/* Acción según tipo */}
                        {redirige ? (
                            <div className="flex items-start gap-2 px-3.5 py-3 rounded-edu-control bg-edu-primary-50 text-edu-primary text-[0.8125rem] leading-[1.5]">
                                <Pencil className="w-4 h-4 shrink-0 mt-px" />
                                <span>Para aplicar los cambios, abre la {selected.type === "planificacion" ? "planificación" : "plan de evaluación"} y edítalo directamente.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">Adjuntar archivo con el cambio</label>
                                <label className="border-[1.5px] border-dashed border-edu-border rounded-edu-control px-3.5 py-3 bg-edu-subtle cursor-pointer flex items-center justify-center gap-2 transition-colors hover:border-edu-primary-200 text-edu-ink-500 text-[0.8125rem]">
                                    <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onChangeFile} />
                                    <Upload className="w-4 h-4" />
                                    {changeFile ? "Cambiar archivo" : "Subir el examen o documento corregido"}
                                </label>
                                {changeFile && (
                                    <div className="mt-1">
                                        {changeFile.isImage ? (
                                            <img src={changeFile.url} alt={changeFile.name} className="max-h-48 w-full object-contain rounded-edu-control border border-edu-border-soft bg-edu-subtle" />
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-edu-control border border-edu-border-soft bg-edu-subtle">
                                                <FileText className="w-4 h-4 text-edu-primary shrink-0" />
                                                <span className="text-[0.8125rem] text-edu-ink truncate">{changeFile.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-5 py-3.5 border-t border-edu-border-soft flex items-center justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle">
                            Cerrar
                        </button>
                        {redirige ? (
                            <button
                                onClick={() => onEditar(selected)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover"
                            >
                                <Pencil className="w-4 h-4" />
                                {selected.type === "planificacion" ? "Modificar planificación" : "Modificar plan"}
                            </button>
                        ) : (
                            <button
                                onClick={() => onEnviar(selected.id)}
                                disabled={!changeFile}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-edu-control bg-edu-primary text-white text-sm font-semibold border-none cursor-pointer transition-colors hover:bg-edu-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                                Enviar cambio
                            </button>
                        )}
                    </div>
                </>
            </div>
        </div>
    );
}
