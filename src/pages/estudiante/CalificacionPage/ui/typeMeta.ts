import { FileText, Presentation, FlaskConical, PenLine } from "lucide-react";
import { color } from "@themes/tokens";
import type { EvalType } from "@shared/services/actions/estudiante";

/** Metadatos de presentación por tipo de evaluación (icono, colores y etiqueta). */
export const TYPE_META: Record<EvalType, { icon: React.FC<{ style?: React.CSSProperties }>; bg: string; color: string; label: string }> = {
    presentation: { icon: Presentation, bg: color.primary50, color: color.primary, label: "Exposición" },
    exam: { icon: FileText, bg: color.warningBg, color: color.warning, label: "Examen" },
    lab: { icon: FlaskConical, bg: color.successBg, color: color.success, label: "Laboratorio" },
    essay: { icon: PenLine, bg: color.purpleBg, color: color.purple, label: "Ensayo" },
};
