// import { Slider } from 'antd';
import Slider from '@mui/material/Slider';
import CopyIcon from '../icons/CopyIcon';
import { useLanguage } from '../../contexts/LanguageProvider';
import { useMemo } from 'react';
import { clamp } from '../../utils';
import ButtonWithIcon from './ButtonWithIcon';
import ThemedInput from './ThemedInput';

type Props = {
    value: number;
    onChange: (channel: 'red' | 'green' | 'blue', newValue: number) => void;
    labelInput: string;
    idInput: string;
    idSlider: string;
    labelSlider: string;
    channel: 'red' | 'green' | 'blue';
    min?: number;
    max?:number;
};

export default function SliderWithField({
    value,
    onChange,
    labelInput,
    idInput,
    idSlider,
    labelSlider,
    channel,
    min = 0,
    max = 255,
}: Props) {

    const { i18n } = useLanguage();

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const newValue = e.currentTarget.value;

        if (newValue === '') {
            onChange(channel, 0);
            return;
        }

        if (isNaN(parseInt(newValue))) {
            return;
        }

        const clamped = clamp(min, max, parseInt(newValue));

        onChange(channel, clamped);

    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const pasted = parseInt(e.clipboardData.getData('text/plain'));

        if (isNaN(pasted)) return;

        const clamped = clamp(min, max, pasted);

        onChange(channel, clamped);

    };

    return (
        <div className='flex items-center'>
            <label id={idSlider} className='text-on-background mr-5'>
                {labelSlider}
            </label>
            <Slider
                sx={useMemo(() => ({
                    width: '50%',
                    color: 'var(--slider-color)',
                }), [])}
                aria-labelledby={idSlider}
                min={min}
                max={max}
                value={value}
                disableSwap
                onChange={(e, newValue) => onChange(channel, newValue)}
            />
            <div className='flex bg-field rounded-sm items-center p-2 w-20 ml-auto'>
                <ThemedInput 
                    className='text-on-field w-full focus:outline-none text-sm'
                    type='text'
                    id={idInput}
                    maxLength={3}
                    value={value}
                    onChange={handleChangeInput}
                    onPaste={handlePaste}
                    label={labelInput}
                />
                <ButtonWithIcon 
                    Icon={CopyIcon}
                    onClick={async () => {
                        navigator.clipboard.writeText(value.toString());
                    }}
                    className='cursor-pointer active:bg-on-field/20 hover:bg-on-field/10 transition-[background-color] duration-150 rounded-4xl'
                    aria-label={i18n.t('copyFieldLabel', { color: i18n.t(`${channel}.female`) })}
                    iconProps={{
                        color: 'var(--on-field)',
                        size: 20,
                        "aria-label": i18n.t('copyFieldLabel', { color: i18n.t(`${channel}.female`) }),
                    }}

                />
            </div>
        </div>

    );
}