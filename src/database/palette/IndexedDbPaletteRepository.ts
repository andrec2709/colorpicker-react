import type { CreationColor, Color } from "../../domain/color/types";
import type { CreationPaletteData, PaletteData } from "../../domain/palette/types";
import type PaletteRepository from "./PaletteRepository";
import { type IDBPDatabase, type DBSchema, openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

interface PaletteDB extends DBSchema {
    palettes: {
        key: string;
        value: PaletteData;
        indexes: { 'by-id': string };
    }
}

export class IndexedDbPaletteRepository implements PaletteRepository {
    dbPromise: Promise<IDBPDatabase<PaletteDB>>;

    constructor() {
        this.dbPromise = openDB<PaletteDB>('palette-db', 1, {
            async upgrade(db) {
                const paletteStore = db.createObjectStore('palettes', { keyPath: 'id' });
                paletteStore.createIndex('by-id', 'id');
            },
        });
    }

    async addColor(color: CreationColor, paletteId: string, toEnd: boolean): Promise<Color> {
        const db = await this.dbPromise;

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
        const db = await this.dbPromise;

        const paletteWithId: PaletteData = { ...palette, id: uuidv4() };

        await db.put('palettes', paletteWithId);

        return paletteWithId;
    }

    async deleteColor(colorId: string, paletteId: string): Promise<void> {
        const db = await this.dbPromise;

        const palette = await this.getById(paletteId);

        if (!palette) return;

        const newColors = palette.colors.filter(clr => clr.id !== colorId);

        await this.save({ ...palette, colors: newColors });
    }

    async deletePalette(palette: PaletteData): Promise<void> {
        const db = await this.dbPromise;

        await db.delete('palettes', palette.id);
    }

    async getAll(): Promise<PaletteData[]> {
        const db = await this.dbPromise;

        return await db.getAll('palettes');
    }

    async getById(id: string): Promise<PaletteData | null> {
        const db = await this.dbPromise;

        return await db.get('palettes', id) ?? null;
    }

    async save(palette: PaletteData): Promise<void> {
        const db = await this.dbPromise;

        db.put('palettes', palette);
    }

    async saveAll(data: PaletteData[]): Promise<void> {
        const db = await this.dbPromise;

        for (const palette of data) {
            db.put('palettes', palette);
        }
    }

    async saveColor(color: Color, paletteId: string): Promise<void> {
        const db = await this.dbPromise;

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