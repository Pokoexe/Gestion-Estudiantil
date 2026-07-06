import { Info, AlertTriangle, type LucideIcon } from "lucide-react";

/**
 * Estado de solvencia del estudiante (mock) — fuente única usada por el banner
 * global de morosidad (AppLayout) y por la página de Pagos.
 */
export const MONTHS_OWED = 3; // 0 = solvente · 1–2 = leve · 3–4 = warning · 5+ = danger
export const MONTHLY_FEE = 200;
export const FEE_CURRENCY = "USD";
export const BILLING_DAY = 5;

export type DebtLevel = "low" | "warning" | "danger";

export const SOLVENT = MONTHS_OWED === 0;
export const DEBT_LEVEL: DebtLevel = MONTHS_OWED >= 5 ? "danger" : MONTHS_OWED >= 3 ? "warning" : "low";
export const OWED = MONTHS_OWED * MONTHLY_FEE;
export const MONTHS_LABEL = `${MONTHS_OWED} ${MONTHS_OWED === 1 ? "mes" : "meses"}`;

export const DEBT_MESSAGE = SOLVENT
    ? ""
    : DEBT_LEVEL === "danger"
        ? `Tienes ${MONTHS_LABEL} de mensualidad sin pagar (más de 5). Debes regularizar tu situación de inmediato.`
        : DEBT_LEVEL === "warning"
            ? `Acumulas ${MONTHS_LABEL} de mensualidad sin pagar. Ponte al día para evitar inconvenientes.`
            : `Tienes ${MONTHS_LABEL} de mensualidad pendiente. Regulariza tu pago para mantenerte solvente.`;

export const DEBT_STYLES: Record<DebtLevel, { banner: string; icon: LucideIcon }> = {
    low: { banner: "bg-edu-primary-50 text-edu-primary", icon: Info },
    warning: { banner: "bg-edu-warning-bg text-edu-warning", icon: AlertTriangle },
    danger: { banner: "bg-edu-danger-bg text-edu-danger", icon: AlertTriangle },
};
