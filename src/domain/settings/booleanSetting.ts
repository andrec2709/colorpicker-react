import type SettingRepository from "../../database/settings/SettingRepository";
import { parseBoolean } from "../../utils";

export function readBooleanSetting(
    repo: SettingRepository,
    key: string,
    defaultValue = false,
): boolean {
    return parseBoolean(repo.read(key), defaultValue);
}