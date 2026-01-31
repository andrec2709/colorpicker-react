import { useState } from "react";
import useSettingRepository from "./useSettingRepository";
import { readBooleanSetting } from "../../domain/settings/booleanSetting";

export default function useBooleanSetting(key: string, defaultValue = false) {
    const repo = useSettingRepository();

    const [value, setValue] = useState(() =>
        readBooleanSetting(repo, key, defaultValue)
    );

    const set = (next: boolean) => {
        repo.save(key, String(next));
        setValue(next);
    };

    return [value, set] as const;
}