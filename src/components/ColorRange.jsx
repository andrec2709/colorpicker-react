import Slider from "./Slider";

export const ColorRange = ({
  id, // id for the Slider
  mainId, // id for the container that wraps the label and the slider
  labelId, // id for the label 
  value, 
  onChange, 
  color, // color this slider belongs to (red, green, blue)
  textLabel, 
  min = 0, 
  max = 255
}) => {
  return (
    <div className="slider-container" id={mainId}>
      <label id={labelId} htmlFor={id} className="slider-container__label">{textLabel}</label>
      <Slider onChange={onChange} id={id} color={color} value={value} min={min} max={max} labelledBy={labelId} />
    </div>
  );
};

export default ColorRange;
