import Slider from '@mui/material/Slider';
import CopyIcon from '../icons/CopyIcon';
import { useLanguage } from '../../contexts/LanguageProvider';
import { useMemo } from 'react';

type Props = {
    value: number;
    onChange: (channel: 'red' | 'green' | 'blue', newValue: number) => void;
    labelInput: string;
    idInput: string;
    idSlider: string;
    labelSlider: string;
    channel: 'red' | 'green' | 'blue';
};

export default function SliderWithField({
    value,
    onChange,
    labelInput,
    idInput,
    idSlider,
    labelSlider,
    channel,
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

        onChange(channel, parseInt(newValue));

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
                min={0}
                max={255}
                value={value}
                disableSwap
                onChange={(e, newValue) => onChange(channel, newValue)}
            />
            <label className='sr-only text-on-background' htmlFor={idInput}>
                {labelInput}
            </label>
            <div className='flex bg-field-background rounded-sm items-center p-2 w-20 ml-auto'>
                <input
                    type="text"
                    id={idInput}
                    className='text-field-on-background w-full focus:outline-none text-sm'
                    maxLength={3}
                    value={value}
                    onChange={handleChangeInput}
                />
                <CopyIcon
                    color='var(--field-on-background)'
                    tabIndex={0}
                    focusable
                    role='button'
                    aria-label={i18n.t('copyFieldLabel', { color: i18n.t(`${channel}.female`) })}
                    onClick={async () => {
                        navigator.clipboard.writeText(value.toString());
                    }}
                />
            </div>
        </div>

    );
}