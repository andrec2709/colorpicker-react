import { useColor } from "../../contexts/ColorProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import CopyIcon from "../icons/CopyIcon";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    idInput: string;
    label: string;
};

export default function HexField({
    idInput,
    label,
    ...props
}: Props) {

    const { i18n } = useLanguage();

    return (
        <div className="flex items-center justify-end ml-auto">
            <label htmlFor={idInput} className="text-on-background sr-only">{label}</label>
            <div className='flex bg-field-background rounded-sm items-center p-2 w-25'>
                <input
                    type="text"
                    id={idInput}
                    className='text-field-on-background w-full focus:outline-none text-sm'
                    maxLength={7}
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