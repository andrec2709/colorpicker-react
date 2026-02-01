import { useState } from "react";
import type { RGB } from "../../domain/color/types";

export default function useHexState(initialState: RGB) {

    const hexRed = initialState[0].toString(16);
    const hexGreen = initialState[1].toString(16);
    const hexBlue = initialState[2].toString(16);
    const hex = `#${hexRed}${hexGreen}${hexBlue}`;

    const [value, setValue] = useState(() => hex);

    const set = (next: RGB) => {

        const hexRed = next[0].toString(16);
        const hexGreen = next[1].toString(16);
        const hexBlue = next[2].toString(16);
        const hex = `#${hexRed}${hexGreen}${hexBlue}`;

        setValue(hex);
    };

    return [value, set] as const;
}