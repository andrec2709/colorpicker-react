import { useState } from "react";

export default function useRgbState(initialValue: number) {

    const [value, setValue] = useState(initialValue);

    const set = (next: number) => {
        const clamped = Math.max(0, Math.min(255, next));
        setValue(clamped);
    };

    return [value, set] as const;
}