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
    copyFromPalette: string;
    copyIconLabel: string;
    selectAsActive: string;
    deleteIconLabel: string;
    paletteTitleLabel: string;
    paletteLabel: string;
    sortableScreenReaderInstructions: string;
    colorName: string;
    toEndSettingLabel: string;
    top: string;
    bottom: string;
    darkMode: string;
    lightMode: string;
    ptBR: string;
    en: string;
    palettes: string;
    chooseThemeLabel: string;
    chooseLangLabel: string;
    randomColorLabel: string;
};

export type Translations = Record<Language, Translation>;