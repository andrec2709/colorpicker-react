
export const ColorPreview = ({ previewColor, colorId }) => {
    
    return (
        <div className="palette__color-preview" data-color={previewColor} style={{backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})`}}>

        </div>
    );
};

export default ColorPreview;