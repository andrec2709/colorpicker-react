import { useState } from "react";
import useReadPalettesData from "./useReadPalettesData";

export default function usePalettesData() {
    const read = useReadPalettesData();

    const [value, setValue] = useState(() => read());

    return [value, setValue] as const;
}