import type { PaletteData } from "../../domain/palette/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useSavePalettesData() {
    const repo = usePaletteRepository();

    return async (data: PaletteData[]) => {
        await repo.saveAll(data);
        // TODO: update palettesData state when this is called
    };
}