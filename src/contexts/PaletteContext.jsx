import { createContext, useContext, useState } from "react";

export const PaletteContext = createContext();

export const usePalette = () => useContext(PaletteContext);

export const PaletteProvider = ({ children }) => {
    const [selectedPalette, setSelectedPalette] = useState(null);
    const [selectedPaletteName, setSelectedPaletteName] = useState(selectedPalette?.name ?? 'Palettes');
    
    const [palettesData, setPalettesData] = useState(
        JSON.parse(localStorage.getItem('palettesData') || '[]')
    );

    function selectPalette(paletteData) {
        setSelectedPalette(paletteData);
        setSelectedPaletteName(paletteData?.name ?? 'Palettes');
    }

    function updatePalettesData(newPalettesData) {
        localStorage.setItem('palettesData', JSON.stringify(newPalettesData));
        setPalettesData(newPalettesData);
    }

    return (
        <PaletteContext.Provider value={{ selectedPalette, selectedPaletteName, palettesData, selectPalette, setSelectedPaletteName, updatePalettesData }}>
            {children}
        </PaletteContext.Provider>
    );

};