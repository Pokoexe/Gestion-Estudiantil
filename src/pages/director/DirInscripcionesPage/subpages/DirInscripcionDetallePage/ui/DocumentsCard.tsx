import { FileText, GraduationCap, ImageIcon } from "lucide-react";
import type { Inscripcion } from "@shared/services/actions/inscripciones";
import { SectionCard } from "./SectionCard";
import { Info } from "./Info";
import { DocItem } from "./DocItem";

interface DocumentsCardProps {
    record: Inscripcion;
}

export function DocumentsCard({ record }: DocumentsCardProps) {
    return (
        <SectionCard icon={FileText} title="Documentos suministrados">
            <div className="sm:col-span-2 flex flex-col gap-2.5">
                <Info
                    icon={GraduationCap}
                    label="Tipo de ingreso"
                    value={record.primeraVez ? "Nuevo ingreso (primera vez)" : "Ya estudiaba en la institución"}
                />
                <DocItem name={record.actaNacimiento} label="Acta de nacimiento" />
                {record.primeraVez && <DocItem name={record.boletin} label="Boletín del grado anterior" />}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
                    <ImageIcon className="w-4 h-4 text-edu-primary shrink-0" />
                    <span className="text-[0.8125rem] text-edu-ink flex-1">Fotos del estudiante</span>
                    <span className="text-[0.78rem] text-edu-ink-500 font-medium">{record.fotosCount} foto(s)</span>
                </div>
            </div>
        </SectionCard>
    );
}
