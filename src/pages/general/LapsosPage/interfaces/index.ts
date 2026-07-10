import { type Lapso } from "@shared/services/data/lapsos";
type LocalLapso = Omit<Lapso, "id"> & { id: number };
export type { LocalLapso };
