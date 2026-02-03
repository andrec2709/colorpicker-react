
import { memo } from "react";
import type { IconProps } from "../../types/icon";

export const CloseIcon = memo(function CloseIcon({ color = '#000000', size = 24, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 -960 960 960"
            {...props}
        >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    );
});

export default CloseIcon;