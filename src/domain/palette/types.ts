import type { Color } from "../color/types";

export type PaletteData = {
    name: string;
    id: string;
    colors: Color[];
    sortOrder: number;
};

export type CreationPaletteData = Omit<PaletteData, 'id' | 'sortOrder'>;