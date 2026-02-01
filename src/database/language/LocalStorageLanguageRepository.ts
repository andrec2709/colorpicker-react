import type { Language } from "../../domain/i18n/types";
import isLanguage from "../../domain/i18n/utils";
import type LanguageRepository from "./LanguageRepository";

export default class LocalStorageLanguageRepository implements LanguageRepository {
    read(key: string): Language | null {
        const lang = localStorage.getItem(key);
        if (lang && isLanguage(lang)) {
            return lang;
        }
        return null;
    }

    save(key: string, value: Language): void {
        localStorage.setItem(key, value);
    }
}