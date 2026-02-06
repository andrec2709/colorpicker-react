import { memo, useMemo, type ComponentPropsWithRef } from "react";
import type { Color } from "../../domain/color/types";
import { ThemedInput, type ThemedInputProps } from "./ThemedInput";
import { usePalette } from "../../contexts/PaletteProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import ButtonWithIcon, { type ButtonWithIconProps } from "./ButtonWithIcon";
import CopyIcon from "../icons/CopyIcon";
import DeleteIcon from "../icons/DeleteIcon";

type Props = Omit<ComponentPropsWithRef<'div'>, 'role' | 'tabIndex' | 'aria-label'> & {
    data: Color;
    inputProps: Omit<ThemedInputProps, 'label' | 'maxLength'>;
    isOverlay?: boolean;
    copyBtnProps?: Omit<ButtonWithIconProps, 'iconProps' | 'aria-label' | 'Icon'>;
    delBtnProps?: Omit<ButtonWithIconProps, 'iconProps' | 'aria-label' | 'Icon'>;
};

export const ColorDraggablePreview = memo(function ColorDraggablePreview({
    data,
    inputProps,
    copyBtnProps,
    delBtnProps,
    isOverlay = false,
    ...props
}: Props) {
    const { viewLayout } = usePalette();
    const { i18n } = useLanguage();

    /* 
    Memoized since iconProps was causing components to render even though they didn't change.
    */
    const iconPropsDeleteButton = useMemo(() => ({
        color: 'white',
        "aria-label": i18n.t('deleteIconLabel'),
        size: 18,
    }), []);

    /* 
    Memoized since iconProps was causing components to render even though they didn't change.
    */
    const iconPropsCopyButton = useMemo(() => ({
        color: 'white',
        "aria-label": i18n.t('copyIconLabel'),
        size: 18,
    }), []);

    if (viewLayout === 'grid') {
        return (
            <div
                {...props}
                role="button"
                tabIndex={0}
                aria-label={i18n.t('selectAsActive')}
                style={{
                    backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
                    ...props.style
                }}
                className={'w-20 aspect-square rounded-sm relative touch-pan-y' + ' ' + (props.className ?? '')}
            >
                <ButtonWithIcon
                    {...copyBtnProps}
                    aria-label={i18n.t('copyFromPalette')}
                    iconProps={iconPropsCopyButton}
                    Icon={CopyIcon}
                    className={'absolute cursor-pointer right-1 top-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5' + ' ' + (copyBtnProps?.className ?? '')}
                />
                <ButtonWithIcon
                    {...delBtnProps}
                    Icon={DeleteIcon}
                    aria-label={i18n.t('deleteIconLabel')}
                    iconProps={iconPropsDeleteButton}
                    className={'absolute cursor-pointer left-1 top-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5' + ' ' + (delBtnProps?.className ?? '')}
                />
            </div>
        );
    } else {
        return (
            <div
                {...props}
                className={'flex relative cursor-pointer hover:border-palette-border-hover transition-[border-color] duration-150 touch-pan-y border border-palette-border bg-palette-background rounded-sm items-center gap-x-5' + ' ' + (props.className ?? '')}
            >
                <div
                    style={{
                        backgroundColor: `rgb(${data.r},${data.g},${data.b})`,
                    }}
                    aria-label={i18n.t('selectAsActive')}
                    className="w-18 m-1 aspect-square cursor-pointer rounded-sm"

                >
                </div>
                <ThemedInput
                    {...inputProps}
                    className={'h-fit w-1/2 text-palette-on-background' + ' ' + (inputProps.className ?? '')}
                    maxLength={30}
                    label={i18n.t('colorName')}
                    labelProps={{
                        ...inputProps.labelProps,
                        className: 'text-palette-on-background' + ' ' + (inputProps.labelProps?.className ?? ''),
                    }}
                />
                <ButtonWithIcon
                    {...copyBtnProps}
                    Icon={CopyIcon}
                    aria-label={i18n.t('copyIconLabel')}
                    iconProps={iconPropsCopyButton}
                    className={'absolute cursor-pointer right-1 bottom-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5' + ' ' + (copyBtnProps?.className ?? '')}
                />
                <ButtonWithIcon
                    {...delBtnProps}
                    Icon={DeleteIcon}
                    aria-label={i18n.t('deleteIconLabel')}
                    iconProps={iconPropsDeleteButton}
                    className={'absolute cursor-pointer right-1 top-1 bg-black/60 active:bg-black/80 h-fit aspect-square rounded-4xl p-0.5' + ' ' + (delBtnProps?.className ?? '')}
                />
            </div>

        );
    }

});

export default ColorDraggablePreview;