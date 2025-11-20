import { memo } from "react";

/**
 * Wrapper component for the {@link Components/Palette | Palette} components. Represents all the user's stored palettes.
 * @function
 * @param {any[]} children - an array of {@link Components/Palette | Palette} components.
 * @param {Object} style - an Object representing the style of the wrapper component. 
 * @returns {JSX.Element} A wrapper with Palette components inside.
 * @alias Components/PalettesListView
 */
export const PalettesListView = ({ children, style }) => {

    return (
        <div id="palettes-list" className="palettes-container" style={style}>
            {children}
        </div>
    );
};

export default memo(PalettesListView);