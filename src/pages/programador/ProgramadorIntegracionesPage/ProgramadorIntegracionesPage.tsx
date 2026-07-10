import { useState } from "react";
import { Users, Shield, Crown, CheckCircle2, ChevronDown } from "lucide-react";
import { color } from "@themes/tokens";

type PlanId = "basico" | "intermedio" | "avanzado";

interface Funcion {
  nombre: string;
  modulo: string;
  roles: string[];
}

const ROLES_POR_PLAN: Record<PlanId, string[]> = {
  basico:     ["Docente", "Estudiante"],
  intermedio: ["Docente", "Estudiante", "Administrador", "Coordinador"],
  avanzado:   ["Docente", "Estudiante", "Administrador", "Coordinador", "Evaluador", "Director"],
};

const PLANES = [
  {
    id: "basico" as PlanId,
    nombre: "Básico",
    descripcion: "Funciones esenciales para la actividad docente y estudiantil.",
    bg: color.successBg,
    fg: color.success,
    Icon: Users,
  },
  {
    id: "intermedio" as PlanId,
    nombre: "Intermedio",
    descripcion: "Coordinación y administración del centro educativo.",
    bg: color.primary50,
    fg: color.primary,
    Icon: Shield,
  },
  {
    id: "avanzado" as PlanId,
    nombre: "Avanzado",
    descripcion: "Acceso completo: evaluación, dirección y gestión integral.",
    bg: color.purpleBg,
    fg: color.purple,
    Icon: Crown,
  },
];

const FUNCIONES: Funcion[] = [
  { nombre: "Consulta de notas y calificaciones",  modulo: "Académico",      roles: ["Estudiante"]                       },
  { nombre: "Registro de calificaciones",          modulo: "Académico",      roles: ["Docente"]                          },
  { nombre: "Control de asistencia",               modulo: "Académico",      roles: ["Docente"]                          },
  { nombre: "Visualización de horarios",           modulo: "Académico",      roles: ["Docente", "Estudiante"]            },
  { nombre: "Gestión de secciones y cursos",       modulo: "Coordinación",   roles: ["Coordinador"]                      },
  { nombre: "Reportes por sección",                modulo: "Coordinación",   roles: ["Coordinador"]                      },
  { nombre: "Control de acceso y usuarios",        modulo: "Administración", roles: ["Administrador"]                    },
  { nombre: "Gestión de pagos y bauches",          modulo: "Administración", roles: ["Administrador"]                    },
  { nombre: "Configuración del sistema",           modulo: "Administración", roles: ["Administrador"]                    },
  { nombre: "Rúbricas y evaluaciones",             modulo: "Evaluación",     roles: ["Evaluador"]                        },
  { nombre: "Reportes de desempeño docente",       modulo: "Evaluación",     roles: ["Evaluador", "Director"]            },
  { nombre: "Indicadores estratégicos",            modulo: "Dirección",      roles: ["Director"]                         },
  { nombre: "Supervisión general del sistema",     modulo: "Dirección",      roles: ["Director"]                         },
];

function isIncluded(fn: Funcion, planId: PlanId) {
  return fn.roles.some((r) => ROLES_POR_PLAN[planId].includes(r));
}

export function ProgramadorIntegracionesPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [tableOpen, setTableOpen] = useState(false);

  const handleKpiClick = (planId: PlanId) => {
    if (tableOpen && selectedPlan === planId) {
      setTableOpen(false);
    } else {
      setSelectedPlan(planId);
      setTableOpen(true);
    }
  };

  const activePlan = PLANES.find((p) => p.id === selectedPlan);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-edu-ink font-semibold text-[1rem] m-0">Planes del sistema</h2>
          <p className="text-edu-ink-400 text-[0.8125rem] mt-0.5 mb-0">
            Selecciona un plan para ver las funcionalidades incluidas en la plataforma.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-edu-control text-[0.8125rem] font-semibold"
          style={{ backgroundColor: color.purpleBg, color: color.purple }}
        >
          <Crown className="w-3.5 h-3.5" />
          Plan seleccionado: Avanzado
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANES.map((plan) => {
          const isActive = tableOpen && selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => handleKpiClick(plan.id)}
              className="text-left bg-edu-surface rounded-edu-card border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none"
              style={{ borderColor: isActive ? plan.fg : color.border }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0"
                  style={{ backgroundColor: plan.bg }}
                >
                  <plan.Icon className="w-5 h-5" style={{ color: plan.fg }} />
                </div>
                <ChevronDown
                  className="w-4 h-4 text-edu-ink-400 mt-1 transition-transform duration-200"
                  style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </div>

              <div className="text-[1.05rem] font-bold text-edu-ink mb-1">{plan.nombre}</div>
              <div className="text-[0.775rem] text-edu-ink-400 mb-3 leading-relaxed">
                {plan.descripcion}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {ROLES_POR_PLAN[plan.id].map((rol) => (
                  <span
                    key={rol}
                    className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill"
                    style={{ backgroundColor: plan.bg, color: plan.fg }}
                  >
                    {rol}
                  </span>
                ))}
              </div>

              <div className="text-[0.75rem] font-semibold" style={{ color: plan.fg }}>
                {ROLES_POR_PLAN[plan.id].length} roles incluidos
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          maxHeight: tableOpen ? "1100px" : "0",
          opacity: tableOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
        }}
      >
        {selectedPlan && activePlan && (
          <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-edu-border-soft">
              <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
                Funciones de la plataforma
              </h3>
              <p className="mt-0.5 text-edu-ink-400 text-[0.78rem] m-0">
                Plan{" "}
                <strong style={{ color: activePlan.fg }}>{activePlan.nombre}</strong>
                {" "}— {FUNCIONES.filter((fn) => isIncluded(fn, selectedPlan)).length} funciones disponibles
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[460px]">
                <div className="grid grid-cols-[1.6fr_1fr_80px] px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft">
                  <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                    Función
                  </span>
                  <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]">
                    Módulo
                  </span>
                  <span className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em] text-center">
                    Acceso
                  </span>
                </div>

                {FUNCIONES.filter((fn) => isIncluded(fn, selectedPlan)).map((fn, i, arr) => (
                  <div
                    key={fn.nombre}
                    className={`grid grid-cols-[1.6fr_1fr_80px] px-5 py-3 items-center transition-colors hover:bg-edu-subtle ${
                      i < arr.length - 1 ? "border-b border-edu-border-soft" : ""
                    }`}
                  >
                    <div className="text-[0.8125rem] text-edu-ink font-medium pr-3">{fn.nombre}</div>
                    <div>
                      <span className="text-[0.72rem] text-edu-ink-500 bg-edu-subtle px-2 py-0.5 rounded-edu-pill border border-edu-border-soft">
                        {fn.modulo}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-4 h-4" style={{ color: activePlan.fg }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
