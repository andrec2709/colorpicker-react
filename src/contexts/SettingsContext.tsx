import { createContext, useContext, useState } from "react";

type SettingsContextValue = {
    isSettingsVisible: boolean;
    setIsSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;

    copyHexWithoutHash: boolean;
    setCopyHexWithoutHash: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [copyHexWithoutHash, setCopyHexWithoutHash] = useState(false);
    const [addColorToEnd, setAddColorToEnd] = useState(false);

    return (
        <SettingsContext.Provider value={{
            isSettingsVisible,
            setIsSettingsVisible,
            copyHexWithoutHash,
            setCopyHexWithoutHash
        }}>
            {children}
        </SettingsContext.Provider>
    );
}