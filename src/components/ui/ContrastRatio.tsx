import { memo, useMemo } from "react";
import { useColor } from "../../contexts/ColorProvider";
import { calculateLuminanceRatio } from "../../domain/color/utils";

export const ContrastRatio = memo(function () {
    const { bgColor, txtColor } = useColor();

    const contrast = calculateLuminanceRatio(bgColor, txtColor);
    
    const color = useMemo(() => {
        if (contrast < 4.5) return 'text-contrast-ratio-bad';
        else if (contrast < 7) return 'text-contrast-ratio-warning';
        else return 'text-contrast-ratio-good';
    }, [contrast]);

    return (
        <p className={`${color}`}>{`Contrast: ${contrast.toFixed(2)}`}</p>
    );
});

export default ContrastRatio;