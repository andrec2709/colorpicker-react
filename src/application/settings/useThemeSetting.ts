import { useState } from "react";
import useSettingRepository from "./useSettingRepository";
import readThemeSetting from "../../domain/settings/themeSetting";
import type { Theme } from "../../domain/settings/theme/types";

export default function useThemeSetting(key: string, defaultValue: Theme = 'theme-dark') {
    const repo = useSettingRepository();

    const [value, setValue] = useState(() => readThemeSetting(repo, key, defaultValue));

    const set = (next: Theme) => {
        repo.save(key, next);
        document.documentElement.classList.replace(value, next);
        setValue(next);
    };

    return [value, set] as const;
}