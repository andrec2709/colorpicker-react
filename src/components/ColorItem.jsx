import { useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext";
import { usePalette } from "../contexts/PaletteContext";

export const ColorItem = ({ previewColor, colorId }) => {

    const [color, setColor] = useState(previewColor);
    const { showMessage } = useToolTip();
    const { selectedPalette, palettesData, updatePalettesData } = usePalette();

    function handleCopy() {
        navigator.clipboard.writeText(color[3])
            .then(() => {
                showMessage('Copied!', 'ok');
            }, () => {
                showMessage('Failed!', 'fail');
            });
    }

    function handleRemoveColor() {
        delete selectedPalette['colors'][colorId];
        const newobj = JSON.parse(JSON.stringify(palettesData));
        updatePalettesData(newobj);
    }

    return (
        <div className="color-item" data-color={color} style={{ backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})` }}>
            <button className="color-copy" onClick={handleCopy}>
                <img src="/copy.png" alt="copy color" />
            </button>
            <button className="color-delete" onClick={handleRemoveColor}>
                <img src="/delete.png" alt="delete color" />
            </button>
        </div>
    );
};