import { createContext, useContext, useState } from "react";

export const PaletteContext = createContext();

export const usePalette = () => useContext(PaletteContext);

export const PaletteProvider = ({ children }) => {
    const [selectedPalette, setSelectedPalette] = useState(null);

    function selectPalette(paletteData) {
        setSelectedPalette(paletteData);
    }

    return (
        <PaletteContext.Provider value={{ selectedPalette, selectPalette }}>
            {children}
        </PaletteContext.Provider>
    );

};