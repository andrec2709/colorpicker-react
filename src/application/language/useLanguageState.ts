import { useState } from "react";
import useLanguageRepository from "./useLanguageRepository";
import type { Language } from "../../domain/i18n/types";

export default function useLanguageState(key: string) {
    const repo = useLanguageRepository();

    const userPref: Language = 
    (navigator.language === 'pt-BR' || navigator.language === 'pt')
        ? 'pt-BR'
        : 'en';

    const [value, setValue] = useState(() => repo.read(key) ?? userPref);

    const set = (next: Language) => {
        repo.save(key, next);
        setValue(next);
    };

    return [value, set] as const;
}