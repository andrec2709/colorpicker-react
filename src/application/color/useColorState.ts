import { useState } from "react";
import useColorRepository from "./useColorRepository";
import type { RGB } from "../../domain/color/types";

export default function useColorState(key: string, defaultValue: RGB = [0, 0, 0]) {
    const repo = useColorRepository();
    
    const [value, setValue] = useState(() => repo.get(key) ?? defaultValue);

    const set = (next: RGB) => {
        repo.set(key, next);
        setValue(next);
    }

    return [value, set] as const;
}