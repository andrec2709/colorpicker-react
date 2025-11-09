import { useState } from "react";

export const ColorItem = ({ previewColor }) => {
    const [color, setColor] = useState(`rgb(${previewColor[0]}, ${previewColor[1]}, ${previewColor[2]})`);

    return (
        <div className="color-item" data-color={color} style={{backgroundColor: color}}>

        </div>
    );
};