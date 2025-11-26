import { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "../types/theme";

type ThemeContextValue = {
    currentTheme: Theme;
    changeTheme: (newTheme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error('useTheme must be used inside a ThemeProvider');
    }

    return ctx;

};

type Props = {
    children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {

    const [currentTheme, setCurrentTheme] = useState<Theme>('theme-dark');


    const changeTheme = (newTheme: Theme) => {
        setCurrentTheme(newTheme);
        document.documentElement.classList.replace(currentTheme, newTheme);
    };

    useEffect(() => {
        document.documentElement.classList.add(currentTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{currentTheme, changeTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;