import { ColorProvider } from "./ColorContext";
import { PaletteProvider } from "./PaletteContext";
import { SettingsProvider } from "./SettingsContext";
import { ToolTipProvider } from "./ToolTipContext";

export const ContextProvider = ({ children }) => {
    return (
        <ToolTipProvider>
            <PaletteProvider>
                <ColorProvider>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
                </ColorProvider>
            </PaletteProvider>
        </ToolTipProvider>
    );
};

export default ContextProvider;