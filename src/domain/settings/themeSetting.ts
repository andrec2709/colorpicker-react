import type SettingRepository from "../../database/settings/SettingRepository";
import type { Theme } from "./theme/types";
import { isTheme } from "./theme/utils";

export default function readThemeSetting(
    repo: SettingRepository,
    key: string,
    defaultValue: Theme = "theme-dark",
): Theme {
    const theme = repo.read(key);
    if (theme && isTheme(theme)) {
        return theme;
    }
    return defaultValue;
}