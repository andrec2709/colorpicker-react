import { memo, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    className?: string
};

export const ThemedInput = memo(function ({className = '', ...props}: Props) {
    return (
        <input 
            type="text"
            className={"text-on-background focus:outline-none" + " " + className}
            {...props}
        />
    );
});

export default ThemedInput;