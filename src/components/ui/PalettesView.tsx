import { memo, useMemo, useState } from "react";
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
    DragOverlay,
    type DragStartEvent,
    type UniqueIdentifier,
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
import { useLanguage } from "../../contexts/LanguageProvider";
import { PaletteDraggablePreview } from "./PaletteDraggablePreview";
import usePaletteSorter from "../../application/palette/usePaletteSorter";

export const PalettesView = memo(function PalettesView() {
    const { palettesData, viewLayout, setPalettesData } = usePalette();
    const { i18n } = useLanguage();
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
    const sorter = usePaletteSorter();
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const activeItemData = useMemo(() => palettesData.find(plt => plt.id === activeId), [activeId]);

    const handleDragEnd = async (e: DragEndEvent) => {
        const { active, over, collisions, delta, activatorEvent } = e;

        if (over && active.id !== over.id) {
            const oldIndex = palettesData.findIndex(palette => palette.id === active.id);
            const newIndex = palettesData.findIndex(palette => palette.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newPalettesData = arrayMove(palettesData, oldIndex, newIndex);
                // await saveAll(newPalettesData);
                await sorter.moveOver(active.id.toString(), over.id.toString());
                setPalettesData(newPalettesData);
            }
        }
        setActiveId(null);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id);
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
            onDragStart={handleDragStart}
            autoScroll={{
                acceleration: 1,
            }}
            accessibility={{
                screenReaderInstructions: {
                    draggable: i18n.t('sortableScreenReaderInstructions'),
                }
            }}
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
            <DragOverlay>
                {activeId && activeItemData && (
                    <PaletteDraggablePreview 
                        data={activeItemData}
                        className="border-dashed border-2 border-palette-border-hover bg-palette-background/30"
                        isOverlay
                        inputProps={{
                            value: activeItemData.name,
                        }}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
});

export default PalettesView;