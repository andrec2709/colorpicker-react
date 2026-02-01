import { useState } from "react";
import useColorRepository from "./useColorRepository";
import type { RGB } from "../../domain/color/types";

/**
 * Used to persist bgColor and txtColor when the setter is called.
 * @param key e.g. local storage key
 * @param defaultValue if key is invalid (i.e. does not exist), defaults to this
 * @returns state representing the color and a custom setter function
 */
export default function useColorState(key: string, defaultValue: RGB = [0, 0, 0]) {
    const repo = useColorRepository();
    
    const [value, setValue] = useState(() => repo.get(key) ?? defaultValue);

    const set = (next: RGB) => {
        repo.set(key, next);
        setValue(next);
    }

    return [value, set] as const;
}