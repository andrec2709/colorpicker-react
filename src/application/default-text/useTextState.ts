import { useState } from "react";
import useDefaultTextRepository from "./useDefaultTextRepository";

export default function useTextState(key: string, defaultValue: string = '') {
    const repo = useDefaultTextRepository();

    const [value, setValue] = useState(() => repo.read(key) ?? defaultValue);

    const set = (next: string) => {
        repo.save(key, next);
        setValue(next);
    };

    return [value, set] as const;
}