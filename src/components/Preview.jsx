import { useEffect, useRef } from "react";
import { usePalette } from "../contexts/PaletteContext";

export const Preview = () => {
    const { red, green, blue, selection } = usePalette();
    const defaultText = localStorage.getItem('default-text') || 'Click me to change the text\n\n:)';
    const textRef = useRef(null);
    const bgRef = useRef(null);

    function setText(e) {
        localStorage.setItem('default-text', e.target.value);
    }

    function setColor() {
        if (selection === 'background') {
            bgRef.current.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        } else {
            textRef.current.style.color = `rgb(${red}, ${green}, ${blue})`;
        }
    }

    useEffect(() => {
        setColor();
    }, [red, green, blue]);

    return (
        <div
            ref={bgRef}
            className="preview-container"
            style={{
                // backgroundColor: `rgb(${red}, ${green}, ${blue})`,
            }}
        >
            <textarea
                ref={textRef}
                name="preview-text"
                id="preview-text"
                className="preview__textarea"
                defaultValue={defaultText}
                onChange={setText}
            ></textarea>
        </div>
    );
};

export default Preview;