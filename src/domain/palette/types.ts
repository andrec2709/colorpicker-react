import type { Color } from "../color/types";

export type PaletteData = {
    name: string;
    id: string;
    colors: Color[];
};

export type CreationPaletteData = Omit<PaletteData, 'id'>;