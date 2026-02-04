import { memo, type ButtonHTMLAttributes } from "react";
import type { IconProps } from "../../types/icon";



type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    Icon: React.ComponentType<IconProps>;
    iconProps?: IconProps;
};

export const ButtonWithIcon = memo(function ButtonWithIcon({
    Icon, iconProps, ...buttonProps
}: Props) {
    return (
        <button {...buttonProps}>
            <Icon {...iconProps} />
        </button>
    );
}
);

export default ButtonWithIcon;