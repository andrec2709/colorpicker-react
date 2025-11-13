import { useCallback, useRef } from "react";
import { useEffect, useState } from "react";

export const Slider = (
    {
        min = 0,
        max = 255,
        handleSize = 20,
        onChange,
        value,
        id,
        color,
        labelledBy
    }
) => {
    const [sliderTrackFill, setSliderTrackFill] = useState(0);
    const [handlePos, setHandlePos] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const elementRef = useRef(null);

    function calcThumbPos(target) {
        const rect = target.getBoundingClientRect();

        const width = rect.width;

        let pos = value * width / max;

        pos = Math.max(0, Math.min(width, pos));


        setHandlePos(`${pos - handleSize / 2}px`);
        setSliderTrackFill(`${pos}px`)
    }

    const handlePointerMove = useCallback((e) => {

        e.preventDefault();
        const rect = elementRef.current.getBoundingClientRect();

        const x1 = rect.left;
        const width = rect.width;

        let pos = e.clientX - x1;
        pos = Math.max(0, Math.min(width, pos));

        let newValue = min + pos / width * (max - min);
        newValue = Math.round(newValue)

        setHandlePos(`${pos - handleSize / 2}px`)
        setSliderTrackFill(`${pos}px`);

        // elementRef.current.dataset.value = newValue;
        onChange(newValue, color);
    }, [min, max, handleSize]);

    const handlePointerDown = (e) => {
        e.preventDefault();
        handlePointerMove(e);
        setIsPressed(true);
    }

    const handlePointerUp = () => setIsPressed(false);

    useEffect(() => {
        if (elementRef.current) {
            calcThumbPos(elementRef.current);
        }
    }, [value]);

    useEffect(() => {

        if (isPressed) {
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp, {once: true});
        }

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

    }, [isPressed]);

    return (
        <div
            id={id}
            className="slider-test-container"
            data-value={value}
            data-color={color}
            onPointerDown={handlePointerDown}
            onKeyDown={e => console.log(e)}
            ref={elementRef}
            tabIndex="0"
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
                className="slider-track-filled"
                style={{
                    width: sliderTrackFill
                }}
            ></div>
            <div
                className="slider-thumb"
                style={{
                    width: handleSize,
                    left: handlePos
                }}
            ></div>
            <div className="slider-track"></div>

        </div>
    );

};

export default Slider;