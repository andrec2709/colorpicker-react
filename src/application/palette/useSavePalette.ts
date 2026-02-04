import { usePalette } from "../../contexts/PaletteProvider";
import type { PaletteData } from "../../domain/palette/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useSavePalette() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return async (palette: PaletteData) => {
        await repo.save(palette);
        const palettes = await repo.getAll();
        setPalettesData(palettes);
    };
}