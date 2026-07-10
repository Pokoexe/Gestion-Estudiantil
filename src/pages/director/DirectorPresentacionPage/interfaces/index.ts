export type Tab = "plantillas" | "docentes" | "galeria" | "contacto" | "orden";
export type Device = "desktop" | "mobile";
export type Flash = { tone: "ok" | "warn"; msg: string } | null;
export type Confirm = { title: string; tone?: "success" | "danger" | "warning"; icon?: React.FC<{ className?: string }>; confirmLabel?: string; onConfirm: () => void } | null;
