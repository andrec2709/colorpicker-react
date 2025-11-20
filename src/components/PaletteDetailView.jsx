import { memo } from "react";

/**
 * Wrapper for the currently selected palette's colors, which are individually represented by {@link Components/ColorItem | ColorItem}.
 * @function
 * @param {any[]} children - an array of {@link Components/ColorItem | ColorItem}'s.
 * @param {Object} style - an Object representing the style of the wrapper.
 * @returns {JSX.Element} A component with wrapped ColorItem's.
 * @alias Components/PaletteDetailView
 */
export const PaletteDetailView = ({ children, style, ref }) => {

    return (
        <div
            id="palette-detail"
            className="palette-detail"
            style={style}
            onClick={e => e.target.focus()}
            ref={ref}
        >
            {children}
        </div>
    );
};

export default memo(PaletteDetailView);