import { memo } from "react";

type Props = {
    children: React.ReactNode;
    className: string;
};

export const Modifiers = ({ children, className }: Props) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export default memo(Modifiers);