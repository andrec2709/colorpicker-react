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
    contrast: string;
    defaultTitle: string;
    defaultBodyText: string;
    switchToListView: string;
    switchToGridView: string;
    goBack: string;
    deletePalette: string;
    addPalette: string;
    madeBy: string;
};

export type Translations = Record<Language, Translation>;