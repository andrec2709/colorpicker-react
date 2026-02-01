import { usePalette } from "../../contexts/PaletteProvider";
import type { Color } from "../../domain/color/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useSaveColor() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return (color: Color, paletteId: string) => {
        repo.saveColor(color, paletteId);
        const palettes = repo.getAll();

        setPalettesData(palettes);
    };
}