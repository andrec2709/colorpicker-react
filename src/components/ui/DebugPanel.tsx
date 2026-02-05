import { memo } from "react";
import { generatePalettes } from "../../dev/generators/generatePalettes";
import usePaletteRepository from "../../application/palette/usePaletteRepository";
import { usePalette } from "../../contexts/PaletteProvider";

export const DebugPanel = memo(function DebugPanel({

}) {
    const repo = usePaletteRepository();
    const { setPalettesData, palettesData } = usePalette();
    const handleGeneratePalettes = async () => {
        await generatePalettes(repo, { paletteCount: 10, colorsPerPalette: 30 });
        setPalettesData(await repo.getAll());
    };

    const handleDeleteAllPalettes = async () => {
        for (const palette of palettesData) {
            await repo.deletePalette(palette);
        }
        setPalettesData(await repo.getAll());
    };

    return (
        <div className="fixed right-1 bottom-1 w-fit h-fit">
            <button
                onClick={handleGeneratePalettes}
                className="bg-blue-900 p-2 text-white"
            >
                Generate palettes
            </button>
            <button
                onClick={handleDeleteAllPalettes}
                className="bg-blue-900 p-2 text-white"
            >
                Delete palettes
            </button>
        </div>
    );
});

export default DebugPanel;