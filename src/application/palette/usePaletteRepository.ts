import LocalStoragePaletteRepository from "../../database/palette/LocalStoragePaletteRepository";

export default function usePaletteRepository() {
    return new LocalStoragePaletteRepository('palettesData');
}