import { usePalette } from "../contexts/PaletteContext";

export const PalettesListView = ({ children, style }) => {

    return (
        <div id="palettes-list" style={style}>
            {children}
        </div>
    );
};

export default PalettesListView;