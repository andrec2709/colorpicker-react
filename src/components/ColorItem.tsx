import { memo, useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext.jsx";
import { usePalette } from "../contexts/PaletteContext.jsx";
import CopyIcon from '../assets/copy.svg';
import DeleteIcon from '../assets/delete.svg';
import { debounce } from "../utils/index.jsx";
import { useSettings } from "../contexts/SettingsContext.jsx";
import type { Color, PaletteData } from "../types/palette.ts";

type Props = {
    previewColor: Color;
    colorId: string;
    onClick: (color: Color) => void;
};

export const ColorItem = ({ previewColor, colorId, onClick }: Props) => {

    const { showMessage } = useToolTip();
    const {
        selectedPaletteId,
        viewLayout,
        palettesData,
        updatePalettesData,
        isHoldingItem,
        setIsHoldingItem,
        red,
        green,
        blue
    } = usePalette();

    const {copyHexWithoutHash} = useSettings();

    const [isHolding, setIsHolding] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const [contrastRatio, setContrastRatio] = useState(0);

    const colorItem = useRef<HTMLDivElement>(null);
    const LONG_PRESS_DURATION = 300; // ms
    const longPressTimer = useRef<ReturnType<typeof setTimeout>>(null);

    function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        let copy: string;
        
        copy = copyHexWithoutHash ? previewColor.hex.replace('#', '') : previewColor.hex;

        navigator.clipboard.writeText(copy)
            .then(() => {
                showMessage('Copied!', 'ok');
            }, () => {
                showMessage('Failed!', 'fail');
            });
    }

    function handleRemoveColor(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        const updatedPalettes = palettesData.map((palette: PaletteData) => {
            if (palette.id === selectedPaletteId) {
                return {
                    ...palette,
                    colors: palette.colors.filter(c => c.id !== colorId)
                };
            }

            return palette;
        });
        updatePalettesData(updatedPalettes);

    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        handleMoveItemUp(e);
        setIsPressing(false);
        setIsHolding(false);
        setIsHoldingItem(false);

    }

    const handleMoveItem = useCallback((e: PointerEvent) => {
        if (colorItem.current && isHolding) {

            const rect = colorItem.current.getBoundingClientRect();

            console.log(`e.clientX: ${e.clientX}\ne.clientY: ${e.clientY}`);

            const x = e.clientX - rect.width / 2;
            const y = e.clientY - rect.height / 2;

            colorItem.current.classList.add('dragging');
            colorItem.current.style.left = `${x}px`;
            colorItem.current.style.top = `${y}px`;

        }

    }, [isHolding]);

    const handleMoveItemUp = useCallback((e: PointerEvent | React.PointerEvent) => {
        if (isHolding) {
            const x = e.clientX;
            const y = e.clientY;

            const elements = document.elementsFromPoint(x, y);
            const lookForClass = viewLayout === 'block' ? 'color' : 'color-item';
            elements.forEach((el: HTMLElement) => {
                if (el.classList.contains(lookForClass) && el !== colorItem.current) {
                    const updatedPalettes = palettesData.map((palette: PaletteData) => {
                        if (palette.id === selectedPaletteId) {
                            const colors = palette.colors.slice();

                            const selfIndex = colors.findIndex(color => color.id === colorId);

                            let moveTo = colors.findIndex(color => color.id === el.dataset.colorId);
                            moveTo += selfIndex > moveTo ? 1 : 0;

                            const spliced = colors.splice(selfIndex, 1);

                            colors.splice(moveTo, 0, ...spliced);

                            return {
                                ...palette,
                                colors
                            };
                        }

                        return palette;
                    });

                    updatePalettesData(updatedPalettes);

                }
            });

        }
        setIsHolding(false)
        setIsHoldingItem(false);
        setIsPressing(false);

        if (colorItem.current) {
            colorItem.current.classList.remove('dragging');
            colorItem.current.classList.remove('highlighted');
            colorItem.current.style.left = 'unset';
            colorItem.current.style.top = 'unset';
        }
    }, [isHolding, palettesData, selectedPaletteId, colorId]);

    function handlePointerLeave(e: React.PointerEvent<HTMLDivElement>) {
        colorItem.current.classList.remove('highlighted');
    }

    function handlePointerEnter(e: React.PointerEvent<HTMLDivElement>) {
        if (isHoldingItem) colorItem.current.classList.add('highlighted');
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        const targetElement = e.target;

        if (!(targetElement instanceof HTMLElement)) return;

        if (targetElement.tagName === 'INPUT') return;

        // e.preventDefault();

        if (e.pointerType === 'touch') return; // disabling drag on mobile, for now.

        setIsPressing(true);
    }

    function handleColorNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const updatedPalettes = palettesData.map((palette: PaletteData) => {
            if (palette.id === selectedPaletteId) {
                const colors = palette.colors.slice();

                colors.forEach(color => {
                    if (color.id === colorId) {
                        color.name = e.target.value;
                    }
                });

                return {
                    ...palette,
                    colors
                };
            }

            return palette;
        });

        updatePalettesData(updatedPalettes);
    }

    function handleFocusName(e: React.FocusEvent<HTMLInputElement>) {
        e.preventDefault();
        e.stopPropagation();
        e.target.select();
    }

    useEffect(() => {
        if (isPressing) {

            longPressTimer.current = setTimeout(() => {
                setIsHolding(true);
                setIsHoldingItem(true);
            }, LONG_PRESS_DURATION);

        }

        return () => {
            clearTimeout(longPressTimer.current);
        };
    }, [isPressing]);

    useEffect(() => {
        if (isHolding) {
            document.addEventListener('pointermove', handleMoveItem, {passive: false});
            document.addEventListener('pointerup', handleMoveItemUp);
        }

        return () => {
            document.removeEventListener('pointermove', handleMoveItem);
            document.removeEventListener('pointerup', handleMoveItemUp);
        }
    }, [isHolding, handleMoveItem, handleMoveItemUp]);

    if (viewLayout == 'grid') {
        return (
            <div
                className="color-item"
                data-color-id={previewColor.id}
                style={{
                    backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})`,
                    scrollSnapAlign: 'start'
                }}
                onClick={() => onClick(previewColor)}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerEnter={handlePointerEnter}
                ref={colorItem}
                tabIndex={0}
                role="button"
            >
                <button className="color-item__btn" onClick={handleCopy}>
                    <img className="color-item__icon" src={CopyIcon} alt="copy color" />
                </button>
                <button className="color-item__btn" onClick={handleRemoveColor}>
                    <img className="color-item__icon" src={DeleteIcon} alt="delete color" />
                </button>
            </div>
        );
    } else {
        return (
            <div
                data-color-id={previewColor.id}
                className="color"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerEnter={handlePointerEnter}
                ref={colorItem}
                tabIndex={0}
                role="button"
            >
                <div
                    className="color-item"
                    onClick={() => onClick(previewColor)}
                    style={{
                        backgroundColor: `rgb(${previewColor.r}, ${previewColor.g}, ${previewColor.b})`,
                        gridArea: 'a'
                    }}

                >
                    <button
                        className="color-item__btn"
                        onClick={handleCopy}
                    >
                        <img className="color-item__icon" src={CopyIcon} alt="copy color" /></button>
                    <button
                        className="color-item__btn"
                        onClick={handleRemoveColor}
                    >
                        <img className="color-item__icon" src={DeleteIcon} alt="delete color" /></button>

                </div>
                <input
                    className="name"
                    type="text"
                    value={previewColor.name}
                    onChange={handleColorNameChange}
                    onFocus={handleFocusName}
                    style={{
                        gridArea: 'b',
                    }}
                />
            </div>
        );
    }
};

export default memo(ColorItem);