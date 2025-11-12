import { useEffect, useState } from "react";

export const Slider = (
    {
        min = 0,
        max = 255,
        step = 1,
        handleSize = 20,
        onChange,
        value,
        id,
        color
    }
) => {
    // const [value, setValue] = useState(0);
    const [handlePos, setHandlePos] = useState(`-${handleSize / 2}px`);
    const [sliderTrackFill, setSliderTrackFill] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [rect, setRect] = useState(null);
    const [target, setTarget] = useState(null);

    console.log(value);
    useEffect(() => {
        const handlePointerMove = (e) => {

            const x1 = rect.left;
            const width = rect.width;

            let pos = e.clientX - x1;
            pos = Math.max(0, Math.min(width, pos));

            let newValue = min + (pos / width) * (max - min);

            const steps = Math.round((newValue - min) / step);
            const snapped = min + steps * step;

            newValue = Math.min(max, Math.max(min, snapped));

            // setValue(newValue);
            // value = newValue; 
            // onChange(newValue);

            const handlePos = pos - handleSize / 2;

            setHandlePos(`${handlePos}px`)
            setSliderTrackFill(`${pos}px`);
        };

        const handlePointerUp = () => setIsPressed(false);

        if (isPressed) {
            document.addEventListener('mousemove', handlePointerMove);
            document.addEventListener('mouseup', handlePointerUp);
        }

        return () => {
            document.removeEventListener('mousemove', handlePointerMove);
            document.removeEventListener('mouseup', handlePointerUp);
        };

    }, [isPressed]);

    const handlePointerDown = (e) => {
        setRect(e.currentTarget.getBoundingClientRect());
        setTarget(e.currentTarget);
        setIsPressed(true);
    }

    return (
        <div
            className="slider-test-container"
            style={{
                height: handleSize
            }}
            data-value={value}
            id={id}
            data-color={color}
            onPointerDown={handlePointerDown}
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

export default Slider