import { useEffect, useState } from "react";
import useReadPalettesData from "./useReadPalettesData";
import type { PaletteData } from "../../domain/palette/types";

export default function usePalettesData() {
    const read = useReadPalettesData();

    const [value, setValue] = useState<PaletteData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setValue(await read());
        };

        fetchData();
    }, []);

    return [value, setValue] as const;
}