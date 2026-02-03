import { createContext, useContext, useState } from "react";
import useBooleanSetting from "../application/settings/useBooleanSetting";

type SettingsContextType = {
    isSettingsVisible: boolean;
    setIsSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    addColorToEnd: boolean;
    setAddColorToEnd: (next: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error('useSettings must be inside a SettingsProvider');
    }
    return ctx;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [addColorToEnd, setAddColorToEnd] = useBooleanSetting('add-color-to-end');

    return (
        <SettingsContext.Provider value={{
            isSettingsVisible,
            setIsSettingsVisible,
            addColorToEnd,
            setAddColorToEnd
        }}
        >
            {children}
        </SettingsContext.Provider>
    );

};