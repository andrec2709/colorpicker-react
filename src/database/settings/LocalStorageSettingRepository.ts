import type SettingRepository from "./SettingRepository";

export default class LocalStorageSettingRepository implements SettingRepository {
    save(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    read(key: string): string | null {
        return localStorage.getItem(key);
    }
}