import LocalStorageLanguageRepository from "../../database/language/LocalStorageLanguageRepository";

export default function useLanguageRepository() {
    return new LocalStorageLanguageRepository();
}