import { useState } from "react";

    // {
    //     "name": "Palette 2",
    //     "id": "dhW23",
    //     "colors": [
    //         [0, 0, 0],
    //         [255, 255, 255],
    //         [255, 0, 0],
    //         [0, 255, 0],
    //         [0, 0, 255]
    //     ]
    // },
    // {
    //     "name": "Palette 3",
    //     "id": "c2nIa",
    //     "colors": [
    //         [0, 0, 0],
    //         [255, 255, 255],
    //         [255, 0, 0],
    //         [0, 255, 0],
    //         [0, 0, 255]
    //     ]
    // }


export const ColorPreview = ({ previewColor, colorId }) => {
    
    const [color, setColor] = useState(previewColor);
    
    return (
        <div className="color-preview" data-color={color} style={{backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`}}>

        </div>
    );
};

export default ColorPreview;