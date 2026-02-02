import { memo, useMemo } from "react";
import { usePalette } from "../../contexts/PaletteProvider";
import ColorPreview from "./ColorPreview";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import useSavePalette from "../../application/palette/useSavePalette";


export const PaletteView = memo(
    function () {
        const { selectedPalette, viewLayout } = usePalette();
        const sensors = useSensors(
            useSensor(PointerSensor, {
                activationConstraint: {
                    delay: 200,
                    tolerance: 10,
                },
            }),
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            }),
        );
        const save = useSavePalette();

        const colors = useMemo(() =>
            selectedPalette?.colors.map(color => (
                <ColorPreview data={color} key={color.id} />
            )), [selectedPalette]);

        const handleDragEnd = (e: DragEndEvent) => {
            if (!selectedPalette) return;

            const { active, over } = e;
            if (over && active.id !== over.id) {
                const oldIndex = selectedPalette.colors.findIndex(color => color.id === active.id);
                const newIndex = selectedPalette.colors.findIndex(color => color.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newColors = arrayMove(selectedPalette.colors, oldIndex, newIndex);
                    save({ ...selectedPalette, colors: newColors });
                }
            }
        };


        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToFirstScrollableAncestor]}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={selectedPalette?.colors ?? []}
                    strategy={rectSortingStrategy}
                >
                    {
                        viewLayout === 'grid'
                            ? (
                                <div
                                    className="grid grid-cols-[repeat(auto-fit,minmax(min-content,5rem))] 
                                gap-2 justify-center overflow-y-scroll h-fit max-h-80"
                                >
                                    {colors}
                                </div>

                            )
                            : (
                                <div
                                    className="flex flex-col gap-y-2 overflow-y-scroll h-[inherit]"
                                >
                                    {colors}
                                </div>
                            )
                    }
                </SortableContext>
            </DndContext>
        );

    }
);

export default PaletteView;