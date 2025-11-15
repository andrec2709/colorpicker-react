import { useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext";
import { usePalette } from "../contexts/PaletteContext";
import CopyIcon from '../assets/copy.svg';
import DeleteIcon from '../assets/delete.svg';

export const ColorItem = ({ previewColor, colorId, onClick }) => {

    const { showMessage } = useToolTip();
    const { selectedPaletteId, palettesData, updatePalettesData } = usePalette();

    function handleCopy(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(previewColor.hex)
            .then(() => {
                showMessage('Copied!', 'ok');
            }, () => {
                showMessage('Failed!', 'fail');
            });
    }

    function handleRemoveColor(e) {
        e.stopPropagation();
        const updatedPalettes = palettesData.map(palette => {
            if (palette.id === selectedPaletteId) {
                return {
                    ...palette,
                    colors: palette.colors.filter(c => c.id !== colorId)
                };
            }

            return palette;
        });
        updatePalettesData(updatedPalettes);

    }

    return (
        <div
            className="color-item"
            data-color={previewColor}
            style={{ backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})` }}
            onClick={() => onClick(previewColor)}
            tabIndex="0"
            role="button"
        >
            <button className="color-copy" onClick={handleCopy}>
                <img src={CopyIcon} alt="copy color" />
            </button>
            <button className="color-delete" onClick={handleRemoveColor}>
                <img src={DeleteIcon} alt="delete color" />
            </button>
        </div>
    );
};

export default ColorItem;