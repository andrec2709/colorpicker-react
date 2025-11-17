import { createContext, useContext, useMemo, useState } from "react";

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
    const [viewLayout, setViewLayout] = useState('grid');

    function selectPalette(paletteData) {
        setSelectedPaletteId(paletteData?.id ?? null);
    }

    function updatePalettesData(newPalettesData) {
        localStorage.setItem('palettesData', JSON.stringify(newPalettesData));
        setPalettesData(newPalettesData);
    }

    return (
        <PaletteContext.Provider value={{ selectedPalette, selectedPaletteId, viewLayout, setViewLayout, palettesData, selectPalette, setSelectedPaletteId, updatePalettesData, isHoldingItem, setIsHoldingItem }}>
            {children}
        </PaletteContext.Provider>
    );

};