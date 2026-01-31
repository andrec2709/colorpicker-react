export default interface SettingRepository {
    save(key: string, value: string): void;
    read(key: string): string | null;
}