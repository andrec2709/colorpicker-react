export default interface LanguageRepository {
    save(key: string, value: string): void;
    read(key: string): string | null;
}