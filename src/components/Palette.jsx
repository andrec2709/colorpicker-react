import ColorPreview from "./ColorPreview";
import { usePalette } from "../contexts/PaletteContext";
import { useEffect, useState } from "react";

export const Palette = ({ paletteData }) => {

    const { selectPalette } = usePalette();


    const maxColorItems = 16;

    const colorItems = paletteData.colors
        .slice(0, maxColorItems)
        .map(color => (
            <ColorPreview
                previewColor={color}
                key={color.id}
                colorId={color.id}
            />
        ))

    return (
        <div
            className="palette"
            data-name={paletteData.name}
            onClick={() => selectPalette(paletteData)}
            tabIndex="0"
            role="button"
            aria-label="palette"
        >
            {colorItems}
        </div>
    );
};

export default Palette;