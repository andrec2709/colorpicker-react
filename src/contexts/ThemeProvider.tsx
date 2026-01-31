import { createContext, useContext, useEffect } from "react";
import type { Theme } from "../domain/settings/theme/types";
import useThemeSetting from "../application/settings/useThemeSetting";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (next: Theme) => void;
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

    const [theme, setTheme] = useThemeSetting('theme');

    useEffect(() => {
        document.documentElement.classList.add(theme);
    }, []);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;