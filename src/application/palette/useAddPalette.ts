import { usePalette } from "../../contexts/PaletteProvider";
import type { CreationPaletteData } from "../../domain/palette/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useAddPalette() {
    const repo = usePaletteRepository();
    const { setPalettesData, selectPalette } = usePalette();

    return (palette: CreationPaletteData) => {
        const createdPalette = repo.addPalette(palette);
        const palettes = repo.getAll();
        selectPalette(createdPalette);
        setPalettesData(palettes);
    };

}