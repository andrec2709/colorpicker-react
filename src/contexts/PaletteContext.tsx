import { createContext, useContext, useMemo, useRef, useState } from "react";
import type { PaletteData } from "../types/palette.ts";

type PaletteContextValue = {
    selectedPaletteId: string | null;
    setSelectedPaletteId: React.Dispatch<React.SetStateAction<string | null>>;

    palettesData: PaletteData[];
    updatePalettesData: (newPalettesData: PaletteData[]) => void;

    selectedPalette: PaletteData | null;

    isHoldingItem: boolean;
    setIsHoldingItem: React.Dispatch<React.SetStateAction<boolean>>;

    viewLayout: string;
    setViewLayout: React.Dispatch<React.SetStateAction<'grid' | 'block'>>;

    selectPalette: (paletteData: PaletteData | null) => void;
};

export const PaletteContext = createContext<PaletteContextValue | null>(null);

export const usePalette = () => {
    const ctx = useContext(PaletteContext);

    if (!ctx) {
        throw new Error('usePalette must be used inside a PaletteProvider');
    }

    return ctx;
};

type Props = {
    children: React.ReactNode;
};

export const PaletteProvider = ({ children }: Props) => {


    const [selectedPaletteId, setSelectedPaletteId] = useState<string | null>(null);
    
    // User's stored palettes
    const [palettesData, setPalettesData] = useState<PaletteData[]>(
        JSON.parse(localStorage.getItem('palettesData') || '[]')
    );

    
    const selectedPalette = useMemo(
        () => palettesData.find((p: PaletteData) => p.id === selectedPaletteId) ?? null,
        [palettesData, selectedPaletteId]
    );

    // This state is mainly used to know when to highlight an underlying ColorItem, 
    // as a hint of where the item being dragged will be placed.
    const [isHoldingItem, setIsHoldingItem] = useState(false);

    // Define how the color list of a palette is to be displayed ( grid / block (as a list) )
    const [viewLayout, setViewLayout] = useState<'grid' | 'block'>('grid');

    function selectPalette(paletteData: PaletteData | null) {
        setSelectedPaletteId(paletteData?.id ?? null);
    }

    function updatePalettesData(newPalettesData: PaletteData[]) {
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