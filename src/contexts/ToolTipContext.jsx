import { createContext, useContext, useState } from "react";

export const ToolTipContext = createContext();

export const useToolTip = () => useContext(ToolTipContext);

export const ToolTipProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('Copied!');
    const [type, setType] = useState('ok');

    function showMessage(message, type, duration = 1000) {
        setMessage(message);
        setType(type)
        setVisible(true);

        setTimeout(() => setVisible(false), duration);
    }

    return (
        <ToolTipContext.Provider value={{ message, visible, type, showMessage }}>
            {children}
        </ToolTipContext.Provider>
    );
}