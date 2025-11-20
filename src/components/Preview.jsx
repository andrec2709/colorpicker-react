import { useEffect, useRef } from "react";
import { usePalette } from "../contexts/PaletteContext";

export const Preview = () => {
    const { bgColor, txtColor } = usePalette();
    const defaultText = localStorage.getItem('default-text') || 'Click me to change the text\n:)';
    const textRef = useRef(null);
    const bgRef = useRef(null);

    function setText(e) {
        localStorage.setItem('default-text', e.target.value);
    }

    useEffect(() => {

        bgRef.current.style.backgroundColor = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
        textRef.current.style.color = `rgb(${txtColor[0]}, ${txtColor[1]}, ${txtColor[2]})`;

    }, [bgColor, txtColor]);

    return (
        <div
            ref={bgRef}
            className="preview-container"
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