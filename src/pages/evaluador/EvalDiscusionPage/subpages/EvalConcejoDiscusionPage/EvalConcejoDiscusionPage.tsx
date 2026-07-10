import { useEvalConcejoDiscusion } from "./functions/useEvalConcejoDiscusion";
import { ConcejoHeader } from "./ui/ConcejoHeader";
import { AnioSelector } from "./ui/AnioSelector";
import { EmptyState } from "./ui/EmptyState";
import { EstudiantesTable } from "./ui/EstudiantesTable";

export function EvalConcejoDiscusionPage() {
  const {
    navigate,
    selAnio,
    setSelAnio,
    query,
    setQuery,
    setPage,
    ANIOS,
    listo,
    filtrados,
    totalPages,
    currentPage,
    paged,
    estaPostulado,
    abrirEstudiante,
    promedio,
  } = useEvalConcejoDiscusion();

  return (
    <div className="flex flex-col gap-5">
      <ConcejoHeader onVolver={() => navigate("/evaluador/discusion")} />
      <AnioSelector
        selAnio={selAnio}
        anios={ANIOS}
        onAnio={(a) => {
          setSelAnio(a);
          setPage(1);
        }}
      />
      {!listo ? (
        <EmptyState />
      ) : (
        <EstudiantesTable
          selAnio={selAnio}
          paged={paged}
          filtrados={filtrados}
          totalPages={totalPages}
          currentPage={currentPage}
          query={query}
          onQuery={(q) => {
            setQuery(q);
            setPage(1);
          }}
          onPageChange={setPage}
          onAbrir={abrirEstudiante}
          estaPostulado={estaPostulado}
          promedio={promedio}
        />
      )}
    </div>
  );
}
