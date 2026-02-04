import { usePalette } from "../../contexts/PaletteProvider";
import type { PaletteData } from "../../domain/palette/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useDeletePalette() {
    const repo = usePaletteRepository();
    const { setPalettesData, selectPalette } = usePalette();

    return async (palette: PaletteData, newSelection: undefined | null | PaletteData = undefined) => {
        await repo.deletePalette(palette);

        if (newSelection !== undefined) {
            selectPalette(newSelection);
        }

        const palettes = await repo.getAll();
        setPalettesData(palettes);
    };
}