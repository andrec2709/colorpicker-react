import { memo } from "react";

/**
 * Wrapper component for the 'modifiers' section of the application.
 * @function
 * @param {any[]} children - child components to be wrapped.
 * @param {string} props.className - classes for the wrapper.
 * @returns {JSX.Element} wrapped modifiers.
 * @alias Components/Modifiers
 */
export const Modifiers = ({ children, ...props }) => {
    return (
        <div className={props.className}>
            {children}
        </div>
    );
};

export default memo(Modifiers);