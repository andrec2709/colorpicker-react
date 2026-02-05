import type { CreationColor, Color } from "../../domain/color/types";
import type IPaletteSorter from "../../domain/palette/sorter/IPaletteSorter";
import type { CreationPaletteData, PaletteData } from "../../domain/palette/types";
import type { IndexedDbPaletteDbInitializer, PaletteDB } from "./IndexedDbPaletteDbInitializer";
import type PaletteRepository from "./PaletteRepository";
import { type IDBPDatabase, type DBSchema, openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

export class IndexedDbPaletteRepository implements PaletteRepository {
    i: IndexedDbPaletteDbInitializer;
    pSorter: IPaletteSorter;

    constructor(i: IndexedDbPaletteDbInitializer, pSorter: IPaletteSorter) {
        this.i = i;
        this.pSorter = pSorter;
    }

    async addColor(color: CreationColor, paletteId: string, toEnd: boolean): Promise<Color> {
        const db = await this.i.dbPromise;
        
        const colorWithId: Color = { ...color, id: uuidv4() };

        const palette = await this.getById(paletteId);

        if (palette) {
            if (toEnd) {
                palette.colors.push(colorWithId);
            } else {
                palette.colors.splice(0, 0, colorWithId);
            }

            await this.save({ ...palette });
        }

        return colorWithId;

    }

    async addPalette(palette: CreationPaletteData): Promise<PaletteData> {
        const db = await this.i.dbPromise;

        const sortOrder = await this.pSorter.create(false);

        const paletteWithId: PaletteData = { ...palette, id: uuidv4(), sortOrder };

        await db.put('palettes', paletteWithId);

        return paletteWithId;
    }

    async deleteColor(colorId: string, paletteId: string): Promise<void> {
        const db = await this.i.dbPromise;

        const palette = await this.getById(paletteId);

        if (!palette) return;

        const newColors = palette.colors.filter(clr => clr.id !== colorId);

        await this.save({ ...palette, colors: newColors });
    }

    async deletePalette(palette: PaletteData): Promise<void> {
        const db = await this.i.dbPromise;

        await db.delete('palettes', palette.id);
    }

    async getAll(): Promise<PaletteData[]> {
        const db = await this.i.dbPromise;

        return (await db.getAll('palettes')).sort((a, b) => a.sortOrder - b.sortOrder);
    }

    async getById(id: string): Promise<PaletteData | null> {
        const db = await this.i.dbPromise;

        return await db.get('palettes', id) ?? null;
    }

    async save(palette: PaletteData): Promise<void> {
        const db = await this.i.dbPromise;

        db.put('palettes', palette);
    }

    async saveAll(data: PaletteData[]): Promise<void> {
        const db = await this.i.dbPromise;

        for (const palette of data) {
            await db.put('palettes', palette);
        }
    }

    async saveColor(color: Color, paletteId: string): Promise<void> {
        const db = await this.i.dbPromise;

        const palette = await this.getById(paletteId);

        if (!palette) return;

        const newColors = palette.colors.map(clr => {
            if (clr.id === color.id) {
                return color;
            }
            return clr;
        });

        await this.save({ ...palette, colors: newColors });
    }
}