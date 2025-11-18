
/**
 * This component is the preview of a color inside a palette, displayed in the {@link Components/PalettesListView | PalettesListView}. Not to be confused with {@link Components/ColorItem | ColorItem}.
 * @function
 * @param {Object} previewColor - an Object containing the properties: id, r, g, b, hex, name, all representing a specific color. 
 * @param {string} colorId - Unique's color ID, same as previewColor.id.
 * @returns {JSX.Element} A preview of a single color inside a palette.
 * 
 * @alias Components/ColorPreview
 */
export const ColorPreview = ({ previewColor, colorId }) => {
    
    return (
        <div className="palette__color-preview" data-color={previewColor} style={{backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})`}}>

        </div>
    );
};

export default ColorPreview;