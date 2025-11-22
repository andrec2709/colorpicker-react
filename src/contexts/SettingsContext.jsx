import { createContext, useContext, useState } from "react";

export const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [copyHexWithoutHash, setcopyHexWithoutHash] = useState(true);
    const [addColorToEnd, setAddColorToEnd] = useState(false);

    return (
        <SettingsContext.Provider value={{isSettingsVisible, setIsSettingsVisible, copyHexWithoutHash, setcopyHexWithoutHash}}>
            {children}
        </SettingsContext.Provider>
    );
}