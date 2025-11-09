import { useState } from "react";
import ColorPreview from "./ColorPreview";
import { usePalette } from "../contexts/PaletteContext";

export const Palette = ({ paletteData }) => {
    
    const [name, setName] = useState(paletteData?.name);
    const [colors, setColors] = useState(paletteData?.colors);
    const { selectPalette } = usePalette();

    let colorItems = [];

    for (const key in colors) {
        if (colors.hasOwnProperty(key)) {
            colorItems.push(<ColorPreview previewColor={colors[key]} key={key} colorId={key} />);
        }
    }

    return (
        <div className="palette" data-name={name} onClick={() => selectPalette(paletteData)}>
            {colorItems}
        </div>
    );
};

export default Palette;