
/**
 * Wrapper component for {@link Components/PalettesListView | PalettesListView} and {@link Components/PaletteDetailView | PaletteDetailView} components.
 * @function
 * @param {any[]} children - child components to be wrapped. 
 * @returns {JSX.Element}
 * 
 * @alias Components/Editor 
 */
export const Editor = ({ children }) => {
    return (
        <div id="editor" className="editor">
            {children}
        </div>
    );
};

export default Editor;