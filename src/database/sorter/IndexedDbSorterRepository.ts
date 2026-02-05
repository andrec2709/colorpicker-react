import type { PaletteData } from "../../domain/palette/types";
import { idbPaletteInitializer, type IndexedDbPaletteDbInitializer } from "../palette/IndexedDbPaletteDbInitializer";
import type SorterRepository from "./SorterRepository";

export class IndexedDbSorterRepository implements SorterRepository {
    i: IndexedDbPaletteDbInitializer;

    constructor(i: IndexedDbPaletteDbInitializer) {
        this.i = i;
    }

    async getAll(): Promise<PaletteData[]> {
        const db = await this.i.dbPromise;
        
        return await db.getAll('palettes');
    }

    async getHighest(): Promise<PaletteData> {
        const db = await this.i.dbPromise;

        const palettes = (await db.getAll('palettes')).sort((a, b) => b.sortOrder - a.sortOrder);

        return palettes[0];

    }

    async getLowest(): Promise<PaletteData> {
        const db = await this.i.dbPromise;

        const palettes = (await db.getAll('palettes')).sort((a, b) => a.sortOrder - b.sortOrder);

        return palettes[0];
    }

    async save(data: PaletteData): Promise<void> {
        const db = await this.i.dbPromise;

        await db.put('palettes', data);
    }

    async saveAll(data: PaletteData[]): Promise<void> {
        for (const palette of data) {
            await this.save(palette);
        }
    }
}

export const idbSorterRepo = new IndexedDbSorterRepository(idbPaletteInitializer);

export default idbSorterRepo;