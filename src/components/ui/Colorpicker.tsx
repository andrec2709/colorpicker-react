import { blue } from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import BackgroundIcon from '../icons/BackgroundIcon';
import { useColorActions, useColorStateContext } from '../../contexts/ColorProvider';
import TextIcon from '../icons/TextIcon';
import AddIcon from '../icons/AddIcon';
import CopyIcon from '../icons/CopyIcon';
import SettingsIcon from '../icons/SettingsIcon';
import SliderWithField from './SliderWithField';
import { useLanguage } from '../../contexts/LanguageProvider';
import HexField from './HexField';
import { hexToRgb, NEAREST_COLOR, rgbToHex } from '../../domain/color/utils';
import type { RGB } from '../../domain/color/types';
import { useCallback } from 'react';
import ContrastRatio from './ContrastRatio';
import { usePalette } from '../../contexts/PaletteProvider';
import useAddColor from '../../application/palette/useAddColor';
import ButtonWithIcon from './ButtonWithIcon';
import { useSettings } from '../../contexts/SettingsProvider';

export default function Colorpicker() {
    
    const { selection, activeColor, hex } = useColorStateContext();
    const { setSelection, setActiveColor, setHex } = useColorActions();
    const { selectedPaletteId } = usePalette();
    const { addColorToEnd, setIsSettingsVisible } = useSettings();
    const { i18n } = useLanguage();
    const addColor = useAddColor();

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

    const handleAddColor = async () => {
        if (!selectedPaletteId) return;

        const [r, g, b] = activeColor;
        const name = NEAREST_COLOR(hex)?.name ?? '';

        await addColor(selectedPaletteId, {
            r,
            g,
            b,
            name,
            hex
        }, addColorToEnd);
    };

    return (
        <div className='flex flex-col gap-y-5 w-full'>
            <div className='flex gap-x-2 mt-5'>
                <ButtonWithIcon
                    Icon={BackgroundIcon}
                    className='cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl'
                    onClick={() => setSelection('background')}
                    aria-label={i18n.t('selectBackgroundLabel')}
                    iconProps={{
                        color: selection === 'background' ? 'var(--icon-active)' : 'var(--icon-inactive)',
                        "aria-label": i18n.t('selectBackgroundLabel'),
                    }}
                />
                <ButtonWithIcon
                    Icon={TextIcon}
                    className='cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl'
                    onClick={() => setSelection('text')}
                    aria-label={i18n.t('selectForegroundLabel')}
                    iconProps={{
                        color: selection === 'text' ? 'var(--icon-active)' : 'var(--icon-inactive)',
                        "aria-label": i18n.t('selectForegroundLabel'),
                    }}
                />
                <ButtonWithIcon
                    Icon={AddIcon}
                    className='cursor-pointer active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl'
                    disabled={selectedPaletteId === null}
                    onClick={handleAddColor}
                    aria-label={i18n.t('addColorLabel')}
                    iconProps={{
                        color: selectedPaletteId !== null ? 'var(--icon-active)' : 'var(--icon-inactive)',
                        "aria-label": i18n.t('addColorLabel'),
                    }}
                />
                <ButtonWithIcon
                    Icon={SettingsIcon}
                    className='cursor-pointer ml-auto active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl'
                    onClick={() => setIsSettingsVisible(true)}
                    aria-label={i18n.t('openSettingsLabel')}
                    iconProps={{
                        className: 'fill-icon-active',
                        "aria-label": i18n.t('openSettingsLabel'),
                    }}
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
                <div className='flex items-center'>
                    <ContrastRatio />
                    <HexField
                        value={hex}
                        idInput='hex-field'
                        label='HEX'
                    />
                </div>
            </div>

        </div >
    );
}