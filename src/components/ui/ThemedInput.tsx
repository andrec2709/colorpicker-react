import { memo, type InputHTMLAttributes, type LabelHTMLAttributes } from "react";

export type ThemedInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    className?: string;
    label?: string;
    labelProps?: Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>;
};

/**
 * @function
 * A themed input (text color defaults to theme's on-background color) with a label hidden by default.
 */
export const ThemedInput = memo(function ThemedInput({
    label = '',
    className = '',
    labelProps,
    ...props
}: ThemedInputProps) {
    return (
        <>
            <label
                {...labelProps}
                className={'sr-only text-on-background' + ' ' + (labelProps?.className ?? '')}
                htmlFor={props.id}
            >
                {label}
            </label>
            <input
                type="text"
                className={"text-on-background focus:outline-none" + " " + className}
                {...props}
            />
        </>
    );
});

export default ThemedInput;