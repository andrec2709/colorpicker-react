import type React from "react";

type Props = {
    children?: React.ReactNode;
    style: React.CSSProperties;
};

export const Settings = ({ children, style }: Props) => {
    return (
        <div className="settings" style={style}>
            {children}
        </div>
    );
};