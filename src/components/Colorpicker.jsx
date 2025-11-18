
/**
 * Wrapper component for sliders, fields, buttons that are part of the Colorpicker main view.
 * @function
 * @param {any[]} children - all components to be wrapped.
 * @param {string} id - ID for the wrapper.
 * @returns {JSX.Element} 
 * 
 * @alias Components/Colorpicker
 */
export const Colorpicker = ({ children, id }) => {
    return (
        <div id={id}>
            {children}
        </div>
    );
};

export default Colorpicker;