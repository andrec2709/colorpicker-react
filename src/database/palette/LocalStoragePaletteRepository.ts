import type { Color, CreationColor } from "../../domain/color/types";
import type { PaletteData, CreationPaletteData } from "../../domain/palette/types";
import type PaletteRepository from "./PaletteRepository";
import { v4 as uuidv4 } from 'uuid';


export default class LocalStoragePaletteRepository implements PaletteRepository {
    public key: string;
    
    constructor(key: string) { 
        this.key = key
    }

    async getAll(): Promise<PaletteData[]> {
        const palettes = localStorage.getItem(this.key) ?? '[]';
        const parsedPalettes: PaletteData[] = JSON.parse(palettes);
        return parsedPalettes;
    }

    async saveAll(data: PaletteData[]): Promise<void> {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    async getById(id: string): Promise<PaletteData | null> {
        const palettes = await this.getAll();
        return palettes.find(palette => palette.id === id) ?? null;
    }

    async addColor(color: CreationColor, paletteId: string, toEnd: boolean): Promise<Color> {
        const colorId = uuidv4();
        const colorWithId = { ...color, id: colorId };
        const palettes = (await this.getAll()).map(palette => {
            if (palette.id === paletteId) {
                if (toEnd) {
                    palette.colors.push(colorWithId);
                } else {
                    palette.colors.splice(0, 0, colorWithId);
                }
            }
            return { ...palette };
        });

        await this.saveAll(palettes);

        return colorWithId;

    }

    async deleteColor(colorId: string, paletteId: string): Promise<void> {
        const palettes = (await this.getAll()).map(plt => {
            if (plt.id === paletteId) {
                const colors = plt.colors.filter(color => color.id !== colorId);
                return {...plt, colors};
            }
            return plt;
        });

        await this.saveAll(palettes);
    }

    async saveColor(color: Color, paletteId: string): Promise<void> {
        const palettes = (await this.getAll()).map(plt => {
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

        await this.saveAll(palettes);
    }

    async addPalette(palette: CreationPaletteData): Promise<PaletteData> {
        const palettes = await this.getAll();
        const id = uuidv4();
        const newPalette: PaletteData = {...palette, id: id};

        await this.saveAll([...palettes, newPalette]);
        return newPalette;
    }

    async deletePalette(palette: PaletteData): Promise<void> {
        const palettes = (await this.getAll()).filter(plt => plt.id !== palette.id);
        await this.saveAll(palettes);
    }

    async save(palette: PaletteData): Promise<void> {
        const palettes = (await this.getAll()).map(plt => {
            if (plt.id === palette.id) {
                return { ...palette };
            }
            return plt;
        });

        await this.saveAll(palettes);
    }
}