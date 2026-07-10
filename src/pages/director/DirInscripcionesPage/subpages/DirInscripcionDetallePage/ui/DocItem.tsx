import { FileText } from "lucide-react";

interface DocItemProps {
    name: string;
    label: string;
}

export function DocItem({ name, label }: DocItemProps) {
    return (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-edu-control bg-edu-subtle border border-edu-border-soft">
            <FileText className="w-4 h-4 text-edu-primary shrink-0" />
            <div className="min-w-0 flex-1">
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.04em] font-medium">{label}</div>
                <div className="text-[0.8125rem] text-edu-ink font-medium truncate">{name || "No adjuntado"}</div>
            </div>
        </div>
    );
}
