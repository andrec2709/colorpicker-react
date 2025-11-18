import Slider from "./Slider";

/**
 * Wrapper component for a {@link Components/Slider | Slider} component preceded by a label.
 * @function
 * @param {string} sliderId - ID for the slider.
 * @param {string} mainId - ID for the container/wrapper.
 * @param {string} labelId - ID for the label.
 * @param {number|string} value - the value passed to the slider.
 * @param {function} onChange - callback function.
 * @param {string} color - the color this slider is displaying.
 * @param {string} textLabel - text content of the label.
 * @param {number} [min = 0] - minimum allowed value for the slider.
 * @param {number} [max = 255] - maximum allowed value for the slider.
 * 
 * @returns {JSX.Element} A labelled slider component.
 * @alias Components/ColorRange
 */
export const ColorRange = ({
  sliderId,
  mainId,
  labelId,
  value,
  onChange,
  color,
  textLabel,
  min = 0,
  max = 255
}) => {
  return (
    <div className="slider-container" id={mainId}>
      <label
        id={labelId}
        htmlFor={sliderId}
        className="slider-container__label"
      >
        {textLabel}
      </label>
      <Slider
        onChange={onChange}
        id={sliderId}
        color={color}
        value={value}
        min={min}
        max={max}
        labelledBy={labelId}
      />
    </div>
  );
};

export default ColorRange;
