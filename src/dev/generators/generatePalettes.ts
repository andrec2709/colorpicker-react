import type PaletteRepository from "../../database/palette/PaletteRepository";
import { v4 as uuidv4 } from 'uuid';
import type { CreationPaletteData } from "../../domain/palette/types";
import { rgbToHex } from "../../domain/color/utils";

function randomRgbValue() {
    return Math.round(Math.random() * 255);
}

export async function generatePalettes(
    repo: PaletteRepository,
    options: {
        paletteCount: number;
        colorsPerPalette: number;
    } = {
            paletteCount: 100,
            colorsPerPalette: 100,
        },
) {
    for (let i = 0; i < options.paletteCount; i++) {
        const palette: CreationPaletteData = {
            name: `Palette ${i}`,
            colors: Array.from({ length: options.colorsPerPalette }, (_, j) => {
                const r = randomRgbValue();
                const g = randomRgbValue();
                const b = randomRgbValue();
                const hex = rgbToHex([r, g, b]);
                
                return {
                    id: uuidv4(),
                    r: r,
                    g: g,
                    b: b,
                    hex: hex,
                    name: `Color ${j}`,
                };
            }),
        };

        await repo.addPalette(palette);
    }
}