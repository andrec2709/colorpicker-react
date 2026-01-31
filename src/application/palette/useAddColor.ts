import { usePalette } from "../../contexts/PaletteContext";
import { useSettings } from "../../contexts/SettingsContext";
import type { Color, CreationColor } from "../../types/palette";
import usePaletteRepository from "./usePaletteRepository";

export default function useAddColor() {
    const repo = usePaletteRepository();
    const { addColorToEnd } = useSettings();
    const { setPalettesData } = usePalette();

    return (id: string, color: CreationColor) => {
        repo.addColor(color, id, addColorToEnd);
        const palettes = repo.getAll();
        setPalettesData(palettes);
    }
}