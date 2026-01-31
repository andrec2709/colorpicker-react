import { themes, type Theme } from "./types";

export const isTheme = (value: string): value is Theme => {
    return themes.includes(value as Theme);
}