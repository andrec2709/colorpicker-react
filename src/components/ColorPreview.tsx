import type { Color } from "../types/palette.ts";

type Props = {
    previewColor: Color;
    colorId: string;
};

export const ColorPreview = ({ previewColor, colorId }: Props) => {
    
    return (
        <div className="palette__color-preview" data-color={previewColor} style={{backgroundColor: `rgb(${previewColor.r},${previewColor.g},${previewColor.b})`}}>

        </div>
    );
};

export default ColorPreview;