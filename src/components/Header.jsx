import { memo } from "react";

/**
 * Wrapper for the header items of the {@link Components/Editor | Editor} component.
 * @function
 * @param {any[]} children - child components to be wrapped.
 * @returns {JSX.Element}
 * @alias Components/Header
 */
export const Header = ({ children }) => {
    return (
        <div id="editor-header" className="editor-header">
            {children}
        </div>
    );
};

export default memo(Header);