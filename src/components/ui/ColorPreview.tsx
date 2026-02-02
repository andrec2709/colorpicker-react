import { memo } from "react";
import type { Color, RGB } from "../../domain/color/types";
import { usePalette } from "../../contexts/PaletteProvider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import ThemedInput from "./ThemedInput";
import useSaveColor from "../../application/palette/useSaveColor";
import EllipsisVerticalIcon from "../icons/EllipsisVerticalIcon";
import CopyIcon from "../icons/CopyIcon";
import DeleteIcon from "../icons/DeleteIcon";
import { useColor } from "../../contexts/ColorProvider";
import useDeleteColor from "../../application/palette/useDeleteColor";

export const ColorPreview = memo(
    function ({ data }: { data: Color }) {
        const { viewLayout, selectedPaletteId } = usePalette();
        const { setActiveColor, setHex } = useColor();
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: data.id });
        const save = useSaveColor();
        const deleteColor = useDeleteColor();

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        const handleRenameColor = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            if (selectedPaletteId) {
                save({ ...data, name: e.currentTarget.value }, selectedPaletteId);
            }
        }

        const handleSelectColor = () => {
            const rgb: RGB = [data.r, data.g, data.b];
            setActiveColor(rgb);
            setHex(data.hex);
        };

        const handleCopyColor = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            e.preventDefault();
            navigator.clipboard.writeText(data.hex);
        };

        const handleDeleteColor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            e.preventDefault();

            if (!selectedPaletteId) return;

            deleteColor(data.id, selectedPaletteId);
        };

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
                    onClick={handleSelectColor}
                    className="w-20 aspect-square rounded-sm relative touch-pan-y"
                >
                    <div
                        className="absolute cursor-pointer right-1 top-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5"
                        onClick={handleCopyColor}
                    >
                        <CopyIcon
                            size={18}
                            color="white"
                        />
                    </div>
                    <div
                        className="absolute cursor-pointer left-1 top-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5"
                        onClick={handleDeleteColor}
                    >
                        <DeleteIcon size={18} color="white" />
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className="flex relative cursor-pointer hover:border-palette-border-hover transition-[border-color] duration-150 touch-pan-y border border-palette-border bg-palette-background rounded-sm items-center gap-x-5"
                    onClick={handleSelectColor}
                    ref={setNodeRef}
                    style={style}
                    {...attributes}
                    {...listeners}
                >
                    <div
                        style={{
                            backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
                        }}
                        className="w-18 m-1 aspect-square cursor-pointer rounded-sm"

                    >
                    </div>
                    <ThemedInput
                        value={data.name}
                        className="h-fit w-1/2 text-palette-on-background"
                        maxLength={30}
                        onChange={handleRenameColor}
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
                    <div
                        className="absolute cursor-pointer right-1 bottom-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5"
                        onClick={handleCopyColor}
                    >
                        <CopyIcon
                            size={18}
                            color="white"
                        />
                    </div>
                    <div
                        className="absolute cursor-pointer right-1 top-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5"
                        onClick={handleDeleteColor}
                    >
                        <DeleteIcon size={18} color="white" />
                    </div>
                </div>

            );
        }
    });

export default ColorPreview;