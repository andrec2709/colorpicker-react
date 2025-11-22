import { memo, useEffect, useRef } from "react";
import { useToolTip } from "../contexts/ToolTipContext.jsx";


type Props = {
  className?: string[];
  id: string;
};

export const ToolTip = ({ className = ['tooltip'], id }: Props) => {
  const { message, visible, type } = useToolTip();
  const toolTipRef = useRef<HTMLDivElement>(null);
  const classes = [...className];
  
  switch (type) {
    case 'ok':
      classes.push('tooltip--success');
      break;
    case 'fail':
      classes.push('tooltip--fail');
      break;
  }

  useEffect(() => {
    const el = toolTipRef.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    const height = rect.height;

    let timeout: ReturnType<typeof setTimeout>;

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
      className={classes.join(' ')}
      id={id}
      ref={toolTipRef}

    >
      {message}
    </div>
  );
};

export default memo(ToolTip);