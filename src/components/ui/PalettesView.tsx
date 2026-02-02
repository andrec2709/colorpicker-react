import { memo, useMemo } from "react";
import { usePalette } from "../../contexts/PaletteProvider";
import PalettePreview from "./PalettePreview";
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
import useSavePalettesData from "../../application/palette/useSavePalettesData";

export const PalettesView = memo(function () {
    const { palettesData, viewLayout, setPalettesData } = usePalette();
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
    const saveAll = useSavePalettesData();

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oldIndex = palettesData.findIndex(palette => palette.id === active.id);
            const newIndex = palettesData.findIndex(palette => palette.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newPalettesData = arrayMove(palettesData, oldIndex, newIndex);
                saveAll(newPalettesData);
                setPalettesData(newPalettesData);
            }
        }
    };

    const palettes = useMemo(() =>
        palettesData.map(palette => <PalettePreview key={palette.id} data={palette} />)
        , [palettesData]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToFirstScrollableAncestor]}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={palettesData}
                strategy={rectSortingStrategy}
            >
                {
                    viewLayout === 'grid'
                        ? (
                            <div
                                className="grid grid-cols-[repeat(auto-fit,minmax(min-content,5rem))] 
                                gap-2 justify-center overflow-y-scroll h-fit max-h-80"
                            >
                                {palettes}
                            </div>

                        )
                        : (
                            <div
                                className="flex flex-col gap-y-2 overflow-y-scroll h-[inherit]"
                            >
                                {palettes}
                            </div>
                        )
                }
            </SortableContext>
        </DndContext>
    );
});

export default PalettesView;