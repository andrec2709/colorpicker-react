import { usePalette } from "../../contexts/PaletteProvider";
import type { Color } from "../../domain/color/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useSaveColor() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return async (color: Color, paletteId: string) => {
        await repo.saveColor(color, paletteId);
        const palettes = await repo.getAll();

        setPalettesData(palettes);
    };
}