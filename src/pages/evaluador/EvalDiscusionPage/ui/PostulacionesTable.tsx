import { Pagination } from "@shared/ui/Pagination";
import { ESTADO_META, COLS, HEADERS } from "../functions/useEvalDiscusion";
import type { PostEstado } from "@shared/services/actions/discusiones";

interface Postulacion {
  id: number;
  estudiante: string;
  materia: string;
  anio: string;
  nota: number;
  estado: PostEstado;
}

interface Props {
  paged: Postulacion[];
  enLapsoLength: number;
  filtradoLength: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (p: number) => void;
}

export function PostulacionesTable({
  paged,
  enLapsoLength,
  filtradoLength,
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  return (
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-edu-border-soft flex justify-between items-center">
        <h3 className="m-0 text-edu-ink font-semibold text-[0.9375rem]">
          Estudiantes postulados al Concejo
        </h3>
        <span className="text-[0.8rem] text-edu-ink-400 font-medium">
          {filtradoLength} caso{filtradoLength === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div
            className={`grid ${COLS} px-5 py-2.5 bg-edu-subtle border-b border-edu-border-soft`}
          >
            {HEADERS.map((h) => (
              <span
                key={h}
                className="text-[0.7rem] font-semibold text-edu-ink-400 uppercase tracking-[0.05em]"
              >
                {h}
              </span>
            ))}
          </div>

          {paged.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-edu-ink-400">
              {enLapsoLength === 0
                ? "Aún no hay estudiantes postulados al Concejo en este lapso."
                : "No hay registros que coincidan con la búsqueda."}
            </div>
          ) : (
            paged.map((p, i) => (
              <div
                key={p.id}
                className={`grid ${COLS} px-5 py-[13px] items-center transition-colors hover:bg-edu-subtle ${i < paged.length - 1 ? "border-b border-edu-border-soft" : ""}`}
              >
                <span className="text-sm text-edu-ink font-medium">{p.estudiante}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.materia}</span>
                <span className="text-[0.8125rem] text-edu-ink-500">{p.anio}</span>
                <span className="text-sm text-edu-ink-700 font-semibold">{p.nota}</span>
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-[3px] rounded-edu-pill text-[0.7rem] font-semibold w-fit ${ESTADO_META[p.estado]}`}
                >
                  {p.estado}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-edu-border-soft">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
