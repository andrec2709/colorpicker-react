import { useEffect, useRef } from "react";
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
  const toolTipRef = useRef(null);

  // if (visible) {
  //   className.push('tooltip--visible');
  // }

  switch (type) {
    case 'ok':
      className.push('tooltip--success');
      break;
    case 'fail':
      className.push('tooltip--fail');
      break;
  }

  useEffect(() => {
    const el = toolTipRef.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    const height = rect.height;

    let timeout;

    if (visible) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      
      timeout = setTimeout(() => {
        el.style.transform = `translateY(-${height}px)`;
      }, 300);

    } else {
      el.style.transform = `translateY(${height}px)`;
      el.style.opacity = '0';
      timeout = setTimeout(() => {
        el.style.visibility = 'hidden';
      }, 300);

    }

    return () => {clearTimeout(timeout)};

  }, [visible]);

  return (
    <div
      className={className.join(' ')}
      id={id}
      ref={toolTipRef}

    >
      {message}
    </div>
  );
};

export default ToolTip;