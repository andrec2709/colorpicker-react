export type RGB = readonly [number, number, number];

export type Color = {
    id: string;
    r: number;
    g: number;
    b: number;
    hex: string;
    name: string;
};

export type CreationColor = Omit<Color, 'id'>;