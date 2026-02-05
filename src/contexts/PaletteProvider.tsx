import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import usePalettesData from "../application/palette/usePalettesData";
import type { PaletteData } from "../domain/palette/types";

type PaletteContextValue = {
    selectedPaletteId: string | null;
    setSelectedPaletteId: React.Dispatch<React.SetStateAction<string | null>>;

    palettesData: PaletteData[];
    setPalettesData: React.Dispatch<React.SetStateAction<PaletteData[]>>;

    selectedPalette: PaletteData | null;

    viewLayout: 'grid' | 'block';
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
    const [palettesData, setPalettesData] = usePalettesData();
    
    const selectedPalette = useMemo(
        () => palettesData.find((p: PaletteData) => p.id === selectedPaletteId) ?? null,
        [palettesData, selectedPaletteId]
    );

    // Define how the color list of a palette is to be displayed ( grid / block (as a list) )
    const [viewLayout, setViewLayout] = useState<'grid' | 'block'>('grid');

    function selectPalette(paletteData: PaletteData | null) {
        setSelectedPaletteId(paletteData?.id ?? null);
    }

    useEffect(() => {
        console.log('palettesData changed');
    }, [palettesData]);

    useEffect(() => {
        console.log('viewLayout changed');
    }, [viewLayout]);

    useEffect(() => {
        console.log('selectedPaletteId changed');
    }, [selectedPaletteId]);

    useEffect(() => {
        console.log('selectedPalette changed');
    }, [selectedPalette]);

    return (
        <PaletteContext.Provider
            value={{
                selectedPalette,
                selectedPaletteId,
                viewLayout,
                setViewLayout,
                palettesData,
                setPalettesData,
                selectPalette,
                setSelectedPaletteId,
            }}>
            {children}
        </PaletteContext.Provider>
    );

};