import { usePalette } from "../../contexts/PaletteContext";
import type { PaletteData } from "../../types/palette";
import usePaletteRepository from "./usePaletteRepository";

export default function useDeletePalette() {
    const repo = usePaletteRepository();
    const { setPalettesData, selectPalette } = usePalette();

    return (palette: PaletteData, newSelection: undefined | null | PaletteData = undefined) => {
        repo.deletePalette(palette);

        if (newSelection !== undefined) {
            selectPalette(newSelection);
        }

        const palettes = repo.getAll();
        setPalettesData(palettes);
    };
}