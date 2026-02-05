import idbPaletteInitializer, { IndexedDbPaletteDbInitializer } from "../../database/palette/IndexedDbPaletteDbInitializer";
import { IndexedDbPaletteRepository } from "../../database/palette/IndexedDbPaletteRepository";
import LocalStoragePaletteRepository from "../../database/palette/LocalStoragePaletteRepository";
import paletteSorter from "../../domain/palette/sorter/PaletteSorter";

export default function usePaletteRepository() {
    // return new LocalStoragePaletteRepository('palettesData');
    return new IndexedDbPaletteRepository(idbPaletteInitializer, paletteSorter);
}