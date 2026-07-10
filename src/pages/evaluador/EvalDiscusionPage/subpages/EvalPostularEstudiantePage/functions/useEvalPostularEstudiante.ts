import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFetch } from "@shared/services";
import { postularEstudiante } from "@shared/services/actions/discusiones";
import { getBoletines, getMaterias } from "@shared/services/actions/boletines";
import { promedio, desglose, actividadesDe } from "@shared/services/data/boletines";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const EVAL_COLS = "grid-cols-[2fr_1fr_0.7fr_0.7fr]";

export function useEvalPostularEstudiante() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [materia, setMateria] = useState("");
  const [nota, setNota] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");

  const { data: BOLETINES, loading: loadingBoletines } = useFetch(getBoletines, []);
  const { data: MATERIAS, loading: loadingMaterias } = useFetch(getMaterias, []);

  const loading = loadingBoletines || loadingMaterias;
  const b = BOLETINES.find((x) => String(x.id) === id);

  const idxMenor = b ? b.notas.reduce((m, n, i, a) => (n < a[m] ? i : m), 0) : 0;

  useEffect(() => {
    if (b && MATERIAS.length) {
      setMateria(MATERIAS[idxMenor]);
      setNota(String(b.notas[idxMenor]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b, MATERIAS]);

  const prom = b ? promedio(b.notas) : 0;
  const actividades = b ? actividadesDe(b.id) : [];

  const cambiarMateria = (m: string) => {
    if (!b) return;
    setMateria(m);
    setNota(String(b.notas[MATERIAS.indexOf(m)]));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!b) return;
    await postularEstudiante({
      estudiante: b.student,
      materia,
      anio: `${b.anio} ${b.seccion}`,
      nota: Number(nota) || 0,
      motivo: motivo.trim() || "—",
      actividades,
      fechaPresentacion: fecha || undefined,
    });
    navigate("/evaluador/discusion/concejo");
  };

  return {
    navigate,
    loading,
    b,
    MATERIAS,
    materia,
    setMateria,
    nota,
    setNota,
    motivo,
    setMotivo,
    fecha,
    setFecha,
    prom,
    actividades,
    cambiarMateria,
    enviar,
    desglose,
  };
}
