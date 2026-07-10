import { useState } from "react";
import {
    Tag,
    Search,
    CreditCard,
    AlertTriangle,
    CalendarClock,
    Percent,
    Users,
    GraduationCap,
} from "lucide-react";
import { accent } from "@themes/tokens";
import { Pagination } from "@shared/ui/Pagination";
import { useFetch } from "@shared/services";
import { getPreciosHistorial, type PrecioEstado, type EsquemaPrecio } from "@shared/services/actions/precios";
import { PRECIO_ESTADO_META } from "@shared/services/data/precios";

const PER_PAGE = 6;

const COLS = "grid-cols-[1fr_1fr_1fr_0.9fr_1fr_1fr_0.9fr]";
const HEADERS = [
    "Período",
    "Mensualidad",
    "Morosidad",
    "Inicio mora",
    "Desc. hermanos",
    "Desc. docentes",
    "Estado",
];

export function useDirPrecios() {
    const { data: historial, loading } = useFetch(getPreciosHistorial, []);

    const [query, setQuery] = useState("");
    const [estadoFilter, setEstadoFilter] = useState<"todos" | PrecioEstado>("todos");
    const [page, setPage] = useState(1);

    const vigente = historial.find((p) => p.estado === "vigente") ?? historial[0];

    const KPIS = vigente
        ? [
              {
                  label: "Mensualidad",
                  value: vigente.mensualidad,
                  hint: "Cuota mensual por estudiante",
                  icon: CreditCard,
                  ac: accent.blue,
              },
              {
                  label: "Cobro por morosidad",
                  value: vigente.morosidad,
                  hint: "Recargo por pago tardío",
                  icon: AlertTriangle,
                  ac: accent.amber,
              },
              {
                  label: "Inicio de morosidad",
                  value: `Día ${vigente.inicioMorosidad}`,
                  hint: "Se cobra recargo desde este día",
                  icon: CalendarClock,
                  ac: accent.red,
              },
              {
                  label: "Descuentos",
                  value: `${vigente.descHermanos} / ${vigente.descDocentes}`,
                  hint: "Hermanos · Hijos de docentes",
                  icon: Percent,
                  ac: accent.purple,
              },
          ]
        : [];

    const filtered = historial
        .filter((x) => estadoFilter === "todos" || x.estado === estadoFilter)
        .filter((x) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return `${x.periodo} ${x.mensualidad} ${x.morosidad} ${x.descHermanos} ${x.descDocentes} ${x.registradoPor}`
                .toLowerCase()
                .includes(q);
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return {
        historial,
        loading,
        query,
        setQuery,
        estadoFilter,
        setEstadoFilter,
        page,
        setPage,
        vigente,
        KPIS,
        filtered,
        totalPages,
        currentPage,
        paged,
        COLS,
        HEADERS,
    };
}
