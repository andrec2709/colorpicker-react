import { blue } from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import BackgroundIcon from '../icons/BackgroundIcon';
import { useColor } from '../../contexts/ColorProvider';
import TextIcon from '../icons/TextIcon';
import AddIcon from '../icons/AddIcon';
import i18n from '../../domain/i18n/translations';
import CopyIcon from '../icons/CopyIcon';

export default function Colorpicker() {
    const { selection, setSelection } = useColor();

    return (
        <div className='flex flex-col gap-y-5'>
            <div className='flex gap-x-2 mt-2'>
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

            <div>
                <div className='flex items-center'>
                    <Slider
                        valueLabelDisplay='auto'
                        sx={{
                            width: '60%',
                            color: 'var(--slider-color)',
                        }}
                        min={0}
                        max={255}
                    />
                    <label
                        className='flex bg-field-background rounded-sm items-center p-2 w-[30%] ml-auto'
                    >
                        <input
                            type="text"
                            className='text-field-on-background w-full'
                        />
                        <CopyIcon color='var(--field-on-background)' />
                    </label>
                </div>
            </div>

        </div >
    );
}