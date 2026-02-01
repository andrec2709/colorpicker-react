import type { Language } from "./types";

export default function isLanguage(testValue: string): testValue is Language {
    return testValue === 'pt-BR' || testValue === 'en';
}