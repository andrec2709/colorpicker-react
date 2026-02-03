import type { RGB } from "../../domain/color/types";

export default interface ColorRepository {
    get(key: string): RGB | null;
    set(key: string, value: RGB): void;
}