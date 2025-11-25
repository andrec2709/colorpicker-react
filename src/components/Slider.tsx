import { useCallback, useMemo, useRef, type PointerEventHandler } from "react";
import { useEffect, useState } from "react";
import { debounce } from "../utils/index.jsx";

type Props = {
    id: string;
    labelledBy: string;
    value: number;
    color: string;
    handleSize?: number;
    onChange: (value: string | number, color: string, modifierAllowed?: boolean) => void;
    min: number;
    max: number;
};

export const Slider = (
    {
        id,
        labelledBy,
        value,
        color,
        handleSize = 20,
        onChange,
        min = 0,
        max = 255,
    }: Props
) => {
    const [sliderTrackFill, setSliderTrackFill] = useState('0');
    const [thumbPos, setThumbPos] = useState('0');
    const [isPressed, setIsPressed] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const valueRef = useRef<number>(value);
    
    const startXRef = useRef(0);
    const movedRef = useRef(false);
    const MOVE_THRESHOLD = 3; // px

    const elementRef = useRef<HTMLDivElement>(null);


    const calcThumbPos = useCallback(() => {

        if (!elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();

        const width = rect.width;

        let pos = valueRef.current * width / max;

        pos = Math.max(0, Math.min(width, pos));


        setThumbPos(`${pos - handleSize / 2}px`);
        setSliderTrackFill(`${pos}px`)
    }, []);

    const debouncedCalcThumbPos = useMemo(() => debounce(calcThumbPos, 100), [value]);

    const handlePointerMove = useCallback((e: React.PointerEvent | PointerEvent, { initial = false } = {}) => {

        e.preventDefault();

        const rect = elementRef.current.getBoundingClientRect();

        const x1 = rect.left;
        const width = rect.width;

        let pos = e.clientX - x1;
        pos = Math.max(0, Math.min(width, pos));

        if (!initial) {
            const delta = Math.abs(e.clientX - startXRef.current);
            if (!movedRef.current && delta > MOVE_THRESHOLD) {
                movedRef.current = true;
                setIsDragging(true);
            }
        }

        let newValue = min + pos / width * (max - min);
        newValue = Math.round(newValue)

        setThumbPos(`${pos - handleSize / 2}px`)
        setSliderTrackFill(`${pos}px`);

        onChange(newValue, color);
    }, [min, max, handleSize, onChange, color]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();

        startXRef.current = e.clientX;
        movedRef.current = false;
        setIsDragging(false); // not dragging yet

        if (elementRef.current) {
            elementRef.current.focus();
        }

        handlePointerMove(e, { initial: true });
        setIsPressed(true);
    }

    const handlePointerUp = () => {
        setIsPressed(false);

        if (movedRef.current) {
            movedRef.current = false;
            setIsDragging(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const keys = ['ArrowLeft', 'ArrowRight'];

        if (keys.includes(e.key)) e.preventDefault();

        let newValue = value;

        let modifier = 1;

        if (e.repeat) {
            modifier += 6;
        }

        if (e.ctrlKey) {
            modifier += 10;
        }

        switch (e.key) {
            case 'ArrowLeft':
                newValue -= modifier;
                break;
            case 'ArrowRight':
                newValue += modifier;
                break;
        }

        newValue = Math.max(min, Math.min(newValue, max));

        onChange(newValue, color);
    };

    useEffect(() => {
        valueRef.current = value;
        if (elementRef.current) {
            calcThumbPos();
        }

        window.addEventListener('resize', debouncedCalcThumbPos);

        return () => {
            window.removeEventListener('resize', debouncedCalcThumbPos);
        }
    }, [value]);

    useEffect(() => {

        if (isPressed) {
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp, { once: true });
        }

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

    }, [isPressed, handlePointerMove]);

    return (
        <div
            id={id}
            className='slider'
            data-value={value}
            data-color={color}
            data-pressed={isPressed}
            data-dragging={isDragging}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            ref={elementRef}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-labelledby={labelledBy}
            style={{
                height: handleSize
            }}
        >
            <div
                className="slider__track--filled"
                style={{
                    width: sliderTrackFill
                }}
            ></div>
            <div
                className="slider__thumb"
                style={{
                    width: handleSize,
                    left: thumbPos
                }}
            ></div>
            <div className="slider__track"></div>

        </div>
    );

};

export default Slider;