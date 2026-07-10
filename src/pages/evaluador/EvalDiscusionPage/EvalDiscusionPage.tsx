import { useEvalDiscusion } from "./functions/useEvalDiscusion";
import { DiscusionHeader } from "./ui/DiscusionHeader";
import { PostulacionesFilters } from "./ui/PostulacionesFilters";
import { PostulacionesTable } from "./ui/PostulacionesTable";

export function EvalDiscusionPage() {
  const {
    navigate,
    query,
    setQuery,
    setPage,
    enLapso,
    filtrado,
    totalPages,
    currentPage,
    paged,
  } = useEvalDiscusion();

  return (
    <div className="flex flex-col gap-5">
      <DiscusionHeader onConcejo={() => navigate("/evaluador/discusion/concejo")} />
      <PostulacionesFilters
        query={query}
        onQuery={(q) => {
          setQuery(q);
          setPage(1);
        }}
      />
      <PostulacionesTable
        paged={paged}
        enLapsoLength={enLapso.length}
        filtradoLength={filtrado.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setPage}
      />
    </div>
  );
}
