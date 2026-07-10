export function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-[0.68rem] text-edu-ink-400 uppercase tracking-[0.05em] font-medium">{label}</div>
            <div className="text-[0.875rem] text-edu-ink font-medium">{value || "—"}</div>
        </div>
    );
}
