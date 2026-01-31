import usePaletteRepository from "./usePaletteRepository"

export default function useReadPalettesData() {
    const repo = usePaletteRepository();
    
    return () => {
        const palettes = repo.getAll();

        return palettes;
    }
}