import { memo, useCallback } from "react";
import type { Color, RGB } from "../../domain/color/types";
import { usePalette } from "../../contexts/PaletteProvider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import useSaveColor from "../../application/palette/useSaveColor";
import { useColorActions } from "../../contexts/ColorProvider";
import useDeleteColor from "../../application/palette/useDeleteColor";
import ColorDraggablePreview from "./ColorDraggablePreview";

export const ColorPreview = memo(
    function ColorPreview({ data }: { data: Color }) {
        const { selectedPaletteId } = usePalette();
        const { setActiveColor, setHex } = useColorActions();
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

        const handleRenameColor = useCallback(async (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            if (selectedPaletteId) {
                await save({ ...data, name: e.currentTarget.value }, selectedPaletteId);
            }
        }, [selectedPaletteId]);

        const handleSelectColor = useCallback(() => {
            const rgb: RGB = [data.r, data.g, data.b];
            setActiveColor(rgb);
            setHex(data.hex);
        }, [data]);

        const handleCopyColor = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            e.preventDefault();
            navigator.clipboard.writeText(data.hex);
        }, [data]);

        const handleDeleteColor = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            e.preventDefault();

            if (!selectedPaletteId) return;

            await deleteColor(data.id, selectedPaletteId);
        }, [selectedPaletteId, data]);

        const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' && e.shiftKey) {
                handleSelectColor();
                return;
            }

            if (e.key === 'Enter' || e.key === ' ') {
                if (listeners) return listeners.onKeyDown?.(e);
            }
        }, [listeners]);

        const handleIconsKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
            e.stopPropagation();
        }, []);

        return (
            <ColorDraggablePreview 
                data={data}
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                onClick={handleSelectColor}
                onKeyDown={handleKeyDown}
                style={style}
                inputProps={{
                    value: data.name,
                    id: `input-color-${data.id}`,
                    onChange: handleRenameColor,
                    onClick: e => { e.stopPropagation(); e.preventDefault(); },
                    onFocus: e => { e.stopPropagation(); e.preventDefault(); e.currentTarget.select(); },
                }}
                copyBtnProps={{
                    onClick: handleCopyColor,
                    onKeyDown: handleIconsKeyDown,
                }}
                delBtnProps={{
                    onClick: handleDeleteColor,
                    onKeyDown: handleIconsKeyDown,
                }}
            />
        );
    });

export default ColorPreview;