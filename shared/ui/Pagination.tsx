import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Calcula los elementos visibles de la paginación con puntos suspensivos.
 * Reutilizable en cualquier vista que necesite paginar.
 */
export function getPaginationRange(
    current: number,
    total: number,
    siblings = 1,
): (number | "ellipsis")[] {
    const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Primera + última + actual + 2 vecinos + 2 puntos suspensivos.
    const totalPageNumbers = siblings * 2 + 5;
    if (totalPageNumbers >= total) return range(1, total);

    const leftSibling = Math.max(current - siblings, 1);
    const rightSibling = Math.min(current + siblings, total);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    if (!showLeftDots && showRightDots) {
        return [...range(1, 3 + 2 * siblings), "ellipsis", total];
    }
    if (showLeftDots && !showRightDots) {
        return [1, "ellipsis", ...range(total - (3 + 2 * siblings) + 1, total)];
    }
    return [1, "ellipsis", ...range(leftSibling, rightSibling), "ellipsis", total];
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    /** Cantidad de páginas vecinas a mostrar alrededor de la actual. */
    siblings?: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    siblings = 1,
    className = "",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPaginationRange(currentPage, totalPages, siblings);
    const go = (p: number) => {
        if (p >= 1 && p <= totalPages && p !== currentPage) onPageChange(p);
    };

    const arrowCls =
        "w-9 h-9 rounded-edu-control border border-edu-border bg-edu-surface flex items-center justify-center text-edu-ink-500 transition-colors enabled:cursor-pointer enabled:hover:border-edu-primary-200 enabled:hover:text-edu-primary disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div className={`flex items-center justify-center gap-1.5 ${className}`}>
            <button
                type="button"
                onClick={() => go(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className={arrowCls}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p, i) =>
                p === "ellipsis" ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-edu-ink-400 text-sm"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => go(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`min-w-9 h-9 px-2 rounded-edu-control border text-[0.8125rem] font-semibold transition-colors cursor-pointer ${
                            p === currentPage
                                ? "border-edu-primary bg-edu-primary text-white"
                                : "border-edu-border bg-edu-surface text-edu-ink-700 hover:border-edu-primary-200 hover:text-edu-primary"
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => go(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className={arrowCls}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
