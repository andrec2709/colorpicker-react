import { ColorProvider } from "./ColorContext";
import { PaletteProvider } from "./PaletteContext";
import { ToolTipProvider } from "./ToolTipContext";

export const ContextProvider = ({ children }) => {
    return (
        <ToolTipProvider>
            <PaletteProvider>
                <ColorProvider>
                    {children}
                </ColorProvider>
            </PaletteProvider>
        </ToolTipProvider>
    );
};

export default ContextProvider;