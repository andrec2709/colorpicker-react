
export const PalettesListView = ({ children, style }) => {

    return (
        <div id="palettes-list" className="palettes-container" style={style}>
            {children}
        </div>
    );
};

export default PalettesListView;