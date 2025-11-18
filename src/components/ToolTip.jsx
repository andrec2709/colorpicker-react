import { useToolTip } from "../contexts/ToolTipContext";

export default function ToolTip({ className = ['tooltip'], id }) {
  const { message, visible, type } = useToolTip();

  if (!visible) {
    className.push('tooltip--hidden');
  }

  switch (type) {
    case 'ok':
      className.push('tooltip--success');
      break;
    case 'fail':
      className.push('tooltip--fail');
      break;
  }

  return (
    <div className={className.join(' ')} id={id}>
      {message}
    </div>
  );
}