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
import ButtonWithIcon from "./ButtonWithIcon";

export const Editor = memo(function Editor() {
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
                <ButtonWithIcon
                    onClick={() => setSelectedPaletteId(null)}
                    disabled={selectedPaletteId === null}
                    aria-label={i18n.t('goBack')}
                    Icon={BackIcon}
                    className="active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl"
                    iconProps={{
                        className: `${selectedPaletteId !== null
                            ? 'fill-icon-active'
                            : 'fill-icon-inactive'
                            }
                            cursor-pointer`,
                        "aria-label": i18n.t('goBack'),
                    }}
                />
                <ThemedInput
                    className="ml-auto text-center w-1/2"
                    id="palette-title-input"
                    maxLength={30}
                    disabled={selectedPaletteId === null}
                    value={
                        selectedPalette
                            ? selectedPalette.name
                            : 'Palettes'
                    }
                    onChange={handleInputChange}
                    label={i18n.t('paletteTitleLabel')}
                />
                {
                    viewLayout === 'grid'
                        ? <ButtonWithIcon
                            onClick={() => setViewLayout('block')}
                            aria-label={i18n.t('switchToListView')}
                            className="ml-auto mr-5 cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl"
                            Icon={GridViewIcon}
                            iconProps={{
                                className: 'fill-icon-active',
                                "aria-label": i18n.t('switchToListView')
                            }}
                        />
                        : <ButtonWithIcon
                            onClick={() => setViewLayout('grid')}
                            aria-label={i18n.t('switchToGridView')}
                            className="ml-auto mr-5 cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl"
                            Icon={ListViewIcon}
                            iconProps={{
                                className: 'fill-icon-active',
                                "aria-label": i18n.t('switchToGridView')
                            }}
                        />
                }
                {
                    selectedPaletteId !== null
                        ? <ButtonWithIcon
                            onClick={handleDeletePalette}
                            aria-label={i18n.t('deletePalette')}
                            className="cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl"
                            Icon={DeleteIcon}
                            iconProps={{
                                className: 'fill-icon-active',
                                "aria-label": i18n.t('deletePalette'),
                            }}
                        />
                        : <ButtonWithIcon
                            onClick={handleAddPalette}
                            aria-label={i18n.t('addPalette')}
                            className="cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl"
                            Icon={AddIcon}
                            iconProps={{
                                className: 'fill-icon-active',
                                "aria-label": i18n.t('addPalette'),
                            }}
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