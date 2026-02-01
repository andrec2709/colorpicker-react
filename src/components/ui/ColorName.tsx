import { colornames } from 'color-name-list';
import nearestColor from 'nearest-color';
import { useColor } from '../../contexts/ColorProvider';

export default function ColorName() {
    const { hex } = useColor();

    const colors = colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
    const nearest = nearestColor.from(colors);


    return (
        <p
            className='text-on-background text-center w-full text-xl font-bold mb-2'
        >
            {nearest(hex)?.name}
        </p>
    );
}