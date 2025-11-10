import { useState } from "react";
import ColorPreview from "./ColorPreview";
import { usePalette } from "../contexts/PaletteContext";

export const Palette = ({ paletteData }) => {

    const [name, setName] = useState(paletteData?.name);
    const [colors, setColors] = useState(paletteData?.colors);
    const { selectPalette } = usePalette();

    const colorItems = [];
    const maxColorItems = 16;
    let counter = 0

    for (const key in colors) {
        if (counter >= maxColorItems) { break }
        else {
            if (colors.hasOwnProperty(key)) {
                colorItems.push(<ColorPreview previewColor={colors[key]} key={key} colorId={key} />);
            }
        }

        counter += 1;
    }

    return (
        <div 
        className="palette" 
        data-name={name} 
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