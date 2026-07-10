import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useFetch } from "@shared/services";
import { getPostulaciones, postularEstudiante, type PostEstado } from "@shared/services/actions/discusiones";
import { getBoletines, getMaterias, type Boletin, type EvalNota } from "@shared/services/actions/boletines";
import { promedio, desglose, actividadesDe } from "@shared/services/data/boletines";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const ESTADO_META: Record<PostEstado, string> = {
  Pendiente: "bg-edu-warning-bg text-edu-warning",
  Aceptada: "bg-edu-success-bg text-edu-success",
  Rechazada: "bg-edu-danger-bg text-edu-danger",
};

export const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function adjuntoNombre(e: EvalNota): string {
  const base = e.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "evaluacion"}.jpg`;
}

export function mockAdjuntoEval(e: EvalNota): string {
  const grade = e.nota < 10 ? "#dc2626" : "#16a34a";
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='440' viewBox='0 0 640 440'>` +
    `<rect width='640' height='440' fill='#ece7dc'/>` +
    `<rect x='36' y='26' width='568' height='388' rx='10' fill='#fffdf7' stroke='#ddd6c6' stroke-width='2'/>` +
    `<text x='70' y='80' font-family='Georgia, serif' font-size='23' fill='#3a3a3a' font-weight='bold'>U.E. Colegio San José</text>` +
    `<text x='70' y='108' font-family='Georgia, serif' font-size='15' fill='#7a7a7a'>${e.tipo} · ${e.nombre}</text>` +
    `<line x1='70' y1='126' x2='430' y2='126' stroke='#e0dacb' stroke-width='2'/>` +
    `<circle cx='530' cy='92' r='44' fill='none' stroke='${grade}' stroke-width='4'/>` +
    `<text x='530' y='102' text-anchor='middle' font-family='Georgia, serif' font-size='32' fill='${grade}' font-weight='bold'>${e.nota}</text>` +
    `<text x='530' y='150' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='#9a9a9a'>/ 20</text>` +
    `<line x1='70' y1='182' x2='560' y2='182' stroke='#eae4d5' stroke-width='2'/>` +
    `<line x1='70' y1='216' x2='560' y2='216' stroke='#eae4d5' stroke-width='2'/>` +
    `<line x1='70' y1='250' x2='560' y2='250' stroke='#eae4d5' stroke-width='2'/>` +
    `<line x1='70' y1='284' x2='430' y2='284' stroke='#eae4d5' stroke-width='2'/>` +
    `<path d='M92 174 q30 -22 60 0 t60 0' fill='none' stroke='#5566aa' stroke-width='2.5' opacity='0.7'/>` +
    `<path d='M92 208 q46 -20 92 0 t92 0' fill='none' stroke='#5566aa' stroke-width='2.5' opacity='0.7'/>` +
    `<path d='M92 242 q30 -18 60 0 t80 0' fill='none' stroke='#5566aa' stroke-width='2.5' opacity='0.7'/>` +
    `<text x='396' y='372' font-family='cursive' font-size='22' fill='#2b6cb0'>Prof. ✓</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function useEvalDiscusionEstudiante() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("");
  const [postulando, setPostulando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [evalSel, setEvalSel] = useState<EvalNota | null>(null);

  const { data: POSTULACIONES } = useFetch(getPostulaciones, []);
  const { data: BOLETINES, loading: loadingBoletines } = useFetch(getBoletines, []);
  const { data: MATERIAS, loading: loadingMaterias } = useFetch(getMaterias, []);

  const loading = loadingBoletines || loadingMaterias;
  const b = BOLETINES.find((x) => String(x.id) === id);

  const materiaParam = searchParams.get("materia") ?? "";
  useEffect(() => {
    if (MATERIAS.length) setTab(MATERIAS.includes(materiaParam) ? materiaParam : MATERIAS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MATERIAS, materiaParam]);

  const actividades = b ? actividadesDe(b.id) : [];
  const prom = b ? promedio(b.notas) : 0;
  const idxTab = Math.max(0, MATERIAS.indexOf(tab));
  const notaTab = b ? b.notas[idxTab] : 0;
  const evals = b ? desglose(notaTab) : [];

  const postulacionActiva = b
    ? POSTULACIONES.find(
        (p) => p.estudiante === b.student && p.materia === tab && p.anio === `${b.anio} ${b.seccion}`,
      )
    : undefined;

  const lista = b ? BOLETINES.filter((x) => x.anio === b.anio) : [];
  const pos = b ? lista.findIndex((x) => x.id === b.id) : -1;
  const anterior = pos > 0 ? lista[pos - 1] : null;
  const siguiente = pos < lista.length - 1 ? lista[pos + 1] : null;

  const irA = (destino: Boletin | null) => {
    if (destino) navigate(`/evaluador/discusion/concejo/${destino.id}?materia=${encodeURIComponent(tab)}`);
    else navigate("/evaluador/discusion/concejo");
  };

  const confirmarPostulacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!b) return;
    await postularEstudiante({
      estudiante: b.student,
      materia: tab,
      anio: `${b.anio} ${b.seccion}`,
      nota: notaTab,
      motivo: motivo.trim() || "—",
      actividades,
      fechaPresentacion: fecha || undefined,
    });
    setPostulando(false);
    setMotivo("");
    setFecha("");
    irA(siguiente);
  };

  return {
    navigate,
    loading,
    b,
    MATERIAS,
    tab,
    setTab,
    postulando,
    setPostulando,
    motivo,
    setMotivo,
    fecha,
    setFecha,
    evalSel,
    setEvalSel,
    actividades,
    prom,
    notaTab,
    evals,
    postulacionActiva,
    lista,
    pos,
    anterior,
    siguiente,
    irA,
    confirmarPostulacion,
  };
}
