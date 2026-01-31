export default interface DefaultTextRepository {
    save(key: string, value: string): void;
    read(key: string): string | null;
}