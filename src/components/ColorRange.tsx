import Slider from "./Slider.jsx";

type Props = {
  sliderId: string;
  mainId: string;
  labelId: string;
  value: number;
  onChange: (value: string | number, color: string, modifierAllowed?: boolean) => void;
  color: string;
  textLabel: string;
  min: number;
  max: number;
};

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
}: Props) => {
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
