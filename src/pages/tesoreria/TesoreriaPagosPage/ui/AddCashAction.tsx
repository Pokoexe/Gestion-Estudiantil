import { HandCoins } from "lucide-react";

export function AddCashAction({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex gap-3 justify-end flex-wrap">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
      >
        <HandCoins style={{ width: "16px", height: "16px" }} />
        Agregar pago en efectivo
      </button>
    </div>
  );
}
