import LocalStorageColorRepository from "../../database/color-keys/LocalStorageColorRepository";

export default function useColorRepository() {
    return new LocalStorageColorRepository();
}