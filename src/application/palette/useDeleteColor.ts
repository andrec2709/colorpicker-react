import { usePalette } from "../../contexts/PaletteProvider";
import usePaletteRepository from "./usePaletteRepository";

export default function useDeleteColor() {
    const repo = usePaletteRepository();
    const { setPalettesData } = usePalette();

    return async (colorId: string, paletteId: string) => {
        await repo.deleteColor(colorId, paletteId);
        const palettes = await repo.getAll();
        setPalettesData(palettes);
    };
}