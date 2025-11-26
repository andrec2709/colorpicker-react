import { ColorProvider } from "./ColorContext.jsx";
import { PaletteProvider } from "./PaletteContext.js";
import { SettingsProvider } from "./SettingsContext.jsx";
import { ThemeProvider } from "./ThemeContext.js";
import { ToolTipProvider } from "./ToolTipContext.jsx";

type Props = {
    children: React.ReactNode;
};

export const ContextProvider = ({ children }: Props) => {
    return (
        <ThemeProvider>
            <ToolTipProvider>
                <PaletteProvider>
                    <ColorProvider>
                        <SettingsProvider>
                            {children}
                        </SettingsProvider>
                    </ColorProvider>
                </PaletteProvider>
            </ToolTipProvider>
        </ThemeProvider>
    );
};

export default ContextProvider;