/* ------------------------------------------------------------------ */
/* Diálogo de confirmación reutilizable                                */
/* ------------------------------------------------------------------ */

type Tone = "success" | "danger" | "warning";

const TONE: Record<Tone, { iconWrap: string; confirmBtn: string }> = {
  success: { iconWrap: "bg-edu-success-bg text-edu-success", confirmBtn: "bg-edu-success text-white" },
  danger: { iconWrap: "bg-edu-danger-bg text-edu-danger", confirmBtn: "bg-edu-danger text-white" },
  warning: { iconWrap: "bg-edu-warning-bg text-edu-warning", confirmBtn: "bg-edu-warning text-white" },
};

interface ConfirmDialogProps {
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  icon?: React.FC<{ className?: string }>;
  /** Sobrescribe el color de fondo del botón de confirmar (p. ej. WhatsApp). */
  confirmStyle?: React.CSSProperties;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Continuar",
  cancelLabel = "Cancelar",
  tone = "success",
  icon: Icon,
  confirmStyle,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = TONE[tone];
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex flex-col items-center text-center gap-3">
          {Icon && (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.iconWrap}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">{title}</h3>
          {message && <p className="m-0 text-sm text-edu-ink-500">{message}</p>}
        </div>
        <div className="px-5 py-4 border-t border-edu-border-soft flex gap-2 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-border bg-edu-surface text-edu-ink-700 text-sm font-semibold cursor-pointer transition-colors hover:bg-edu-subtle"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={confirmStyle}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-none text-sm font-semibold cursor-pointer transition-colors hover:brightness-95 ${confirmStyle ? "text-white" : t.confirmBtn}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
