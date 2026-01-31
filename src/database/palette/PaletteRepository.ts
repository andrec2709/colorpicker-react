import type { Color, CreationColor, CreationPaletteData, PaletteData } from "../../types/palette";

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