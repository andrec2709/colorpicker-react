import type { RGB } from "../../types/palette";

export default interface ColorRepository {
    get(key: string): RGB | null;
    set(key: string, value: RGB): void;
}