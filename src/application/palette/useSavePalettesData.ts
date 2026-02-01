import type { PaletteData } from "../../domain/palette/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useSavePalettesData() {
    const repo = usePaletteRepository();

    return (data: PaletteData[]) => {
        repo.saveAll(data);
    };
}