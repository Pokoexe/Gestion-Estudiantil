import { accent } from "@themes/tokens";
import type { Inscripcion } from "@shared/services/actions/inscripciones";

interface TipoMeta {
    label: string;
    cls: string;
}

interface EstadoMeta {
    label: string;
    cls: string;
}

interface DetalleHeaderProps {
    record: Inscripcion;
    iniciales: string;
    tipo: TipoMeta;
    estadoMeta: EstadoMeta;
}

export function DetalleHeader({ record, iniciales, tipo, estadoMeta }: DetalleHeaderProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft p-5 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ backgroundColor: accent.amber.bg, color: accent.amber.fg }}>
                    {iniciales}
                </div>
                <div>
                    <h2 className="m-0 text-edu-ink font-bold text-[1.25rem]">{record.estNombre} {record.estApellido}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-flex items-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold ${tipo.cls}`}>{tipo.label}</span>
                        <span className="text-[0.8125rem] text-edu-ink-500">{record.gradoSolicitado}</span>
                        <span className="text-edu-ink-300">·</span>
                        <span className="text-[0.8125rem] text-edu-ink-400">Solicitud #{record.id} · {record.fechaInscripcion}</span>
                    </div>
                </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-edu-pill text-[0.78rem] font-semibold ${estadoMeta.cls}`}>
                {estadoMeta.label}
            </span>
        </div>
    );
}
