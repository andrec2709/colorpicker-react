import type { RGB } from "../../domain/color/types";
import type ColorRepository from "./ColorRepository";

export default class LocalStorageColorRepository implements ColorRepository {
    get(key: string): RGB | null {
        const result = localStorage.getItem(key);
        if (result) {
            const color: RGB = JSON.parse(result);
            return color;
        }
        return null;

    }

    set(key: string, value: RGB): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
}