import type DefaultTextRepository from "./DefaultTextRepository";

export default class LocalStorageDefaultTextRepository implements DefaultTextRepository {
    save(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    read(key: string): string | null {
        return localStorage.getItem(key);
    }
}
