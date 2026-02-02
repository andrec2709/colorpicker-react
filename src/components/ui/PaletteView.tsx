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

        const colors = useMemo(() =>
            selectedPalette?.colors.map(color => (
                <ColorPreview data={color} key={color.id} />
            )), [selectedPalette]);

        const handleDragEnd = (e: DragEndEvent) => {
            const { active, over } = e;
            if (over && active.id !== over.id) {
               
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
                                gap-2 justify-center overflow-y-scroll h-[inherit]"
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