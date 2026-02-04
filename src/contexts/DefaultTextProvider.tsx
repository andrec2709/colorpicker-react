import { createContext, useContext } from "react";
import useTextState from "../application/default-text/useTextState";
import { useLanguage } from "./LanguageProvider";

type DefaultTextContextType = {
    title: string;
    setTitle: (next: string) => void;
    body: string;
    setBody: (next: string) => void;
};

const DefaultTextContext = createContext<DefaultTextContextType | null>(null);

export const useDefaultText = () => {
    const ctx = useContext(DefaultTextContext);
    if (!ctx) {
        throw new Error('useDefaultText must be inside a DefaultTextProvider');
    }
    return ctx;
};

export const DefaultTextProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [title, setTitle] = useTextState('title', 'defaultTitle');
    const [body, setBody] = useTextState('body', 'defaultBodyText');

    return (
        <DefaultTextContext.Provider value={{
            title,
            setTitle,
            body,
            setBody,
        }}>
            {children}
        </DefaultTextContext.Provider>
    );
};