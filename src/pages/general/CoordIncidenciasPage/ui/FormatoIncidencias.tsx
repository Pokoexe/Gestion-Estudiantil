import { Settings2 } from "lucide-react";
import { accent } from "@themes/tokens";

interface FormatoIncidenciasProps {
    camposFormato: string[];
}

export function FormatoIncidencias({ camposFormato }: FormatoIncidenciasProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Settings2 className="text-edu-purple" style={{ width: 16, height: 16 }} />
                    <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">Formato de incidencias</h3>
                </div>
                <span className="text-[0.8rem] font-medium cursor-pointer" style={{ color: accent.purple.fg }}>Editar campos →</span>
            </div>
            <div className="px-5 py-4">
                <p className="m-0 mb-3 text-[0.8125rem] text-edu-ink-500">Campos que se incluyen al registrar una incidencia. Puedes activarlos o desactivarlos según la política del plantel.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {camposFormato.map((campo) => (
                        <label key={campo} className="flex items-center gap-2 px-3 py-2 rounded-edu-control bg-edu-subtle border border-edu-border-soft cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-edu-purple" />
                            <span className="text-[0.8rem] text-edu-ink-700">{campo}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
