import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "@shared/services";
import { getCampos, getTipos, type Campo, type CampoTipo } from "@shared/services/actions/plantilla";

export const TEAL = "#0d9488";
export const TEAL_BG = "#ccfbf1";
export const TEAL_50 = "#f0fdfa";

export const SAMPLE: Record<CampoTipo, string[]> = {
  Texto: ["Biología", "Prof. M. Fernández", "Ecosistemas"],
  Número: ["25", "30", "20"],
  Fecha: ["06/07/2026", "15/07/2026", "27/07/2026"],
  Selección: ["5.º Año A", "Lapso II", "Examen"],
  "Sí / No": ["Sí", "No", "Sí"],
};

export const CAMPO_COLS = "grid-cols-[1.7fr_1fr_40px]";

export function useEvalPlantillas() {
  const navigate = useNavigate();
  const [campos, setCampos] = useState<Campo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [nuevo, setNuevo] = useState<{ nombre: string; tipo: CampoTipo }>({
    nombre: "",
    tipo: "Texto",
  });

  const { data: camposDefault } = useFetch(getCampos, []);
  const { data: TIPOS } = useFetch(getTipos, []);
  useEffect(() => setCampos(camposDefault), [camposDefault]);

  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const agregarCampo = () => {
    if (!nuevo.nombre.trim()) return;
    setCampos([...campos, { id: Date.now(), nombre: nuevo.nombre.trim(), tipo: nuevo.tipo }]);
    setNuevo({ nombre: "", tipo: "Texto" });
  };

  const eliminarCampo = (id: number) => setCampos((cs) => cs.filter((c) => c.id !== id));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  return {
    navigate,
    campos,
    setCampos,
    file,
    fileUrl,
    nuevo,
    setNuevo,
    TIPOS,
    agregarCampo,
    eliminarCampo,
    handleFile,
  };
}
