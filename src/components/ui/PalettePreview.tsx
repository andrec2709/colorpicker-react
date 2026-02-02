import { memo, useMemo } from "react";
import type { PaletteData } from "../../domain/palette/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { usePalette } from "../../contexts/PaletteProvider";
import ThemedInput from "./ThemedInput";
import useSavePalette from "../../application/palette/useSavePalette";

type Props = {
    data: PaletteData;
};

export const PalettePreview = memo(
    function ({ data }: Props) {
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
        const save = useSavePalette();

        const maxPreviewColors = 4;
        const previewColors = useMemo(() =>
            data.colors.slice(0, maxPreviewColors)
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

            ), [data]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            save({...data, name: e.currentTarget.value});
        }

        if (viewLayout === 'grid') {
            return (
                <div
                    className="grid cursor-pointer grid-cols-2 border border-palette-border items-center place-items-center w-20 p-1 aspect-square bg-palette-background rounded-sm"
                    style={style}
                    onClick={() => setSelectedPaletteId(data.id)}
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                >
                    {previewColors}
                </div>
            );
        } else {
            return (
                <div
                    className="flex box-border cursor-pointer border border-palette-border bg-palette-background rounded-sm items-center gap-x-5"
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
                    className="h-fit w-1/2" 
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
                    />
                </div>
            );
        }
    });

export default PalettePreview;