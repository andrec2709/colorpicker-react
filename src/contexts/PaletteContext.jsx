import { createContext, useContext, useMemo, useRef, useState } from "react";

export const PaletteContext = createContext();

export const usePalette = () => useContext(PaletteContext);

export const PaletteProvider = ({ children }) => {


    const [selectedPaletteId, setSelectedPaletteId] = useState(null);
    
    // User's stored palettes
    const [palettesData, setPalettesData] = useState(
        JSON.parse(localStorage.getItem('palettesData') || '[]')
    );

    
    const selectedPalette = useMemo(
        () => palettesData.find(p => p.id === selectedPaletteId) ?? null,
        [palettesData, selectedPaletteId]
    );

    // This state is mainly used to know when to highlight an underlying ColorItem, 
    // as a hint of where the item being dragged will be placed.
    const [isHoldingItem, setIsHoldingItem] = useState(false);

    // Define how the color list of a palette is to be displayed ( grid / block (as a list) )
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
            }}>
            {children}
        </PaletteContext.Provider>
    );

};