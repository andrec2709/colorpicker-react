
import { memo } from "react";
import type { IconProps } from "../../types/icon";

export const AddIcon = memo(function ({ color = '#000000', size = 24, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
    );
});

export default AddIcon;