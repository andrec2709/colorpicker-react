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


export const ColorPreview = ({ previewColor }) => {
    const [color, setColor] = useState(`rgb(${previewColor[0]},${previewColor[1]},${previewColor[2]})`);

    return (
        <div className="color-preview" data-color={color} style={{backgroundColor: color}}>

        </div>
    );
};

export default ColorPreview;