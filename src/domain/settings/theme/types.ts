export const themes = ['theme-dark', 'theme-light'] as const;

export type Theme = (typeof themes)[number];
