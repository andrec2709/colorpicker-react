import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useColorState from "../application/color/useColorState";
import type { RGB } from "../domain/color/types";
import useHexState from "../application/color/useHexState";
import { rgbToHex } from "../domain/color/utils";

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
    setHex: React.Dispatch<React.SetStateAction<string>>;
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
    /* Represents the background color of the preview */
    const [bgColor, setBgColor] = useColorState('bg-color');

    /* Represents the foreground color of the preview */
    const [txtColor, setTxtColor] = useColorState('txt-color', [255, 255, 255]);

    /* 
    Represents the active color. That is, the value of the sliders and fields.
    When the active color changes, bgColor or txtColor updates equally, depending
    on the current selection.
    */
    const [activeColor, setActiveColor] = useState(() => bgColor);

    /*
    Represents the user intent to modify either the background or text color.
    */
    const [selection, setSelection] = useState<'text' | 'background'>('background');

    /* HEX representation of activeColor */
    const [hex, setHex] = useState(() => rgbToHex(activeColor));

    /* 
    Updates either bgColor or txtColor, depending on selection,
    when activeColor changes.
    */
    useEffect(() => {
        if (!activeColor) return;

        if (selection === 'background') {
            setBgColor(activeColor);
        } else {
            setTxtColor(activeColor);
        }

    }, [activeColor]);

    /*
    Whenever selection changes, updates activeColor to the active selection (background / text).
    */
    useEffect(() => {
        if (selection === 'background') {
            setActiveColor(bgColor);
        } else {
            setActiveColor(txtColor);
        }
    }, [selection]);

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