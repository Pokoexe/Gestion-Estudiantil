/** Tarjeta de indicador general del perfil del estudiante. */
export interface Stat {
    label: string;
    value: string;
    hint: string;
    icon: React.FC<{ className?: string }>;
    iconBg: string;
    iconFg: string;
    subjectId?: number; // si está, la tarjeta enlaza a la materia
}
