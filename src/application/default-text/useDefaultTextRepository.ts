import LocalStorageDefaultTextRepository from "../../database/default-text/LocalStorageDefaultTextRepository";

export default function useDefaultTextRepository() {
    return new LocalStorageDefaultTextRepository();
}