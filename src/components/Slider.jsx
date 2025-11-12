import { useEffect, useState } from "react";

export const Slider = (
    {
        min = 0,
        max = 255,
        handleSize = 20,
        onChange,
        value,
        id,
        color
    }
) => {
    const [sliderTrackFill, setSliderTrackFill] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [target, setTarget] = useState(null);
    const [handlePos, setHandlePos] = useState(`-${calcThumbPos() ?? handleSize / 2}px`);
    console.log(handlePos);
    function calcThumbPos() {
        const rect = target?.getBoundingClientRect();
        console.log(rect)

        if (rect === undefined) return null;

        const x1 = rect?.left;
        const width = rect?.width;

        const clientX = (value * width / max) + x1; 
        console.log(`x1: ${x1}\nwidth: ${width}\nclientX: ${clientX}`);
        let pos = clientX - x1;
        pos = Math.max(0, Math.min(width, pos));

        // console.log(pos - handleSize / 2);

        return pos - handleSize / 2;
        // setHandlePos(`${pos - handleSize / 2}px`);
    }

    useEffect(() => {
        setHandlePos(`${calcThumbPos}px`);
    }, [target]);

    useEffect(() => {
        const handlePointerMove = (e) => {

            const rect = target.getBoundingClientRect();

            const x1 = rect.left;
            const width = rect.width;

            let pos = e.clientX - x1;
            pos = Math.max(0, Math.min(width, pos));

            let newValue = min + pos / width * (max - min);
            newValue = Math.round(newValue)

            setHandlePos(`${pos - handleSize / 2}px`)
            setSliderTrackFill(`${pos}px`);

            target.dataset.value = newValue;
            onChange(target);
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
        setTarget(e.currentTarget);
        setIsPressed(true);
    }

    return (
        <div
            id={id}
            className="slider-test-container"
            data-value={value}
            data-color={color}
            onPointerDown={handlePointerDown}
            onLoad={(e) => {setTarget(e.currentTarget)}}
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

export default Slider