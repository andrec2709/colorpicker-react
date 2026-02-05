import type { PaletteData } from "../../domain/palette/types";
import type { PaletteDbInitializer } from "./PaletteDbInitializer";
import { type IDBPDatabase, type DBSchema, openDB } from 'idb';


export interface PaletteDB extends DBSchema {
    palettes: {
        key: string;
        value: PaletteData;
        indexes: { 'by-id': string };
    }
}

export class IndexedDbPaletteDbInitializer implements PaletteDbInitializer {
    dbPromise: Promise<IDBPDatabase<PaletteDB>>;

    constructor() {
        this.dbPromise = openDB<PaletteDB>('palette-db', 1, {
            async upgrade(db) {
                const paletteStore = db.createObjectStore('palettes', { keyPath: 'id' });
                paletteStore.createIndex('by-id', 'id');
            },
        });

    }
}

export const idbPaletteInitializer = new IndexedDbPaletteDbInitializer();

export default idbPaletteInitializer;