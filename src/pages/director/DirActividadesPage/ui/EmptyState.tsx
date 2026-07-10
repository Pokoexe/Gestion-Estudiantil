import { FlaskConical } from "lucide-react";

export function EmptyState() {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft px-5 py-12 flex flex-col items-center gap-2 text-center">
      <FlaskConical className="w-8 h-8 text-edu-ink-300" />
      <span className="text-sm text-edu-ink-500">No hay actividades que coincidan con la búsqueda.</span>
    </div>
  );
}
