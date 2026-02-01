import type { Color, CreationColor } from "../../domain/color/types";
import type { PaletteData, CreationPaletteData } from "../../domain/palette/types";
import type PaletteRepository from "./PaletteRepository";
import { v4 as uuidv4 } from 'uuid';


export default class LocalStoragePaletteRepository implements PaletteRepository {
    public key: string;
    
    constructor(key: string) { 
        this.key = key
    }

    getAll(): PaletteData[] {
        const palettes = localStorage.getItem(this.key) ?? '[]';
        const parsedPalettes: PaletteData[] = JSON.parse(palettes);
        return parsedPalettes;
    }

    saveAll(data: PaletteData[]): void {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    getById(id: string): PaletteData | null {
        const palettes = this.getAll();
        return palettes.find(palette => palette.id === id) ?? null;
    }

    addColor(color: CreationColor, paletteId: string, toEnd: boolean): Color {
        const colorId = uuidv4();
        const colorWithId = { ...color, id: colorId };
        const palettes = this.getAll().map(palette => {
            if (palette.id === paletteId) {
                if (toEnd) {
                    palette.colors.push(colorWithId);
                } else {
                    palette.colors.splice(0, 0, colorWithId);
                }
            }
            return { ...palette };
        });

        this.saveAll(palettes);

        return colorWithId;

    }

    deleteColor(colorId: string, paletteId: string): void {
        const palettes = this.getAll().map(plt => {
            if (plt.id === paletteId) {
                const colors = plt.colors.filter(color => color.id !== colorId);
                return {...plt, colors};
            }
            return plt;
        });

        this.saveAll(palettes);
    }

    saveColor(color: Color, paletteId: string): void {
        const palettes = this.getAll().map(plt => {
            if (plt.id === paletteId) {
                const colors = plt.colors.map(clr => {
                    if (clr.id === color.id) {
                        return color;
                    }

                    return clr;
                });

                return {...plt, colors};
            }
            return plt;
        });

        this.saveAll(palettes);
    }

    addPalette(palette: CreationPaletteData): PaletteData {
        const palettes = this.getAll();
        const id = uuidv4();
        const newPalette: PaletteData = {...palette, id: id};

        this.saveAll([...palettes, newPalette]);
        return newPalette;
    }

    deletePalette(palette: PaletteData): void {
        const palettes = this.getAll().filter(plt => plt.id !== palette.id);
        this.saveAll(palettes);
    }

    save(palette: PaletteData): void {
        const palettes = this.getAll().map(plt => {
            if (plt.id === palette.id) {
                return { ...palette };
            }
            return plt;
        });

        this.saveAll(palettes);
    }
}