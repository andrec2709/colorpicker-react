import type { Color, CreationColor } from "../../domain/color/types";
import type { PaletteData, CreationPaletteData } from "../../domain/palette/types";

export default interface PaletteRepository {
    getAll(): PaletteData[];
    saveAll(data: PaletteData[]): void;
    getById(id: string): PaletteData | null;
    addColor(color: CreationColor, paletteId: string, toEnd: boolean): Color;
    deleteColor(colorId: string, paletteId: string): void;
    addPalette(palette: CreationPaletteData): PaletteData;
    deletePalette(palette: PaletteData): void;
    save(palette: PaletteData): void;
    saveColor(color: Color, paletteId: string): void;
}