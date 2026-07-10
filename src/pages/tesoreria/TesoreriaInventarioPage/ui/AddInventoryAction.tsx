import { PackagePlus } from "lucide-react";

export function AddInventoryAction({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex gap-3 w-full flex-wrap">
      <button
        onClick={onClick}
        className="w-full inline-flex justify-center items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
      >
        <PackagePlus style={{ width: "16px", height: "16px" }} />
        Agregar inventario
      </button>
    </div>
  );
}
