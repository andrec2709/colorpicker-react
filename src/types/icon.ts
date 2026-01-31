import type { SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'fill'> & {
    color?: string;
    size?: number;
};