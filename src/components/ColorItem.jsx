import { useCallback, useEffect, useRef, useState } from "react";
import { useToolTip } from "../contexts/ToolTipContext";
import { usePalette } from "../contexts/PaletteContext";
import CopyIcon from '../assets/copy.svg';
import DeleteIcon from '../assets/delete.svg';

export const ColorItem = ({ previewColor, colorId, onClick }) => {

    const { showMessage } = useToolTip();
    const { selectedPaletteId, selectedPalette, palettesData, updatePalettesData, isHoldingItem, setIsHoldingItem } = usePalette();

    const datasetColor = JSON.stringify(previewColor);

    const [isHolding, setIsHolding] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const delta = useRef(0);
    const t0 = useRef(0);
    const t1 = useRef(0);
    const colorItem = useRef(null);
    

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
    }

    function handlePointerMove(e) {
        if (isPressing) {
            t1.current = performance.now();
            delta.current = t1.current - t0.current;
            if (delta.current >= 600) {
                setIsHoldingItem(true);
                setIsHolding(true);
            }
        }
    }

    const handleMoveItem = useCallback(e => {
        if (colorItem.current && isHolding && isHoldingItem) {

            const rect = colorItem.current.getBoundingClientRect();
            
            const width = rect.width;
            const height = rect.height;

            const x = e.clientX - width / 2;
            const y = e.clientY - height / 2;

            colorItem.current.style.position = 'absolute';
            colorItem.current.style.zIndex = '999';
            colorItem.current.style.left = `${x}px`;
            colorItem.current.style.top = `${y}px`;

            const elements = document.elementsFromPoint(x - width / 2, y - height / 2);
            // console.log('<----------------------------->');
            elements.forEach(el => {
                if (el.classList.contains('color-item') && el !== colorItem.current) {
                    
                    const updatedPalettes = palettesData.map(palette => {
                        if (palette.id === selectedPaletteId) {
                            const colors = palette.colors.slice();

                            const placingIndex = colors.findIndex(color => color.id === el.dataset.colorId) + 1;
                            const selfIndex = colors.findIndex(color => color.id === colorId);

                            const spliced = colors.splice(selfIndex, 1);
                            colors.splice(placingIndex, 0, ...spliced);

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
            // console.log('<----------------------------->');
        }
    }, [isHolding, isHoldingItem]);

    const handleMoveItemUp = useCallback(e => {
        setIsHolding(false)
        setIsHoldingItem(false);
        setIsPressing(false);

        if (colorItem.current) {
            colorItem.current.style.position = 'relative';
            colorItem.current.style.zIndex = 'unset';
            colorItem.current.style.left = 'unset';
            colorItem.current.style.top = 'unset';

        }
    }, [isHolding, isPressing, isHoldingItem]);

    function handlePointerLeave(e) {
        colorItem.current.classList.remove('highlighted');
    }

    function handlePointerEnter(e) {
        if (isHoldingItem) colorItem.current.classList.add('highlighted');
    }

    useEffect(() => {
        document.addEventListener('pointermove', handleMoveItem);
        document.addEventListener('pointerup', handleMoveItemUp);

        return () => {
            document.removeEventListener('pointermove', handleMoveItem);
            document.removeEventListener('pointerup', handleMoveItemUp);
        }
    }, [isHolding, isHoldingItem, isPressing, handleMoveItem, handleMoveItemUp]);

    function handlePointerDown(e) {
        setIsPressing(true)

        t0.current = performance.now();

    }


    return (
        <div
            className="color-item"
            data-color={datasetColor}
            data-color-id={previewColor.id}
            style={{ backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})` }}
            onClick={() => onClick(previewColor)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
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
};

export default ColorItem;