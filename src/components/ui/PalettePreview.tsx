import { memo, useMemo } from "react";
import type { PaletteData } from "../../domain/palette/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { usePalette } from "../../contexts/PaletteProvider";
import ThemedInput from "./ThemedInput";
import useSavePalette from "../../application/palette/useSavePalette";
import { useLanguage } from "../../contexts/LanguageProvider";
import { PaletteDraggablePreview } from "./PaletteDraggablePreview";

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

        const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            await save({ ...data, name: e.currentTarget.value });
        }

        return (
            <PaletteDraggablePreview
                inputProps={{
                    value: data.name,
                    id: `input-palette-${data.id}`,
                    onChange: handleInputChange,
                    onClick: (e) => { e.stopPropagation(); e.preventDefault(); },
                    onFocus: (e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.select(); },
                    label: i18n.t('paletteTitleLabel'),
                }}
                data={data}
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                aria-label={i18n.t('paletteLabel', { paletteName: data.name })}
                onClick={e => { e.stopPropagation(); e.preventDefault(); setSelectedPaletteId(data.id); }}
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
            />
        );
    });

export default PalettePreview;