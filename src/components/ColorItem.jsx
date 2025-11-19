import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext";
import { usePalette } from "../contexts/PaletteContext";
import CopyIcon from '../assets/copy.svg';
import DeleteIcon from '../assets/delete.svg';
import { debounce } from "../utils";

/**
 * This component represents a single color of a palette. Not to be confused with the {@link Components/ColorPreview | ColorPreview} component.
 * @function
 * @param {Object} previewColor - an Object containing the properties id, r, g, b, hex and name, representing the color's unique ID, colors channel values, hex value and the color's name. 
 * @param {string} colorId - the color's unique ID. Same as previewColor.id
 * @param {function} onClick - callback function.
 * @returns {JSX.Element} A component that represents a single color inside a palette.
 * 
 * @alias Components/ColorItem
 */
export const ColorItem = ({ previewColor, colorId, onClick }) => {

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

    const datasetColor = JSON.stringify(previewColor);

    const [isHolding, setIsHolding] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const [contrastRatio, setContrastRatio] = useState(0);

    const colorItem = useRef(null);
    const LONG_PRESS_DURATION = 300; // ms
    const longPressTimer = useRef(null);

    const rgbRef = useRef({ r: red, g: green, b: blue })

    const textColor = () => {
        switch (true) {
            case contrastRatio < 4.5:
                return 'red';
                
            case contrastRatio >= 4.5 && contrastRatio < 7.5:
                return 'yellow';
            
            case contrastRatio >= 7.5:
                return 'green';
                
        }
    };

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

            colorItem.current.classList.add('dragging');
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
            const lookForClass = viewLayout === 'block' ? 'color' : 'color-item';
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
            colorItem.current.classList.remove('dragging');
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

        // e.preventDefault();

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

    function handleFocusName(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.select();
    }

    const handleCalcContrast = useCallback(() => {

        const { r, g, b } = rgbRef.current;

        // luminance for the slider's selected color
        let linearRed = parseInt(r) / 255;
        let linearGreen = parseInt(g) / 255;
        let linearBlue = parseInt(b) / 255;

        linearRed = linearRed <= 0.03928 ? linearRed / 12.92 : ((linearRed + 0.055)/1.055)**2.4;
        linearGreen = linearGreen <= 0.03928 ? linearGreen / 12.92 : ((linearGreen + 0.055)/1.055)**2.4;
        linearBlue = linearBlue <= 0.03928 ? linearBlue / 12.92 : ((linearBlue + 0.055)/1.055)**2.4;

        let luminanceSlider = (0.2126*linearRed + 0.7152*linearGreen + 0.0722*linearBlue) + 0.05;

        // luminance for **this** ColorItem's color
        linearRed = parseInt(previewColor.r) / 255;
        linearGreen = parseInt(previewColor.g) / 255;
        linearBlue = parseInt(previewColor.b) / 255;

        linearRed = linearRed <= 0.03928 ? linearRed / 12.92 : ((linearRed + 0.055)/1.055)**2.4;
        linearGreen = linearGreen <= 0.03928 ? linearGreen / 12.92 : ((linearGreen + 0.055)/1.055)**2.4;
        linearBlue = linearBlue <= 0.03928 ? linearBlue / 12.92 : ((linearBlue + 0.055)/1.055)**2.4;

        let luminanceThis = (0.2126*linearRed + 0.7152*linearGreen + 0.0722*linearBlue) + 0.05;

        let ratio;

        if (luminanceThis > luminanceSlider) {
            ratio = luminanceThis / luminanceSlider;
        } else {
            ratio = luminanceSlider / luminanceThis;
        }

        setContrastRatio(ratio.toFixed(2))
    }, []);

    const debouncedHandleCalcContrast = useMemo(() => debounce(handleCalcContrast, 100), []);

    useEffect(() => {
        rgbRef.current = { r: red, g: green, b: blue }
        debouncedHandleCalcContrast();
    }, [red, green, blue]);

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
                tabIndex="0"
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
                data-color={datasetColor}
                data-color-id={previewColor.id}
                className="color"
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
                <input
                    type="text"
                    className="color__input--readonly"
                    readOnly
                    disabled
                    value={`Contrast ratio: ${contrastRatio}`}
                    style={{
                        gridArea: 'c',
                        color: textColor()
                    }}
                />
            </div>
        );
    }
};

export default ColorItem;