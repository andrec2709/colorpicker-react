import ColorPreview from "./ColorPreview.jsx";
import { usePalette } from "../contexts/PaletteContext.jsx";
import { memo, useMemo } from "react";
import type { PaletteData } from "../types/palette.ts";


type Props = {
    paletteData: PaletteData;
};

export const Palette = ({ paletteData }: Props) => {

    const { selectPalette } = usePalette();


    const maxColorItems = 16;

    const colorItems = useMemo(() => (
        paletteData.colors
            .slice(0, maxColorItems)
            .map(color => (
                <ColorPreview 
                    previewColor={color}
                    key={color.id}
                    colorId={color.id}
                />
        ))
    ), [paletteData.colors])

    return (
        <div
            className="palette"
            data-name={paletteData.name}
            onClick={() => selectPalette(paletteData)}
            tabIndex={0}
            role="button"
            aria-label="palette"
        >
            {colorItems}
        </div>
    );
};

export default memo(Palette);