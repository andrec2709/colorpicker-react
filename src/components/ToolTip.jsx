import { useToolTip } from "../contexts/ToolTipContext";

/**
 * A tooltip component.
 * @function
 * @param {string} [className = "tooltip"] - the classes for the tooltip.
 * @param {string} id - Unique ID for the tooltip.
 * @returns {JSX.Element}
 * @alias Components/ToolTip
 */
export const ToolTip = ({ className = ['tooltip'], id }) => {
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
};

export default ToolTip;