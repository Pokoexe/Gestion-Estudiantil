import { FilePlus2 } from "lucide-react";

export function GenerateReportAction({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex gap-3 flex-wrap justify-end">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-[9px] px-5 py-[11px] rounded-edu-control text-sm font-semibold cursor-pointer transition-colors border-none bg-edu-success text-white hover:brightness-95"
      >
        <FilePlus2 style={{ width: "16px", height: "16px" }} />
        Generar reporte
      </button>
    </div>
  );
}
