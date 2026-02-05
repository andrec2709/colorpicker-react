import idbSorterRepo, { IndexedDbSorterRepository } from "../../../database/sorter/IndexedDbSorterRepository";
import type SorterRepository from "../../../database/sorter/SorterRepository";
import type IPaletteSorter from "./IPaletteSorter";

export class PaletteSorter implements IPaletteSorter {
    private readonly NORMALIZATION_BASE = 100;
    private readonly NORMALIZATION_STEP = 10;
    private repo: SorterRepository;

    constructor(repo: SorterRepository) {
        this.repo = repo;
    }

    async create(toEnd?: boolean): Promise<number> {
        const palettes = await this.repo.getAll();

        if (palettes.length === 0) return this.NORMALIZATION_BASE;

        if (toEnd) {
            palettes.sort((a, b) => b.sortOrder - a.sortOrder);
            return palettes[0].sortOrder + this.NORMALIZATION_STEP;
        }

        palettes.sort((a, b) => a.sortOrder - b.sortOrder);
        return palettes[0].sortOrder - this.NORMALIZATION_STEP;
    }

    async moveOver(targetId: string, overId: string): Promise<void> {
        const palettes = (await this.repo.getAll()).sort((a, b) => a.sortOrder - b.sortOrder);

        const targetIndex = palettes.findIndex(palette => palette.id === targetId);
        const overIndex = palettes.findIndex(palette => palette.id === overId);

        if (targetIndex === -1 || overIndex === -1) return;

        const newPalettes = palettes.slice();

        if (overIndex === targetIndex) return;

        if (overIndex === newPalettes.length - 1) {
            newPalettes[targetIndex].sortOrder = newPalettes[overIndex].sortOrder + this.NORMALIZATION_STEP;
            await this.repo.saveAll(newPalettes);
            return;
        } else if (overIndex === 0) {
            newPalettes[targetIndex].sortOrder = newPalettes[overIndex].sortOrder - this.NORMALIZATION_STEP;
            await this.repo.saveAll(newPalettes);
            return;
        }

        let thirdElement;

        if (overIndex > targetIndex) {
            thirdElement = newPalettes[overIndex + 1];
        } else if (overIndex < targetIndex) {
            thirdElement = newPalettes[overIndex - 1];
        }

        if (!thirdElement) return;

        newPalettes[targetIndex].sortOrder = (thirdElement.sortOrder + newPalettes[overIndex].sortOrder) / 2;
        await this.repo.saveAll(newPalettes);

    }

    private async normalize(): Promise<void> {
        //TODO not being used yet
        const palettes = (await this.repo.getAll())
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((palette, i) => ({ ...palette, sortOrder: this.NORMALIZATION_BASE + (this.NORMALIZATION_STEP * (i + 1)) }));

        await this.repo.saveAll(palettes);
    }
}

export const paletteSorter = new PaletteSorter(idbSorterRepo);

export default paletteSorter;