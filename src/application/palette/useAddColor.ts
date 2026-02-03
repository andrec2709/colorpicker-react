import { usePalette } from "../../contexts/PaletteProvider";
import type { CreationColor } from "../../domain/color/types";
import usePaletteRepository from "./usePaletteRepository";

export default function useAddColor() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return (id: string, color: CreationColor, toEnd: boolean = false) => {
        repo.addColor(color, id, toEnd); // TODO: addColorToEnd option
        const palettes = repo.getAll();
        setPalettesData(palettes);
    }
}