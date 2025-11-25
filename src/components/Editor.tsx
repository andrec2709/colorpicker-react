import { memo } from "react";

type Props = {
    children: React.ReactNode;
};

export const Editor = ({ children }: Props) => {
    return (
        <div id="editor" className="editor">
            {children}
        </div>
    );
};

export default memo(Editor);