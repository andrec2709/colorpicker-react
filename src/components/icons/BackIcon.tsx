import { memo } from "react";
import type { IconProps } from "../../types/icon";

export const BackIcon = memo(function ({ color = '#000000', size = 24, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
    );
});

export default BackIcon;