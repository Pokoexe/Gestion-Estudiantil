import { User, IdCard, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import type { Inscripcion } from "@shared/services/actions/inscripciones";
import { SectionCard } from "./SectionCard";
import { Info } from "./Info";

interface StudentDataCardProps {
    record: Inscripcion;
}

export function StudentDataCard({ record }: StudentDataCardProps) {
    return (
        <SectionCard icon={User} title="Datos del estudiante">
            <Info icon={User} label="Nombres y apellidos" value={`${record.estNombre} ${record.estApellido}`} />
            <Info icon={IdCard} label="Cédula" value={record.estCedula || "Sin cédula"} />
            <Info icon={CalendarDays} label="Fecha de nacimiento" value={record.estFechaNac} />
            <Info icon={GraduationCap} label="Grado a inscribir" value={record.gradoSolicitado} />
            <Info icon={MapPin} label="Lugar de residencia" value={record.estResidencia} full />
        </SectionCard>
    );
}
