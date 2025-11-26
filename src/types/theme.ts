export const themes = ['theme-dark', 'theme-light'] as const;

export type Theme = (typeof themes)[number];

export const isTheme = (value: string): value is Theme => {
    return themes.includes(value as Theme);
}