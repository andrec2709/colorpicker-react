import React, { createContext, useContext } from "react";
import { useState } from "react";

type ColorContextValue = {
    
    red: number;
    setRed: React.Dispatch<React.SetStateAction<number>>;

    green: number;
    setGreen: React.Dispatch<React.SetStateAction<number>>;

    blue: number;
    setBlue: React.Dispatch<React.SetStateAction<number>>;

    hex: string;
    setHex: React.Dispatch<React.SetStateAction<string>>;

    bgColor: number[];
    setBgColor: React.Dispatch<React.SetStateAction<number[]>>;
    
    txtColor: number[];
    setTxtColor: React.Dispatch<React.SetStateAction<number[]>>;

    selection: 'background' | 'text';
    setSelection: React.Dispatch<React.SetStateAction<'background' | 'text'>>;

};

export const ColorContext = createContext<ColorContextValue | null>(null);

export const useColor = () => {
    const ctx = useContext(ColorContext);

    if (!ctx) {
        throw new Error('useColor must be inside ColorProvider');
    }

    return ctx;

};

type Props = {
    children: React.ReactNode;
}

export const ColorProvider = ({ children }: Props) => {
    // Define color states
    const lastColor = localStorage.getItem('bg-color')?.split(',').map(n => parseInt(n)) || [0, 0, 0];
    

    const [red, setRed] = useState(lastColor[0] ?? 0);
    const [green, setGreen] = useState(lastColor[1] ?? 0);
    const [blue, setBlue] = useState(lastColor[2] ?? 0);
    const [hex, setHex] = useState(``);

    // Define preview states
    const [bgColor, setBgColor] = useState(localStorage.getItem('bg-color')?.split(',').map(n => parseInt(n)) || [0, 0, 0]);
    const [txtColor, setTxtColor] = useState(localStorage.getItem('txt-color')?.split(',').map(n => parseInt(n)) || [255, 255, 255]);
    const [selection, setSelection] = useState<'background' | 'text'>('background');

    return (
        <ColorContext.Provider
            value={{
                red, setRed,
                green, setGreen,
                blue, setBlue,
                hex, setHex,
                bgColor, setBgColor,
                txtColor, setTxtColor,
                selection, setSelection,
            }}
        >
            { children }
        </ColorContext.Provider>
    );
};