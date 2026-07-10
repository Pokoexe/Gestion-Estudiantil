import { CheckCircle2, AlertCircle } from "lucide-react";
import type { Flash } from "../interfaces";

export function FlashMessage({ flash }: { flash: NonNullable<Flash> }) {
  return (
    <div className={`fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-edu-control px-4 py-3 text-[0.85rem] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${flash.tone === "ok" ? "bg-edu-ink text-white" : "bg-edu-warning-bg text-edu-warning border border-edu-warning-strong/30"}`}>
      {flash.tone === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {flash.msg}
    </div>
  );
}
