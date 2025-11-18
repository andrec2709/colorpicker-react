
export const PaletteDetailView = ({ children, style }) => {

    return (
        <div id="palette-detail" className="palette-detail" style={style}>
            {children}
        </div>
    );
};

export default PaletteDetailView;