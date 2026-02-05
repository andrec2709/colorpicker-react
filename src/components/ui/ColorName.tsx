import { useColorStateContext } from '../../contexts/ColorProvider';
import { memo, useCallback, useMemo } from 'react';
import { NEAREST_COLOR } from '../../domain/color/utils';

export const ColorName = memo(function ColorName() {
    const { activeColor } = useColorStateContext();

    return (
        <p
            className='text-on-background text-center w-full text-xl font-bold mb-2'
        >
            {NEAREST_COLOR({ r: activeColor[0], g: activeColor[1], b: activeColor[2] })?.name}
        </p>
    );
});

export default ColorName;