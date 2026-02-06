import { memo, type ButtonHTMLAttributes } from "react";
import type { IconProps } from "../../types/icon";



export type ButtonWithIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    Icon: React.ComponentType<IconProps>;
    iconProps?: IconProps;
};

export const ButtonWithIcon = memo(function ButtonWithIcon({
    Icon, iconProps, ...buttonProps
}: ButtonWithIconProps) {
    return (
        <button {...buttonProps}>
            <Icon {...iconProps} />
        </button>
    );
}
);

export default ButtonWithIcon;