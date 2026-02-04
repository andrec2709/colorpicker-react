import { usePalette } from "../../contexts/PaletteProvider";
import type { CreationColor } from "../../domain/color/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useAddColor() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return async (id: string, color: CreationColor, toEnd: boolean = false) => {
        await repo.addColor(color, id, toEnd); // TODO: addColorToEnd option
        const palettes = await repo.getAll();
        setPalettesData(palettes);
    }
}