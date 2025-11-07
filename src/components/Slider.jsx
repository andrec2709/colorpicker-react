import LabeledComponent from "./LabeledComponent";
import Field from "./Field";

export default function Slider({ label, value, onChange, color, id, min = 0, max = 255 }) {

  return (
    <LabeledComponent id={id} label={label}>
      <input type="range" value={value} onChange={onChange} data-color={color} min={min} max={max} />
      <Field value={value} onChange={onChange} color={color} />
    </LabeledComponent>
  );
}
