import { memo, useMemo, type ComponentPropsWithRef, type HTMLAttributes } from "react";
import type { PaletteData } from "../../domain/palette/types";
import ThemedInput, { type ThemedInputProps } from "./ThemedInput";
import { usePalette } from "../../contexts/PaletteProvider";

type Props = ComponentPropsWithRef<'div'> & {
    data: PaletteData;
    inputProps: ThemedInputProps;
    isOverlay?: boolean;
};

export const PaletteDraggablePreview = memo(function PaletteDraggablePreview({
    data,
    inputProps,
    isOverlay = false,
    ...props
}: Props) {

    const { viewLayout } = usePalette();

    const maxPreviewColors = 4;
    const previewColors = useMemo(
        () => {

            const components = data.colors.slice(0, maxPreviewColors)
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
                                opacity: isOverlay ? '.5' : '1',
                            }}
                        >
                        </div>

                    );
                }

                )

            /* 
            This conditional is for controlling how the color previews are displayed in the palette preview.
            
            In order to keep the grid correctly aligned, I add two transparent placeholders just to keep
            it structurally the same as a palette with 4+ colors.
            
            If this is not done, palettes with two colors will have the color previews centered in the palette
            preview.
            */
            if (components.length < 3) {

                const placeholder = (fakeId: string) => (
                    <div
                        key={fakeId}
                        style={{
                            backgroundColor: 'transparent',
                            width: '2rem',
                            aspectRatio: '1 / 1',
                            borderRadius: '5px',
                        }}
                    >
                    </div>
                );

                components.push(placeholder('FAKE_ITEM_1@--__220912389'));
                components.push(placeholder('FAKE_ITEM_2@--__231238726'));
            }

            return components;
        }, []);


    if (viewLayout === 'grid') {
        return (
            <div
                {...props}
                className={'grid touch-pan-y cursor-pointer grid-cols-2 border border-palette-border hover:border-palette-border-hover transition-[border-color] duration-150 justify-items-center items-center w-20 p-1 aspect-square bg-palette-background rounded-sm' + ' ' + (props.className ?? '')}
            >
                {previewColors}
            </div>
        );
    } else {
        return (
            <div
                {...props}
                className={'flex touch-pan-y box-border cursor-pointer border border-palette-border hover:border-palette-border-hover transition-[border-color] duration-150 bg-palette-background rounded-sm items-center gap-x-5' + ' ' + (props.className ?? '')}
            >
                <div
                    className="grid grid-cols-2 items-center place-items-center w-20 p-1 aspect-square rounded-sm"
                >
                    {previewColors}
                </div>
                <ThemedInput
                    {...inputProps}
                    maxLength={inputProps.maxLength ?? 30}
                    className={`h-fit w-1/2 text-palette-on-background ${isOverlay ? 'opacity-30' : ''}` + ' ' + (inputProps.className ?? '')}
                    labelProps={{
                        ...inputProps.labelProps,
                        className: 'text-palette-on-background' + ' ' + (inputProps.labelProps?.className ?? ''),
                    }}
                />
            </div>
        );
    }

});