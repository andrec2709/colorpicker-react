
export type Color = {
    id: string;
    r: number;
    g: number;
    b: number;
    hex: string;
    name: string;
};

export type PaletteData = {
    name: string;
    id: string;
    colors: Color[];
};