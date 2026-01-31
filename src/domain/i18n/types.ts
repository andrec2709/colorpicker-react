export type Language = 'pt-BR' | 'en';

export type Translation = {
    addColorLabel: string;
    selectBackgroundLabel: string;
    selectForegroundLabel: string;
};

export type Translations = Record<Language, Translation>;