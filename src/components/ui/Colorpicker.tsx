import { blue } from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import BackgroundIcon from '../icons/BackgroundIcon';
import { useColor } from '../../contexts/ColorProvider';
import TextIcon from '../icons/TextIcon';
import AddIcon from '../icons/AddIcon';
import CopyIcon from '../icons/CopyIcon';
import SettingsIcon from '../icons/SettingsIcon';
import SliderWithField from './SliderWithField';
import { useLanguage } from '../../contexts/LanguageProvider';
import HexField from './HexField';
import { hexToRgb, rgbToHex } from '../../domain/color/utils';
import type { RGB } from '../../domain/color/types';
import { useCallback } from 'react';

export default function Colorpicker() {
    const { selection, setSelection, activeColor, setActiveColor, hex, setHex } = useColor();
    const { i18n } = useLanguage();

    const handleRgbChange = useCallback((channel: 'red' | 'green' | 'blue', newValue: number) => {
        let [r, g, b] = activeColor;

        switch (channel) {
            case 'red': {
                r = newValue;
                break;
            };
            case 'green': {
                g = newValue;
                break;
            };
            case 'blue': {
                b = newValue;
                break;
            };
            default: {
                throw new Error('invalid channel');
            }
        }
        const newColor: RGB = [r, g, b];

        setHex(rgbToHex(newColor));
        setActiveColor(newColor);
    }, [activeColor]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const value = e.target.value || '#'
        setHex(value);
        if (value.length === 7) setActiveColor(hexToRgb(value));
    };

    const commitHex = () => {
        const rgb = hexToRgb(hex);
        setActiveColor(rgb);
    }

    return (
        <div className='flex flex-col gap-y-5 w-full'>
            <div className='flex gap-x-2 mt-5'>
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
                <SettingsIcon
                    className='fill-icon-inactive active:fill-icon-active cursor-pointer ml-auto'
                    onClick={() => { }}
                    tabIndex={0}
                    focusable
                    aria-label={i18n.t('openSettingsLabel')}
                    role='button'
                />
            </div>

            <div className='flex flex-col gap-y-1'>
                <SliderWithField
                    value={activeColor[0]}
                    channel='red'
                    idInput='red-field'
                    idSlider='red-slider'
                    labelSlider='R'
                    labelInput='red field'
                    onChange={handleRgbChange}
                />
                <SliderWithField
                    value={activeColor[1]}
                    channel='green'
                    idInput='green-field'
                    idSlider='green-slider'
                    labelSlider='G'
                    labelInput='green field'
                    onChange={handleRgbChange}
                />
                <SliderWithField
                    value={activeColor[2]}
                    channel='blue'
                    idInput='blue-field'
                    idSlider='blue-slider'
                    labelSlider='B'
                    labelInput='blue field'
                    onChange={handleRgbChange}
                />
                <HexField
                    value={hex}
                    idInput='hex-field'
                    label='HEX'
                    onChange={handleHexChange}
                    onBlur={commitHex}
                    onKeyDown={e => e.key === 'Enter' && commitHex()}
                />
            </div>

        </div >
    );
}