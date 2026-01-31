import LocalStorageSettingRepository from "../../database/settings/LocalStorageSettingRepository";

export default function useSettingRepository() {
    return new LocalStorageSettingRepository();
}