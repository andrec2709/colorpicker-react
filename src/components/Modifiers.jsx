
export const Modifiers = ({ children, ...props }) => {
    return (
        <div className={props.className}>
            {children}
        </div>
    );
};

export default Modifiers;