import { usePalette } from "../../contexts/PaletteProvider";
import type { CreationPaletteData } from "../../domain/palette/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useAddPalette() {
    const repo = usePaletteRepository();
    const { setPalettesData, selectPalette } = usePalette();

    return async (palette: CreationPaletteData) => {
        const createdPalette = await repo.addPalette(palette);
        const palettes = await repo.getAll();
        selectPalette(createdPalette);
        setPalettesData(palettes);
    };

}