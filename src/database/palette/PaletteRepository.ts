import type { Color, CreationColor } from "../../domain/color/types";
import type { PaletteData, CreationPaletteData } from "../../domain/palette/types";

export default interface PaletteRepository {
    getAll(): Promise<PaletteData[]>;
    saveAll(data: PaletteData[]): Promise<void>;
    getById(id: string): Promise<PaletteData | null>;
    addColor(color: CreationColor, paletteId: string, toEnd: boolean): Promise<Color>;
    deleteColor(colorId: string, paletteId: string): Promise<void>;
    addPalette(palette: CreationPaletteData): Promise<PaletteData>;
    deletePalette(palette: PaletteData): Promise<void>;
    save(palette: PaletteData): Promise<void>;
    saveColor(color: Color, paletteId: string): Promise<void>;
}