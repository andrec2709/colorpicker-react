export default function LabeledComponent({ label, id, children }) {
  return (
    <div className='labeled-container' id={id}>
      <span>{label}</span>
      {children}
    </div>
  );
}