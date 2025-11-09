export const Slider = ({ id, mainId, value, onChange, color, textLabel, min = 0, max = 255 }) => {
  return (
    <div className="slider-container" id={mainId}>
      <label htmlFor={id}>{textLabel}</label>
      <input type="range" id={id} value={value} onChange={onChange} data-color={color} min={min} max={max} />
    </div>
  );
};

export default Slider;
