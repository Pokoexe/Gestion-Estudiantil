import React from "react";

interface SectionCardProps {
    icon: React.FC<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}

export function SectionCard({ icon: Icon, title, children }: SectionCardProps) {
    return (
        <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-4 py-3 border-b border-edu-border-soft flex items-center gap-2">
                <div className="w-7 h-7 rounded-edu-control bg-edu-primary-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-edu-primary" />
                </div>
                <h3 className="m-0 text-edu-ink font-semibold text-[0.9rem]">{title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 p-4">{children}</div>
        </div>
    );
}
