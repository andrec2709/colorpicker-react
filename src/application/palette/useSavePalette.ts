import { usePalette } from "../../contexts/PaletteProvider";
import type { PaletteData } from "../../domain/palette/types";
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