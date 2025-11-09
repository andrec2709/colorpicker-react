import { usePalette } from "../contexts/PaletteContext";

export const PaletteDetailView = ({ children, style }) => {

    return (
        <div id="palette-detail" style={style}>
            {children}
        </div>
    );
};

export default PaletteDetailView;