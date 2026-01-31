import type { Translations } from "./types";
import { I18n } from 'i18n-js';

const translations: Translations = {
    "pt-BR": {
        addColorLabel: 'Adicionar cor a paleta',
        selectBackgroundLabel: 'Selecionar a cor de fundo',
        selectForegroundLabel: 'Selecionar a cor do texto',
    },
    en: {
        addColorLabel: 'Add color to palette',
        selectBackgroundLabel: 'Select background color',
        selectForegroundLabel: 'Select foreground color'
    },
};

export const i18n = new I18n(translations);

export default i18n;