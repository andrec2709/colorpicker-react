import { useCallback, useEffect, useRef } from "react";
import { useColor } from "../../contexts/ColorProvider";
import { useDefaultText } from "../../contexts/DefaultTextProvider";
import TextPreview from "./TextPreview";

export default function Preview() {
    const { bgColor, txtColor } = useColor();
    const { title, setTitle, body, setBody } = useDefaultText();

    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const bodyTextRef = useRef<HTMLTextAreaElement | null>(null);

    /**
     * Recalculates the height of the given textarea (by using its ref)
     * @param ref The ref of the textarea
     */
    const autoResizeTextArea = useCallback((ref: React.RefObject<HTMLTextAreaElement | null>) => {

        const element = ref.current;

        if (!element) return;

        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';

    }, []);

    /**
     * callback used when the window is resized, to recalculate both textareas's heights
     */
    const autoResizeBoth = useCallback(() => {
        autoResizeTextArea(titleRef);
        autoResizeTextArea(bodyTextRef);
    }, [autoResizeTextArea]);

    /**
     * Handle input to title and body text areas
     * @param text the new text value of the field
     * @param origin where the event originates from (title or body textarea)
     * @param ref the ref of the textarea
     */
    const handleInput = useCallback((
        text: string,
        origin: 'title' | 'body',
        ref: React.RefObject<HTMLTextAreaElement | null>,
    ) => {
        if (origin === 'body') {
            setBody(text);
        } else {
            setTitle(text);
        }
        autoResizeTextArea(ref);
    }, [autoResizeTextArea]);

    /* runs resize on mount */
    useEffect(() => {
        autoResizeBoth();
    }, []);

    useEffect(() => {
        window.addEventListener('resize', autoResizeBoth);

        return () => {
            window.removeEventListener('resize', autoResizeBoth);
        };
    }, [autoResizeBoth]);

    return (
        <div className="w-full h-fit rounded-2xl flex flex-col items-center justify-center py-5" style={{ backgroundColor: `rgb(${bgColor.join(',')})` }}>
            <TextPreview
                name="title-preview"
                id="title-preview"
                ref={titleRef}
                defaultValue={title}
                field="title"
                onInput={e => handleInput(e.currentTarget.value, 'title', titleRef)}
                style={{ color: `rgb(${txtColor.join(',')})` }}
                label="title preview"
            ></TextPreview>
            <TextPreview
                name="text-preview"
                id="text-preview"
                ref={bodyTextRef}
                defaultValue={body}
                field="body"
                onInput={e => handleInput(e.currentTarget.value, 'body', bodyTextRef)}
                style={{ color: `rgb(${txtColor.join(',')})` }}
                label="body text preview"
            >
            </TextPreview>
        </div>
    );
}