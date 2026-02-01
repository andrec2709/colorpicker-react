import { usePalette } from "../../contexts/PaletteProvider";
import usePaletteRepository from "./usePaletteRepository";

export default function useDeleteColor() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return (colorId: string, paletteId: string) => {
        repo.deleteColor(colorId, paletteId);
        const palettes = repo.getAll();
        setPalettesData(palettes);
    };
}