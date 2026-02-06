import type { RGB } from "./types";
import { colornames } from "color-name-list";
import nearestColor from "nearest-color";

export const COLORS = colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});

export const NEAREST_COLOR = nearestColor.from(COLORS);

export function rgbToHex(rgb: RGB) {
    const [r, g, b] = rgb;

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hexToRgb(hex: string): RGB {
    const value = hex.replace('#', '');
    let r = parseInt(value.substring(0, 2), 16);
    let g = parseInt(value.substring(2, 4), 16);
    let b = parseInt(value.substring(4, 6), 16);

    r = isNaN(r) ? 0 : r;
    g = isNaN(g) ? 0 : g;
    b = isNaN(b) ? 0 : b;

    return [r, g, b];
}

export const calculateLuminance = (color: RGB) => {
    let linearRed = color[0] / 255;
    let linearGreen = color[1] / 255;
    let linearBlue = color[2] / 255;

    linearRed = linearRed <= 0.03928 ? linearRed / 12.92 : ((linearRed + 0.055) / 1.055) ** 2.4;
    linearGreen = linearGreen <= 0.03928 ? linearGreen / 12.92 : ((linearGreen + 0.055) / 1.055) ** 2.4;
    linearBlue = linearBlue <= 0.03928 ? linearBlue / 12.92 : ((linearBlue + 0.055) / 1.055) ** 2.4;

    const luminance = (0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue) + 0.05;

    return luminance;

};

export const calculateLuminanceRatio = (color1: RGB, color2: RGB) => {
    const luminanceColor1 = calculateLuminance(color1);
    const luminanceColor2 = calculateLuminance(color2);

    if (luminanceColor1 > luminanceColor2) {
        return luminanceColor1 / luminanceColor2;
    }

    return luminanceColor2 / luminanceColor1;
};

export const randomRGB = (): RGB => {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    return [r, g, b];
}