import usePaletteRepository from "./usePaletteRepository"

export default function useReadPalettesData() {
    const repo = usePaletteRepository();
    
    return async () => {
        const palettes = await repo.getAll();

        return palettes;
    }
}