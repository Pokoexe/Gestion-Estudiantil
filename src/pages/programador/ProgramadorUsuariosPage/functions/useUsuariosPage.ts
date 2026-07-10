import { useState, useMemo } from "react";
import { useFetch } from "@shared/services";
import { getProgUsers, getProgRoleDistribution } from "@shared/services/actions/misc";
import type { RoleKey } from "@shared/services/actions/misc";

const PAGE_SIZE = 6;

export function useUsuariosPage() {
  const { data: users, loading: loadingUsers } = useFetch(getProgUsers, []);
  const { data: roleDistribution, loading: loadingRoles } = useFetch(getProgRoleDistribution, []);
  const [query, setQueryRaw] = useState("");
  const [roleFilter, setRoleRaw] = useState<RoleKey | "">("");
  const [sortOrder, setSortOrderRaw] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);

  function setQuery(v: string) { setQueryRaw(v); setPage(1); }
  function setRoleFilter(v: RoleKey | "") { setRoleRaw(v); setPage(1); }
  function setSortOrder(v: "desc" | "asc") { setSortOrderRaw(v); setPage(1); }

  const filtered = useMemo(() => {
    let result = users;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    if (roleFilter) result = result.filter((u) => u.role === roleFilter);
    const sorted = [...result].sort((a, b) =>
      sortOrder === "asc"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt),
    );
    return sorted;
  }, [users, query, roleFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalUsuarios = roleDistribution.reduce((acc, r) => acc + r.usuarios, 0);

  return {
    loading: loadingUsers || loadingRoles,
    query,
    setQuery,
    roleFilter,
    setRoleFilter,
    sortOrder,
    setSortOrder,
    currentPage,
    totalPages,
    paged,
    setPage,
    roleDistribution,
    totalUsuarios,
  };
}
