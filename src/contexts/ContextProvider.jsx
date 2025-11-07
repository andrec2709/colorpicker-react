import { ToolTipProvider } from "./ToolTipContext";

export const ContextProvider = ({ children }) => {
    return (
        <ToolTipProvider>
            {children}
        </ToolTipProvider>
    );
};

export default ContextProvider;