import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext";
import { usePalette } from "../contexts/PaletteContext";
import CopyIcon from '../assets/copy.svg';
import DeleteIcon from '../assets/delete.svg';

export const ColorItem = ({ previewColor, colorId, onClick }) => {

    const { showMessage } = useToolTip();
    const { selectedPaletteId, selectedPalette, viewLayout, palettesData, updatePalettesData, isHoldingItem, setIsHoldingItem } = usePalette();

    const datasetColor = JSON.stringify(previewColor);

    const [isHolding, setIsHolding] = useState(false);
    const [isPressing, setIsPressing] = useState(false);

    const colorItem = useRef(null);
    const LONG_PRESS_DURATION = 300; // ms
    const longPressTimer = useRef(null);

    function handleCopy(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(previewColor.hex)
            .then(() => {
                showMessage('Copied!', 'ok');
            }, () => {
                showMessage('Failed!', 'fail');
            });
    }

    function handleRemoveColor(e) {
        e.stopPropagation();
        const updatedPalettes = palettesData.map(palette => {
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

    function handlePointerUp(e) {
        handleMoveItemUp(e);
        setIsPressing(false);
        setIsHolding(false);
        setIsHoldingItem(false);

    }

    const handleMoveItem = useCallback(e => {
        if (colorItem.current && isHolding) {

            const rect = colorItem.current.getBoundingClientRect();


            const x = e.clientX - rect.width / 2;
            const y = e.clientY - rect.height / 1.2;

            colorItem.current.style.position = 'absolute';
            colorItem.current.style.pointerEvents = 'none';
            colorItem.current.style.zIndex = '999';
            colorItem.current.style.scale = '.8';
            colorItem.current.style.left = `${x}px`;
            colorItem.current.style.top = `${y}px`;

        }
    }, [isHolding]);

    const handleMoveItemUp = useCallback(e => {
        if (isHolding) {
            const x = e.clientX;
            const y = e.clientY;

            const elements = document.elementsFromPoint(x, y);
            const lookForClass = viewLayout === 'block' ? 'color-item-container' : 'color-item';
            elements.forEach(el => {
                if (el.classList.contains(lookForClass) && el !== colorItem.current) {
                    const updatedPalettes = palettesData.map(palette => {
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
            colorItem.current.classList.remove('highlighted');
            colorItem.current.style.position = 'relative';
            colorItem.current.style.pointerEvents = 'auto';
            colorItem.current.style.scale = '';
            colorItem.current.style.zIndex = 'unset';
            colorItem.current.style.left = 'unset';
            colorItem.current.style.top = 'unset';
        }
    }, [isHolding, palettesData, selectedPaletteId, colorId]);

    function handlePointerLeave(e) {
        colorItem.current.classList.remove('highlighted');
    }

    function handlePointerEnter(e) {
        if (isHoldingItem) colorItem.current.classList.add('highlighted');
    }

    function handlePointerDown(e) {

        if (e.target.tagName === 'INPUT') return;
        
        e.preventDefault();
        
        if (e.pointerType === 'touch') return; // disabling drag on mobile, for now.

        setIsPressing(true);
    }

    function handleColorNameChange(e) {
        const updatedPalettes = palettesData.map(palette => {
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
            document.addEventListener('pointermove', handleMoveItem, { passive: false });
            document.addEventListener('pointerup', handleMoveItemUp);
        }

        return () => {
            document.removeEventListener('pointermove', handleMoveItem, { passive: false });
            document.removeEventListener('pointerup', handleMoveItemUp);
        }
    }, [isHolding, handleMoveItem, handleMoveItemUp]);

    if (viewLayout == 'grid') {
        return (
            <div
                className="color-item"
                data-color={datasetColor}
                data-color-id={previewColor.id}
                style={{ backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})` }}
                onClick={() => onClick(previewColor)}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerEnter={handlePointerEnter}
                ref={colorItem}
                tabIndex="0"
                role="button"
            >
                <button className="color-copy" onClick={handleCopy}>
                    <img src={CopyIcon} alt="copy color" />
                </button>
                <button className="color-delete" onClick={handleRemoveColor}>
                    <img src={DeleteIcon} alt="delete color" />
                </button>
            </div>
        );
    } else {
        return (
            <div
                data-color={datasetColor}
                data-color-id={previewColor.id}
                className="color-item-container"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerEnter={handlePointerEnter}
                ref={colorItem}
                tabIndex="0"
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
                        className="color-copy"
                        onClick={handleCopy}
                    >
                        <img src={CopyIcon} alt="copy color" /></button>
                    <button
                        className="color-delete"
                        onClick={handleRemoveColor}
                    >
                        <img src={DeleteIcon} alt="delete color" /></button>

                </div>
                <input
                    className="name"
                    type="text"
                    value={previewColor.name}
                    onChange={handleColorNameChange}
                    style={{
                        gridArea: 'b',
                    }}
                />
            </div>
        );
    }
};

export default ColorItem;