import Slider from "./Slider";
import Field from "./Field";

export const Color = ({ children, id }) => {
  return (
    <div className="color-container" id={id}>
        {children}
    </div>
  );
};
