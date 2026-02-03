import { memo, useMemo } from "react";
import type { PaletteData } from "../../domain/palette/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { usePalette } from "../../contexts/PaletteProvider";
import ThemedInput from "./ThemedInput";
import useSavePalette from "../../application/palette/useSavePalette";
import { useLanguage } from "../../contexts/LanguageProvider";

type Props = {
    data: PaletteData;
};

export const PalettePreview = memo(
    function PalettePreview({ data }: Props) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: data.id });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };
        const { viewLayout, setSelectedPaletteId } = usePalette();
        const { i18n } = useLanguage();
        const save = useSavePalette();

        const maxPreviewColors = 4;
        const previewColors = useMemo(
            () => {

                const components = data.colors.slice(0, maxPreviewColors)
                    .map(color => {
                        const colorBg = `rgb(${color.r},${color.g},${color.b})`;
                        return (
                            <div
                                key={color.id}

                                style={{
                                    backgroundColor: colorBg,
                                    width: '2rem',
                                    aspectRatio: '1 / 1',
                                    borderRadius: '5px',
                                }}
                            >
                            </div>

                        );
                    }

                    )

                /* 
                This conditional is for controlling how the color previews are displayed in the palette preview.
                
                In order to keep the grid correctly aligned, I add two transparent placeholders just to keep
                it structurally the same as a palette with 4+ colors.
                
                If this is not done, palettes with two colors will have the color previews centered in the palette
                preview.
                */
                if (components.length < 3) {

                    const placeholder = (fakeId: string) => (
                        <div
                            key={fakeId}
                            style={{
                                backgroundColor: 'transparent',
                                width: '2rem',
                                aspectRatio: '1 / 1',
                                borderRadius: '5px',
                            }}
                        >
                        </div>
                    );

                    components.push(placeholder('FAKE_ITEM_1@--__220912389'));
                    components.push(placeholder('FAKE_ITEM_2@--__231238726'));
                }

                return components;
            }, [data]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            save({ ...data, name: e.currentTarget.value });
        }

        if (viewLayout === 'grid') {
            return (
                <div
                    className="grid touch-pan-y cursor-pointer grid-cols-2 border border-palette-border hover:border-palette-border-hover transition-[border-color] duration-150 justify-items-center items-center w-20 p-1 aspect-square bg-palette-background rounded-sm"
                    style={style}
                    aria-label={i18n.t('paletteLabel', { paletteName: data.name })}
                    onClick={() => setSelectedPaletteId(data.id)}
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && e.shiftKey) {
                            e.preventDefault();
                            setSelectedPaletteId(data.id);
                            return;
                        }

                        if (e.key === 'Enter' || e.key === ' ') {
                            if (listeners) return listeners.onKeyDown?.(e);
                        }
                    }}
                >
                    {previewColors}
                </div>
            );
        } else {
            return (
                <div
                    className="flex touch-pan-y box-border cursor-pointer border border-palette-border hover:border-palette-border-hover transition-[border-color] duration-150 bg-palette-background rounded-sm items-center gap-x-5"
                    ref={setNodeRef}
                    style={style}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedPaletteId(data.id);
                    }}
                    {...attributes}
                    {...listeners}
                >
                    <div
                        className="grid grid-cols-2 items-center place-items-center w-20 p-1 aspect-square rounded-sm"
                    >
                        {previewColors}
                    </div>
                    <ThemedInput
                        value={data.name}
                        id={`input-palette-${data.id}`}
                        className="h-fit w-1/2 text-palette-on-background"
                        maxLength={30}
                        onChange={handleInputChange}
                        onClick={e => {
                            // Stops click event from bubbling up to parent (palette selection)
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onFocus={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            e.currentTarget.select();
                        }}
                        label={i18n.t('paletteTitleLabel')}
                        labelProps={{
                            className: 'text-palette-on-background'
                        }}
                    />
                </div>
            );
        }
    });

export default PalettePreview;