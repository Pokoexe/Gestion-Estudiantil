import { useEffect, useState } from "react";
import {
  Trophy,
  Palette,
  FlaskConical,
  Music,
} from "lucide-react";
import { accent } from "@themes/tokens";
import { useFetch } from "@shared/services";
import { getActividades, type Activity, type ActType } from "@shared/services/actions/director";

const PER_PAGE = 6;

export const TYPE_META: Record<ActType, { bg: string; fg: string; icon: React.FC<{ style?: React.CSSProperties }> }> = {
  Deportiva: { bg: accent.green.bg, fg: accent.green.fg, icon: Trophy },
  Cultural: { bg: accent.purple.bg, fg: accent.purple.fg, icon: Palette },
  Académica: { bg: accent.blue.bg, fg: accent.blue.fg, icon: FlaskConical },
  Curso: { bg: accent.amber.bg, fg: accent.amber.fg, icon: Music },
};

export const FILTERS: (ActType | "Todas")[] = ["Todas", "Deportiva", "Cultural", "Académica", "Curso"];

export function useDirActividades() {
  const { data: actividades } = useFetch(getActividades, []);
  const [items, setItems] = useState<Activity[]>([]);
  useEffect(() => setItems(actividades), [actividades]);
  const [filter, setFilter] = useState<ActType | "Todas">("Todas");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ name: string; type: ActType; teacher: string; capacity: string }>({
    name: "",
    type: "Deportiva",
    teacher: "",
    capacity: "20",
  });

  const filtered = items
    .filter((a) => filter === "Todas" || a.type === filter)
    .filter((a) => !query.trim() || a.name.toLowerCase().includes(query.trim().toLowerCase()) || a.teacher.toLowerCase().includes(query.trim().toLowerCase()));

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged       = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const accept = (id: number) =>
    setItems((list) => list.map((a) => (a.id === id ? { ...a, status: "Activa" } : a)));
  const remove = (id: number) => setItems((list) => list.filter((a) => a.id !== id));

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Activity = {
      id: Date.now(),
      name: form.name.trim() || "Nueva actividad",
      type: form.type,
      teacher: form.teacher.trim() || "Por asignar",
      enrolled: 0,
      capacity: Number(form.capacity) || 20,
      status: "Por aceptar",
    };
    setItems((list) => [next, ...list]);
    setShowModal(false);
    setForm({ name: "", type: "Deportiva", teacher: "", capacity: "20" });
  };

  return {
    items,
    filter,
    setFilter,
    query,
    setQuery,
    page,
    setPage,
    showModal,
    setShowModal,
    form,
    setForm,
    filtered,
    paged,
    currentPage,
    totalPages,
    accept,
    remove,
    create,
    TYPE_META,
    FILTERS,
  };
}
