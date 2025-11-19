import { createContext, useContext, useMemo, useRef, useState } from "react";

export const PaletteContext = createContext();

export const usePalette = () => useContext(PaletteContext);

export const PaletteProvider = ({ children }) => {
    const [selectedPaletteId, setSelectedPaletteId] = useState(null);

    const [palettesData, setPalettesData] = useState(
        JSON.parse(localStorage.getItem('palettesData') || '[]')
    );

    const selectedPalette = useMemo(
        () => palettesData.find(p => p.id === selectedPaletteId) ?? null,
        [palettesData, selectedPaletteId]
    );

    const [isHoldingItem, setIsHoldingItem] = useState(false);

    const lastColor = localStorage.getItem('last-color')?.split(',') || [0, 0, 0];

    const [red, setRed] = useState(parseInt(lastColor[0]));
    const [green, setGreen] = useState(parseInt(lastColor[1]));
    const [blue, setBlue] = useState(parseInt(lastColor[2]));
    const [hex, setHex] = useState(`#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`);

    const [selection, setSelection] = useState('background');

    const [viewLayout, setViewLayout] = useState('grid');

    function selectPalette(paletteData) {
        setSelectedPaletteId(paletteData?.id ?? null);
    }

    function updatePalettesData(newPalettesData) {
        localStorage.setItem('palettesData', JSON.stringify(newPalettesData));
        setPalettesData(newPalettesData);
    }

    return (
        <PaletteContext.Provider
            value={{
                selectedPalette,
                selectedPaletteId,
                viewLayout,
                setViewLayout,
                palettesData,
                selectPalette,
                setSelectedPaletteId,
                updatePalettesData,
                isHoldingItem,
                setIsHoldingItem,
                red, setRed,
                green, setGreen,
                blue, setBlue,
                hex, setHex,
                selection, setSelection
            }}>
            {children}
        </PaletteContext.Provider>
    );

};