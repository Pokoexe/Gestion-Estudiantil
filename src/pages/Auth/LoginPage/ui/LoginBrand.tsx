import { GraduationCap } from "lucide-react";

interface LoginBrandProps {
  BG_IMAGE: string;
}

export function LoginBrand({ BG_IMAGE }: LoginBrandProps) {
  return (
    /* Panel derecho — solo desktop */
    <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-screen">
      <img
        src={BG_IMAGE}
        alt="Campus escolar moderno"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,86,219,0.72)_0%,rgba(17,24,39,0.55)_100%)]" />
      <div className="relative z-10 flex flex-col justify-end p-[48px_52px] h-full">
        <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-[12px] rounded-2xl border border-[rgba(255,255,255,0.18)] p-[28px_32px] max-w-[440px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-[rgba(255,255,255,0.9)] text-[0.8rem] font-semibold tracking-[0.08em] uppercase">
              Sistema de Gestión
            </span>
          </div>
          <p className="text-white text-[1.25rem] font-semibold leading-[1.4] mb-[10px]">
            Todo lo que tu institución necesita, en un solo lugar.
          </p>
          <p className="text-[rgba(255,255,255,0.72)] text-sm leading-[1.6]">
            Gestiona estudiantes, personal, calificaciones, asistencia y pagos — desde un panel unificado, con acceso 24/7.
          </p>
          <div className="flex items-center gap-5 mt-5">
            {[["7", "Roles"], ["24/7", "Acceso"], ["100%", "En la nube"]].map(([stat, label]) => (
              <div key={label}>
                <div className="text-white font-bold text-[1.1rem]">{stat}</div>
                <div className="text-[rgba(255,255,255,0.6)] text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
