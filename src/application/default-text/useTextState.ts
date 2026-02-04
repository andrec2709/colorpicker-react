import { useEffect, useState } from "react";
import useDefaultTextRepository from "./useDefaultTextRepository";
import { useLanguage } from "../../contexts/LanguageProvider";

export default function useTextState(key: string, defaultI18nKey: string) {
    const repo = useDefaultTextRepository();
    const { lang, i18n } = useLanguage();

    const [value, setValue] = useState(() => repo.read(key) ?? i18n.t(defaultI18nKey));

    const set = (next: string) => {
        repo.save(key, next);
        setValue(next);
    };

    useEffect(() => {
        setValue(repo.read(key) ?? i18n.t(defaultI18nKey));
    }, [lang]);

    return [value, set] as const;
}