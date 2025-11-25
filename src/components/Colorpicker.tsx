
type Props = {
    children: React.ReactNode;
    id: string;
};

export const Colorpicker = ({ children, id }: Props) => {
    return (
        <div id={id}>
            {children}
        </div>
    );
};

export default Colorpicker;