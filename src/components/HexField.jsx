import LabeledComponent from "./LabeledComponent";
import Field from "./Field";

export default function HexField({ value, id, label, onChange }) {
  return (
    <LabeledComponent id={id} label={label}>
      <Field value={value} onChange={onChange} color='hex' />
    </LabeledComponent>
  );
}
