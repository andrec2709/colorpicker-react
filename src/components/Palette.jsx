import ColorPreview from "./ColorPreview";
import { usePalette } from "../contexts/PaletteContext";
import { memo, useMemo } from "react";

/**
 * Represents a single palette inside {@link Components/PalettesListView | PalettesListView}.
 * @function
 * @param {Object} paletteData - an Object containing the properties id, name, and colors. ID is a unique identifier for the palette, a name is a string, and colors is another Object described in {@link Components/ColorItem | ColorItem}, see the 'previewColor' description. 
 * @returns {JSX.Element} a component representing a single palette.
 * @alias Components/Palette
 */
export const Palette = ({ paletteData }) => {

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

export default memo(Palette);