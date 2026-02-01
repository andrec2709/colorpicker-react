import { useColor } from '../../contexts/ColorProvider';
import { memo, useCallback, useMemo } from 'react';
import { NEAREST_COLOR } from '../../domain/color/utils';

export const ColorName = memo(function () {
    const { hex } = useColor();

    return (
        <p
            className='text-on-background text-center w-full text-xl font-bold mb-2'
        >
            {NEAREST_COLOR(hex)?.name}
        </p>
    );
});

export default ColorName;