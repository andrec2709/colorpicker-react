import { memo, type HTMLAttributes } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLTextAreaElement>,
    'className' | 'maxLength' | 'spellCheck'> & {
        field: 'title' | 'body';
        ref?: React.Ref<HTMLTextAreaElement>;
        label?: string;
    };

export const TextPreview = memo(function ({ ref, field, label, ...props }: Props) {


    return (
        <>
            <label
                htmlFor={props.id}
                className="sr-only"
            >{label}
            </label>
            <textarea
                className={`resize-none text-center font-[Inter] 
                field-sizing-content w-[90%] focus:outline-none
                ${field === 'body' ? 'text-xl' : 'text-3xl font-bold'}`}
                maxLength={50}
                spellCheck={false}
                ref={ref}
                {...props}
            >
            </textarea>
        </>
    );
});

export default TextPreview;