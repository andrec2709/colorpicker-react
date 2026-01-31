import { usePalette } from "../../contexts/PaletteContext";
import type { PaletteData } from "../../types/palette";
import usePaletteRepository from "./usePaletteRepository";

export default function useSavePalette() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return (palette: PaletteData) => {
        repo.save(palette);
        const palettes = repo.getAll();
        setPalettesData(palettes);
    };
}