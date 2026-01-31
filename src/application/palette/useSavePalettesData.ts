import type { PaletteData } from "../../types/palette";
import usePaletteRepository from "./usePaletteRepository";

export default function useSavePalettesData() {
    const repo = usePaletteRepository();

    return (data: PaletteData[]) => {
        repo.saveAll(data);
    };
}