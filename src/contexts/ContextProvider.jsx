import { PaletteProvider } from "./PaletteContext";
import { ToolTipProvider } from "./ToolTipContext";

export const ContextProvider = ({ children }) => {
    return (
        <ToolTipProvider>
            <PaletteProvider>
                {children}
            </PaletteProvider>
        </ToolTipProvider>
    );
};

export default ContextProvider;