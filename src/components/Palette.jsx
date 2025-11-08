import { useState } from "react";
import ColorPreview from "./ColorPreview";

export const Palette = ({ paletteData }) => {
    
    const [name, setName] = useState(paletteData.name);
    const [colors, setColors] = useState(paletteData.colors);

    let colorItems = [];

    for (const key in colors) {
        if (colors.hasOwnProperty(key)) {
            colorItems.push(<ColorPreview previewColor={colors[key]} key={key} />);
        }
    }

    return (
        <div className="palette" data-name={name}>
            {colorItems}
        </div>
    );
};

export default Palette;