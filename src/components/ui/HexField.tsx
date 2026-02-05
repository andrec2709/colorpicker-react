import { useColorActions, useColorStateContext } from "../../contexts/ColorProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import { hexToRgb } from "../../domain/color/utils";
import CopyIcon from "../icons/CopyIcon";
import ButtonWithIcon from "./ButtonWithIcon";
import ThemedInput from "./ThemedInput";

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
    const { setActiveColor, setHex } = useColorActions();
    const { hex } = useColorStateContext();


    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const value = e.target.value || '#'
        setHex(value);
        if (value.length === 7) setActiveColor(hexToRgb(value));
    };

    const handleHexPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();

        let pasted = await navigator.clipboard.readText();

        if (!pasted.startsWith('#')) pasted = '#'.concat(pasted);

        setHex(pasted.substring(0, 7));

    };

    const commitHex = () => {
        const rgb = hexToRgb(hex);
        setActiveColor(rgb);
    }

    return (
        <div className="flex items-center justify-end ml-auto">
            <div className='flex bg-field rounded-sm items-center p-2 w-25'>
                <ThemedInput
                    type="text"
                    id={idInput}
                    className={'text-on-field w-full focus:outline-none text-sm' + ' ' + className}
                    maxLength={7}
                    onChange={handleHexChange}
                    onBlur={commitHex}
                    onKeyDown={e => e.key === 'Enter' && commitHex()}
                    onPaste={handleHexPaste}
                    label={label}
                    {...props}
                />
                <ButtonWithIcon
                    Icon={CopyIcon}
                    onClick={async () => {
                        if (props.value) {
                            navigator.clipboard.writeText(props.value.toString());
                        }
                    }}
                    className="cursor-pointer active:bg-on-field/20 hover:bg-on-field/10 transition-[background-color] duration-150 rounded-4xl"
                    aria-label={i18n.t('copyFieldLabel', { color: 'hex' })}
                    iconProps={{
                        color: 'var(--on-field)',
                        "aria-label": i18n.t('copyFieldLabel', { color: 'hex' }),
                        size: 20,
                    }}
                />
            </div>
        </div>

    );
}