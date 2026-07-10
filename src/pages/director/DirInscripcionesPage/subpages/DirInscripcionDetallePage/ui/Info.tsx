import React from "react";

interface InfoProps {
    icon: React.FC<{ className?: string }>;
    label: string;
    value: string;
    full?: boolean;
}

export function Info({ icon: Icon, label, value, full }: InfoProps) {
    return (
        <div className={`flex items-start gap-2.5 ${full ? "sm:col-span-2" : ""}`}>
            <div className="w-8 h-8 rounded-edu-control bg-edu-subtle flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-edu-ink-500" />
            </div>
            <div className="min-w-0">
                <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.04em] font-medium">{label}</div>
                <div className="text-[0.875rem] text-edu-ink font-medium break-words">{value || "—"}</div>
            </div>
        </div>
    );
}
