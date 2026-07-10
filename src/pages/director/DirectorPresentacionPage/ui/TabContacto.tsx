import { Type, Phone as PhoneIcon } from "lucide-react";
import type { LandingConfig } from "@/pages/Auth/LandingPage/interfaces/types";
import { Group } from "./Group";
import { TextField } from "./TextField";

export function TabContacto({
  config,
  patchContact,
}: {
  config: LandingConfig;
  patchContact: (p: Partial<LandingConfig["contact"]>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Group title="Encabezado" icon={Type} defaultOpen>
        <TextField label="Título" value={config.contact.heading} onChange={(v) => patchContact({ heading: v })} />
        <TextField label="Subtítulo" value={config.contact.subtitle} onChange={(v) => patchContact({ subtitle: v })} />
      </Group>
      <Group title="Datos de contacto" icon={PhoneIcon} defaultOpen>
        <TextField label="WhatsApp" value={config.contact.whatsapp} onChange={(v) => patchContact({ whatsapp: v })} placeholder="+58 412-000-0000" />
        <TextField label="Teléfono fijo" value={config.contact.phone} onChange={(v) => patchContact({ phone: v })} placeholder="+58 212-000-0000" />
        <TextField label="Correo electrónico" value={config.contact.email} onChange={(v) => patchContact({ email: v })} placeholder="contacto@colegio.edu" />
      </Group>
    </div>
  );
}
