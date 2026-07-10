import { User, Users, IdCard, Phone, Mail, MapPin } from "lucide-react";
import type { Inscripcion } from "@shared/services/actions/inscripciones";
import { SectionCard } from "./SectionCard";
import { Info } from "./Info";

interface RepresentativeDataCardProps {
    record: Inscripcion;
}

export function RepresentativeDataCard({ record }: RepresentativeDataCardProps) {
    return (
        <SectionCard icon={Users} title="Datos del representante">
            <Info icon={User} label="Nombres y apellidos" value={`${record.repNombre} ${record.repApellido}`} />
            <Info icon={IdCard} label="Cédula" value={record.repCedula} />
            <Info icon={Phone} label="Teléfono" value={record.repTelefono} />
            <Info icon={Mail} label="Correo electrónico" value={record.repEmail} />
            <Info icon={Phone} label="Teléfono de casa" value={record.repTelCasa || "—"} />
            <Info icon={Phone} label="Teléfono de respaldo" value={record.repTelRespaldo || "—"} />
            <Info icon={User} label="Representante sustituto" value={record.repSustituto || "—"} />
            <Info icon={MapPin} label="¿Dónde vive?" value={record.repResidencia} full />
        </SectionCard>
    );
}
