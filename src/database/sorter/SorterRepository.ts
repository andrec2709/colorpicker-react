import type { PaletteData } from "../../domain/palette/types";

export default interface SorterRepository {
    getAll(): Promise<PaletteData[]>;
    save(data: PaletteData): Promise<void>;
    saveAll(data: PaletteData[]): Promise<void>;
    getHighest(): Promise<PaletteData>;
    getLowest(): Promise<PaletteData>;
}