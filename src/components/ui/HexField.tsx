import { useColor } from "../../contexts/ColorProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import { hexToRgb } from "../../domain/color/utils";
import CopyIcon from "../icons/CopyIcon";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onBlur' | 'onKeyDown' | 'maxLength' | 'className' | 'id' | 'type' | 'onPaste'>
    & {
        idInput: string;
        label: string;
        className?: string;
    };

export default function HexField({
    idInput,
    label,
    className,
    ...props
}: Props) {

    const { i18n } = useLanguage();
    const { setActiveColor, setHex, hex } = useColor();


    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const value = e.target.value || '#'
        setHex(value);
        if (value.length === 7) setActiveColor(hexToRgb(value));
    };

    const handleHexPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();

        let pasted = e.clipboardData.getData('plain/text').toLowerCase();

        if (!pasted.startsWith('#')) pasted = '#'.concat(pasted);

        setHex(pasted.substring(0, 7));

    };

    const commitHex = () => {
        const rgb = hexToRgb(hex);
        setActiveColor(rgb);
    }

    return (
        <div className="flex items-center justify-end ml-auto">
            <label htmlFor={idInput} className="text-on-background sr-only">{label}</label>
            <div className='flex bg-field-background rounded-sm items-center p-2 w-25'>
                <input
                    type="text"
                    id={idInput}
                    className={'text-field-on-background w-full focus:outline-none text-sm' + ' ' + className}
                    maxLength={7}
                    onChange={handleHexChange}
                    onBlur={commitHex}
                    onKeyDown={e => e.key === 'Enter' && commitHex()}
                    onPaste={handleHexPaste}
                    {...props}
                />
                <CopyIcon
                    color='var(--field-on-background)'
                    tabIndex={0}
                    focusable
                    role='button'
                    aria-label={i18n.t('copyFieldLabel', { color: 'hex' })}
                    onClick={async () => {
                        if (props.value) {
                            navigator.clipboard.writeText(props.value.toString());
                        }
                    }}
                />
            </div>
        </div>

    );
}