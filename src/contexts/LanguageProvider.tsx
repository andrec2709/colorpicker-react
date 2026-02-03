import { I18n } from "i18n-js";
import { createContext, useContext } from "react";
import type { Language } from "../domain/i18n/types";
import useLanguageState from "../application/language/useLanguageState";
import { translations } from "../domain/i18n/translations";

type LanguageContextType = {
    lang: Language;
    setLang: (next: Language) => void;
    i18n: I18n;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be inside a LanguageProvider');

    return ctx;

};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useLanguageState('lang');
    const i18n = new I18n(translations);
    i18n.locale = lang;

    return (
        <LanguageContext.Provider value={{ lang, setLang, i18n }}>
            {children}
        </LanguageContext.Provider>
    );
};