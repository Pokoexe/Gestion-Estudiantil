import type { AsistenciaPersona as Persona } from "@shared/services/actions/coordinador";

export type Tab = "estudiantes" | "docentes";
export type Estado = "presente" | "ausente";

export interface PanelProps {
    data: Persona[];
    setData: React.Dispatch<React.SetStateAction<Persona[]>>;
    entidad: string;
    metaLabel: string;
    tablaTitulo: string;
    tablaHint: string;
    icon: React.FC<{ className?: string }>;
}

export type { Persona };
