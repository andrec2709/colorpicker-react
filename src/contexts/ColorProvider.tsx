import { createContext, useContext, useState } from "react";
import useColorState from "../application/color/useColorState";
import type { RGB } from "../domain/color/types";
import useHexState from "../application/color/useHexState";

type ColorContextType = {
    bgColor: RGB;
    setBgColor: (next: RGB) => void;
    txtColor: RGB;
    setTxtColor: (next: RGB) => void;
    activeColor: RGB;
    setActiveColor: React.Dispatch<React.SetStateAction<RGB>>;
    selection: 'text' | 'background';
    setSelection: React.Dispatch<React.SetStateAction<'text' | 'background'>>;
    hex: string;
    setHex: (next: RGB) => void;
};

const ColorContext = createContext<ColorContextType | null>(null);

export const useColor = () => {
    const ctx = useContext(ColorContext);
    if (!ctx) {
        throw new Error('useColor must be inside a ColorProvider');
    }
    return ctx;
};

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
    const [bgColor, setBgColor] = useColorState('bg-color');
    const [txtColor, setTxtColor] = useColorState('txt-color', [255, 255, 255]);
    const [activeColor, setActiveColor] = useState(() => bgColor);
    const [selection, setSelection] = useState<'text' | 'background'>('background');
    const [hex, setHex] = useHexState(activeColor);


    return (
        <ColorContext.Provider value={{
            bgColor,
            setBgColor,
            txtColor,
            setTxtColor,
            activeColor,
            setActiveColor,
            selection,
            setSelection,
            hex,
            setHex,
        }}>
            {children}
        </ColorContext.Provider>
    );
};