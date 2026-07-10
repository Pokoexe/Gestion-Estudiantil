import {
  X,
  Check,
  Receipt,
  User,
  GraduationCap,
  Coins,
  Landmark,
  Hash,
  CalendarDays,
  MailQuestion,
} from "lucide-react";
import { BAUCHE_MOCK } from "@shared/services/data/baucheMock";

/* ------------------------------------------------------------------ */
/* Modal reutilizable: datos + bauche (imagen) de una transferencia    */
/* ------------------------------------------------------------------ */

interface BaucheModalProps {
  rep: string;
  student: string;
  amount: string;
  method: string;
  reference: string;
  date: string;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  showOptions: boolean;
}

export function BaucheModal({
  rep,
  student,
  amount,
  method,
  reference,
  date,
  onClose,
  onAccept,
  onReject,
  showOptions
}: BaucheModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-edu-surface rounded-edu-card w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center sticky top-0 bg-edu-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-edu-control bg-edu-warning-bg flex items-center justify-center">
              <Receipt className="w-4 h-4 text-edu-warning" />
            </div>
            <h3 className="m-0 text-edu-ink font-semibold text-[0.95rem]">Comprobante de transferencia</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-edu-ink-400 bg-transparent border-none cursor-pointer p-1 flex items-center hover:text-edu-ink-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo: bauche (imagen) + datos */}
        <div className="p-5 grid grid-cols-[minmax(0,1fr)_1fr] gap-5 max-[560px]:grid-cols-1">
          {/* Bauche (imagen adjunta) */}
          <div>
            <p className="text-[0.7rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em] m-0 mb-2">Bauche adjunto</p>
            <img
              src={BAUCHE_MOCK}
              alt="Comprobante de la transferencia"
              className="w-full rounded-edu-card border border-edu-border-soft bg-edu-subtle"
            />
          </div>

          {/* Datos de la transferencia */}
          <div className="flex flex-col gap-3.5">
            <p className="text-[0.7rem] text-edu-ink-400 font-semibold uppercase tracking-[0.05em] m-0">Datos de la transferencia</p>
            <InfoRow icon={User} label="Representante" value={rep} />
            <InfoRow icon={GraduationCap} label="Estudiante" value={student} />
            <InfoRow icon={Coins} label="Monto" value={amount} />
            <InfoRow icon={Landmark} label="Banco / método" value={method} />
            <InfoRow icon={Hash} label="Referencia (bauche)" value={reference} />
            <InfoRow icon={CalendarDays} label="Fecha del pago" value={date} />
            {!showOptions &&
              <InfoRow icon={MailQuestion} label="Estado del pago" value={'En revisión'} />
            }
          </div>
        </div>

        {/* Acciones */}
        {
          showOptions &&
          <div className="px-5 py-4 border-t border-edu-border-soft flex gap-2 justify-end sticky bottom-0 bg-edu-surface">
            <button
              onClick={onReject}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-[1.5px] border-edu-danger-bg bg-edu-danger-bg text-edu-danger text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
            >
              <X className="w-4 h-4" />
              Rechazar
            </button>
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-edu-control border-none bg-edu-success text-white text-sm font-semibold cursor-pointer transition-colors hover:brightness-95"
            >
              <Check className="w-4 h-4" />
              Confirmar pago
            </button>
          </div>
        }

      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.FC<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-edu-control bg-edu-subtle flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-edu-ink-500" />
      </div>
      <div className="min-w-0">
        <div className="text-[0.7rem] text-edu-ink-400 uppercase tracking-[0.04em]">{label}</div>
        <div className="text-[0.875rem] text-edu-ink font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
