import { memo } from "react";

type Props = {
    children: React.ReactNode;
    style: React.CSSProperties;
};

export const PalettesListView = ({ children, style }: Props) => {

    return (
        <div id="palettes-list" className="palettes-container" style={style}>
            {children}
        </div>
    );
};

export default memo(PalettesListView);