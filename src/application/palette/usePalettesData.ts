import { useState } from "react";
import type { PaletteData } from "../../types/palette";
import useReadPalettesData from "./useReadPalettesData";
import useSavePalettesData from "./useSavePalettesData";

export default function usePalettesData() {
    const read = useReadPalettesData();

    const [value, setValue] = useState(() => read());

    return [value, setValue] as const;
}