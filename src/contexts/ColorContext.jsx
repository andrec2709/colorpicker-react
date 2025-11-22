import { createContext, useContext } from "react";
import { useState } from "react";

export const ColorContext = createContext();

export const useColor = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
    // Define color states
    const lastColor = localStorage.getItem('bg-color')?.split(',') || [0, 0, 0];
    const [red, setRed] = useState(parseInt(lastColor[0]));
    const [green, setGreen] = useState(parseInt(lastColor[1]));
    const [blue, setBlue] = useState(parseInt(lastColor[2]));
    // const [hex, setHex] = useState(`#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`);
    const [hex, setHex] = useState(``);

    // Define preview states
    const [bgColor, setBgColor] = useState(localStorage.getItem('bg-color')?.split(',') || [0, 0, 0]);
    const [txtColor, setTxtColor] = useState(localStorage.getItem('txt-color')?.split(',') || [255, 255, 255]);
    const [selection, setSelection] = useState('background');

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