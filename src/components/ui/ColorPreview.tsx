import { memo } from "react";
import type { Color } from "../../domain/color/types";
import { usePalette } from "../../contexts/PaletteProvider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import ThemedInput from "./ThemedInput";
import useSaveColor from "../../application/palette/useSaveColor";

export const ColorPreview = memo(
    function ({ data }: { data: Color }) {
        const { viewLayout, selectedPaletteId } = usePalette();
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: data.id });
        const save = useSaveColor();

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            if (selectedPaletteId) {
                save({ ...data, name: e.currentTarget.value }, selectedPaletteId);
            }
        }


        if (viewLayout === 'grid') {
            return (
                <div
                    style={{
                        backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
                        ...style
                    }}
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    className="w-20 aspect-square rounded-sm"
                ></div>
            );
        } else {
            return (
                <div
                    className="flex cursor-pointer border border-palette-border bg-palette-background rounded-sm items-center gap-x-5"
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                >
                    <div
                        style={{
                            backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
                        }}
                        className="w-18 m-1 aspect-square rounded-sm"

                    >
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

export default ColorPreview;