import { memo } from "react";

type Props = {
    children: React.ReactNode;
    style: React.CSSProperties;
    ref: React.Ref<HTMLDivElement>;
};

export const PaletteDetailView = ({ children, style, ref }: Props) => {

    return (
        <div
            id="palette-detail"
            className="palette-detail"
            style={style}
            onClick={e => {
                if (!(e.target instanceof HTMLElement)) return;
                
                e.target.focus();
            }}
            ref={ref}
        >
            {children}
        </div>
    );
};

export default memo(PaletteDetailView);