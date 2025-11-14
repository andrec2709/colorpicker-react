import { useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext";
import { usePalette } from "../contexts/PaletteContext";

export const ColorItem = ({ previewColor, colorId, onClick }) => {

    const [color, setColor] = useState(previewColor);
    const { showMessage } = useToolTip();
    const { selectedPalette, palettesData, updatePalettesData } = usePalette();

    function handleCopy(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(color[3])
            .then(() => {
                showMessage('Copied!', 'ok');
            }, () => {
                showMessage('Failed!', 'fail');
            });
    }

    function handleRemoveColor(e) {
        e.stopPropagation();
        const updatedPalettes = palettesData.map(palette => {
            if (palette.id === selectedPalette.id) {
                const colors = palette.colors;
                delete colors[colorId];

                return {
                    ...palette,
                    colors
                }
            }

            return palette;
        });
        updatePalettesData(updatedPalettes);
    }

    return (
        <div 
        className="color-item" 
        data-color={color} 
        style={{ backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})` }}
        onClick={() => onClick(color)}
        tabIndex="0"
        role="button"
        >
            <button className="color-copy" onClick={handleCopy}>
                <img src="./copy.svg" alt="copy color" />
            </button>
            <button className="color-delete" onClick={handleRemoveColor}>
                <img src="./delete.svg" alt="delete color" />
            </button>
        </div>
    );
};

export default ColorItem;