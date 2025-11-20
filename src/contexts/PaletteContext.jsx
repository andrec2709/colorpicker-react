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


    // Define color states
    const lastColor = localStorage.getItem('bg-color')?.split(',') || [0, 0, 0];
    const [red, setRed] = useState(parseInt(lastColor[0]));
    const [green, setGreen] = useState(parseInt(lastColor[1]));
    const [blue, setBlue] = useState(parseInt(lastColor[2]));
    const [hex, setHex] = useState(`#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`);
    
    // Define preview states
    const [bgColor, setBgColor] = useState(localStorage.getItem('bg-color')?.split(',') || [0, 0, 0]);
    const [txtColor, setTxtColor] = useState(localStorage.getItem('txt-color')?.split(',') || [255, 255, 255]);
    const [selection, setSelection] = useState('background');

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
                red, setRed,
                green, setGreen,
                blue, setBlue,
                hex, setHex,
                selection, setSelection,
                bgColor, setBgColor,
                txtColor, setTxtColor
            }}>
            {children}
        </PaletteContext.Provider>
    );

};