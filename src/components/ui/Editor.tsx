import { memo } from "react";
import BackIcon from "../icons/BackIcon";
import { usePalette } from "../../contexts/PaletteProvider";
import ThemedInput from "./ThemedInput";
import GridViewIcon from "../icons/GridViewIcon";
import ListViewIcon from "../icons/ListViewIcon";
import AddIcon from "../icons/AddIcon";
import DeleteIcon from "../icons/DeleteIcon";
import PalettesView from "./PalettesView";
import useSavePalette from "../../application/palette/useSavePalette";
import { useLanguage } from "../../contexts/LanguageProvider";
import PaletteView from "./PaletteView";
import useDeletePalette from "../../application/palette/useDeletePalette";
import useAddPalette from "../../application/palette/useAddPalette";
import type { CreationPaletteData } from "../../domain/palette/types";

export const Editor = memo(function () {
    const { selectedPaletteId, setSelectedPaletteId, viewLayout, setViewLayout, selectedPalette, palettesData } = usePalette();
    const { i18n } = useLanguage();
    const save = useSavePalette();
    const deletePalette = useDeletePalette();
    const add = useAddPalette();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (selectedPalette) {
            save({ ...selectedPalette, name: e.currentTarget.value });
        }
    };

    const handleDeletePalette = () => {
        if (!selectedPalette) return;

        deletePalette(selectedPalette, null);
    };

    const handleAddPalette = () => {
        const palette: CreationPaletteData = {
            name: `Palette ${palettesData.length + 1}`,
            colors: []
        };

        add(palette);
    };

    return (
        <div className="mt-5">
            <div className="flex items-center">
                <BackIcon
                    className={`
                        ${selectedPaletteId !== null
                            ? 'fill-icon-active'
                            : 'fill-icon-inactive'
                        }
                        cursor-pointer
                        `}
                    onClick={() => setSelectedPaletteId(null)}
                    role="button"
                    tabIndex={0}
                    focusable
                    aria-label={i18n.t('goBack')}
                />
                <ThemedInput
                    className="ml-auto text-center w-1/2"
                    maxLength={30}
                    disabled={selectedPaletteId === null}
                    value={
                        selectedPalette
                            ? selectedPalette.name
                            : 'Palettes'
                    }
                    onChange={handleInputChange}
                />
                {
                    viewLayout === 'grid'
                        ? <GridViewIcon
                            className="fill-icon-active cursor-pointer ml-auto mr-5"
                            focusable
                            tabIndex={0}
                            aria-label={i18n.t('switchToListView')}
                            role="button"
                            onClick={() => setViewLayout('block')}
                        />
                        : <ListViewIcon
                            className="fill-icon-active cursor-pointer ml-auto mr-5"
                            focusable
                            tabIndex={0}
                            aria-label={i18n.t('switchToGridView')}
                            role="button"
                            onClick={() => setViewLayout('grid')}
                        />
                }
                {
                    selectedPaletteId !== null
                        ? <DeleteIcon
                            className="fill-icon-active cursor-pointer"
                            role="button"
                            focusable
                            tabIndex={0}
                            aria-label={i18n.t('deletePalette')}
                            onClick={handleDeletePalette}
                        />
                        : <AddIcon
                            className="fill-icon-active cursor-pointer"
                            role="button"
                            focusable
                            tabIndex={0}
                            aria-label={i18n.t('addPalette')}
                            onClick={handleAddPalette}
                        />
                }
            </div>
            <div className="h-80 mt-5">
                {
                    selectedPaletteId !== null
                    ? <PaletteView />
                    : <PalettesView />
                }
            </div>
        </div>
    );
});

export default Editor;