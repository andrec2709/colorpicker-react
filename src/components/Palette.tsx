import ColorPreview from "./ColorPreview.jsx";
import { usePalette } from "../contexts/PaletteContext.jsx";
import { memo, useMemo } from "react";
import type { PaletteData } from "../types/palette.ts";


type Props = {
    paletteData: PaletteData;
};

export const Palette = ({ paletteData }: Props) => {

    const { selectPalette, viewLayout, palettesData, updatePalettesData } = usePalette();


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

    const handlePaletteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedPalettes = palettesData.map(palette => {
            if (palette.id === paletteData.id) {
                const name = e.target.value;
                return {
                    ...palette,
                    name
                }
            }
            return palette;
        });

        updatePalettesData(updatedPalettes);
    };

    const handleFocusName = (e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        e.target.select();
    };

    if (viewLayout === 'grid') {
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
    } else {
        return (
            <div className="palette-container--list">
                <div
                    className="palette"
                    data-name={paletteData.name}
                    onClick={() => selectPalette(paletteData)}
                    tabIndex={0}
                    role="button"
                    aria-label="palette"
                    style={{
                        gridArea: 'a'
                    }}
                >
                    {colorItems}
                </div>
                <input
                    type="text"
                    className="name"
                    onChange={handlePaletteNameChange}
                    onFocus={handleFocusName}
                    value={paletteData.name}
                    style={{
                        gridArea: 'b'
                    }}
                />
            </div>
        );
    }
};

export default memo(Palette);