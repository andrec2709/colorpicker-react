export type Language = 'pt-BR' | 'en';

type GenderTypeTranslation = {
    male: string;
    female: string;
};

export type Translation = {
    addColorLabel: string;
    selectBackgroundLabel: string;
    selectForegroundLabel: string;
    openSettingsLabel: string;
    copyFieldLabel: string;
    red: GenderTypeTranslation;
    green: GenderTypeTranslation;
    blue: GenderTypeTranslation;
};

export type Translations = Record<Language, Translation>;