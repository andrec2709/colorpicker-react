import Slider from "./Slider";

export const ColorRange = ({ id, mainId, value, onChange, color, textLabel, labelId, min = 0, max = 255 }) => {
  return (
    <div className="slider-container" id={mainId}>
      <label id={labelId} htmlFor={id}>{textLabel}</label>
      <Slider onChange={onChange} id={id} color={color} value={value} min={min} max={max} labelledBy={labelId}/>
    </div>
  );
};

export default ColorRange;
