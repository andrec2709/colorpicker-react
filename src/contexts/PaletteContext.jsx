import { createContext, useContext, useState } from "react";

export const PaletteContext = createContext();

export const usePalette = () => useContext(PaletteContext);

export const PaletteProvider = ({ children }) => {
    const [selectedPalette, setSelectedPalette] = useState(null);
    
    const [palettesData, setPalettesData] = useState(
        JSON.parse(localStorage.getItem('palettesData') || '[]')
    );

    function selectPalette(paletteData) {
        setSelectedPalette(paletteData);
    }

    function updatePalettesData(newPalettesData) {
        localStorage.setItem('palettesData', JSON.stringify(newPalettesData));
        setPalettesData(newPalettesData);
    }

    return (
        <PaletteContext.Provider value={{ selectedPalette, palettesData, selectPalette, updatePalettesData }}>
            {children}
        </PaletteContext.Provider>
    );

};