import { blue } from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import BackgroundIcon from '../icons/BackgroundIcon';
import { useColor } from '../../contexts/ColorProvider';
import TextIcon from '../icons/TextIcon';
import AddIcon from '../icons/AddIcon';
import i18n from '../../domain/i18n/translations';

export default function Colorpicker() {
    const { selection, setSelection } = useColor();

    return (
        <div>
            <div className='flex gap-x-2'>
                <BackgroundIcon
                    color={selection === 'background' ? 'var(--icon-active)' : 'var(--icon-inactive)'}
                    className='cursor-pointer'
                    size={28}
                    onClick={() => setSelection('background')}
                    role='button'
                    tabIndex={0}
                    focusable
                    aria-label={i18n.t('selectBackgroundLabel')}
                />
                <TextIcon
                    color={selection === 'text' ? 'var(--icon-active)' : 'var(--icon-inactive)'}
                    className='cursor-pointer'
                    focusable
                    tabIndex={0}
                    role='button'
                    aria-label={i18n.t('selectForegroundLabel')}
                    onClick={() => setSelection('text')}
                />
                <AddIcon
                    onClick={() => { }}
                    tabIndex={0}
                    focusable
                    aria-label={i18n.t('addColorLabel')}
                    role='button'
                    className='cursor-pointer'
                    size={28}
                />
            </div>

            

        </div >
    );
}