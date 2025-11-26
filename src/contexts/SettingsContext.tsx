import { createContext, useContext, useState } from "react";

type SettingsContextValue = {
    isSettingsVisible: boolean;
    setIsSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;

    copyHexWithoutHash: boolean;
    setCopyHexWithoutHash: React.Dispatch<React.SetStateAction<boolean>>;

    addColorToEnd: boolean;
    setAddColorToEnd: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export const useSettings = () => {
    const ctx = useContext(SettingsContext);

    if (!ctx) {
        throw new Error('useSettings must be inside SettingsProvider');
    }

    return ctx;

};

type Props = {
    children: React.ReactNode;
};

export const SettingsProvider = ({ children }: Props) => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [copyHexWithoutHash, setCopyHexWithoutHash] = useState(localStorage.getItem('copy-hex-without-hash') === 'true' ? true : false || false);
    const [addColorToEnd, setAddColorToEnd] = useState(localStorage.getItem('add-color-to-end') === 'true' ? true : false || false);

    return (
        <SettingsContext.Provider value={{
            isSettingsVisible,
            setIsSettingsVisible,
            copyHexWithoutHash,
            setCopyHexWithoutHash,
            addColorToEnd,
            setAddColorToEnd
        }}>
            {children}
        </SettingsContext.Provider>
    );
}