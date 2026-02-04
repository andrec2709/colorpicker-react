import { memo, useEffect, useMemo, useRef, useState } from "react";
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
import { useLanguage } from "../../contexts/LanguageProvider";
import { useSettings } from "../../contexts/SettingsProvider";


export const PaletteView = memo(
    function PaletteView() {
        const { selectedPalette, viewLayout } = usePalette();
        const { addColorToEnd } = useSettings();
        const { i18n } = useLanguage();
        
        /* 
        This ref is used to avoid scrolling to the top or bottom or the
        PaletteView container when the user is sorting the items.
        If selectedPalette was changed due to sorting, this becomes
        true, and auto scroll will not trigger.
        */
        const changeComesFromSort = useRef(false);
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
        const scrollableRef = useRef<HTMLDivElement>(null);
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
                    changeComesFromSort.current = true;
                }
            }
        };

        useEffect(() => {
            const element = scrollableRef.current;
            if (selectedPalette && element) {
                if (!changeComesFromSort.current) {
                 
                    if (addColorToEnd) {
                        element.scrollTo({
                            behavior: 'smooth',
                            top: element.scrollHeight,
                        });
                    } else {
                        element.scrollTo({
                            behavior: 'smooth',
                            top: 0,
                        });
                    }
                }
                changeComesFromSort.current = false;
            }
        }, [selectedPalette]);

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToFirstScrollableAncestor]}
                autoScroll={{
                    acceleration: 1,
                }}
                onDragEnd={handleDragEnd}
                accessibility={{
                    screenReaderInstructions: {
                        draggable: i18n.t('sortableScreenReaderInstructions'),
                    }
                }}

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
                                    ref={scrollableRef}
                                >
                                    {colors}
                                </div>

                            )
                            : (
                                <div
                                    className="flex flex-col gap-y-2 overflow-y-scroll h-[inherit]"
                                    ref={scrollableRef}
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