import { memo, useMemo } from "react";
import { useColor } from "../../contexts/ColorProvider";
import { calculateLuminanceRatio } from "../../domain/color/utils";
import { useLanguage } from "../../contexts/LanguageProvider";

export const ContrastRatio = memo(function ContrastRatio() {
    const { bgColor, txtColor } = useColor();
    const { i18n } = useLanguage();

    const contrast = calculateLuminanceRatio(bgColor, txtColor);
    
    const color = useMemo(() => {
        if (contrast < 4.5) return 'text-contrast-ratio-bad';
        else if (contrast < 7) return 'text-contrast-ratio-warning';
        else return 'text-contrast-ratio-good';
    }, [contrast]);

    return (
        <p className={`${color}`}>{`${i18n.t('contrast')} ${contrast.toFixed(2)}`}</p>
    );
});

export default ContrastRatio;