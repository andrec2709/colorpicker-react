import { createContext, memo, useContext, useEffect, useMemo, useState } from "react";
import useColorState from "../application/color/useColorState";
import type { RGB } from "../domain/color/types";
import { rgbToHex } from "../domain/color/utils";

type ColorStateContextType = {
    bgColor: RGB;
    txtColor: RGB;
    activeColor: RGB;
    selection: 'text' | 'background';
    hex: string;
};

type ColorActionsContextType = {
    setBgColor: (next: RGB) => void;
    setTxtColor: (next: RGB) => void;
    setActiveColor: React.Dispatch<React.SetStateAction<RGB>>;
    setSelection: React.Dispatch<React.SetStateAction<'text' | 'background'>>;
    setHex: React.Dispatch<React.SetStateAction<string>>;

};

const ColorStateContext = createContext<ColorStateContextType | null>(null);

const ColorActionsContext = createContext<ColorActionsContextType | null>(null);

export const useColorStateContext = () => {
    const ctx = useContext(ColorStateContext);
    if (!ctx) {
        throw new Error('useColorStateContext must be inside a ColorProvider');
    }
    return ctx;
};

export const useColorActions = () => {
    const ctx = useContext(ColorActionsContext);
    if (!ctx) {
        throw new Error('useColorActions must be inside a ColorProvider');
    }
    return ctx;
};

export const ColorProvider = memo(function ColorProvider({ children }: { children: React.ReactNode }) {
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
            setHex(rgbToHex(bgColor));
        } else {
            setActiveColor(txtColor);
            setHex(rgbToHex(txtColor));
        }
    }, [selection]);

    const stateValue = useMemo(() => ({
        bgColor,
        txtColor,
        activeColor,
        selection,
        hex,
    }), [
        bgColor,
        txtColor,
        activeColor,
        selection,
        hex
    ]);

    const actionsValue = useMemo(() => ({
        setBgColor,
        setTxtColor,
        setActiveColor,
        setSelection,
        setHex,
    }), []);

    return (
        <ColorStateContext.Provider value={stateValue}>
            <ColorActionsContext.Provider value={actionsValue}>
                {children}
            </ColorActionsContext.Provider>
        </ColorStateContext.Provider>
    );
});