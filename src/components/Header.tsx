import { memo } from "react";

type Props = {
    children: React.ReactNode;
};

export const Header = ({ children }: Props) => {
    return (
        <div id="editor-header" className="editor-header">
            {children}
        </div>
    );
};

export default memo(Header);