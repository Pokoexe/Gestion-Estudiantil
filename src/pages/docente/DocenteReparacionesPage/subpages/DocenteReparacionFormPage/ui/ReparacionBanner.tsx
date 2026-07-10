import { Wrench } from "lucide-react";

interface ReparacionBannerProps {
    subject: string;
    section: string;
    yaCreada: boolean;
}

export function ReparacionBanner({ subject, section, yaCreada }: ReparacionBannerProps) {
    return (
        <div className="bg-edu-primary rounded-edu-card px-6 py-[22px] flex justify-between items-center flex-wrap gap-3">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Wrench style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.8)" }} />
                    <span className="text-xs text-[rgba(255,255,255,0.75)] font-medium uppercase tracking-[0.06em]">
                        {yaCreada ? "Modificar reparación" : "Crear reparación"} · Ciclo escolar 2026-I
                    </span>
                </div>
                <h2 className="text-white mb-1.5 text-xl font-bold m-0">{subject}</h2>
                <div className="flex gap-4 flex-wrap">
                    <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">{section}</span>
                    <span className="text-[0.8rem] text-[rgba(255,255,255,0.75)]">Materia reprobada</span>
                </div>
            </div>
        </div>
    );
}
