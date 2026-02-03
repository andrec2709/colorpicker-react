import { Select, type SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { memo, type LabelHTMLAttributes } from "react";

type Props = SelectProps & {
    description?: string;
    labelProps?: Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>;
};

export const SettingWithSelect = memo(function SettingWithSelect({
    description = '',
    labelProps,
    ...selectProps
}: Props) {
    return (
        <label 
        {...labelProps}
        className={'flex items-center text-on-background-container text-sm gap-x-4' + ' ' + labelProps?.className}
        htmlFor={selectProps.id ?? ''}
        >
            {description}
            <Select 
                {...selectProps}
                style={{
                    backgroundColor: 'var(--select-background)',
                    color: 'var(--select-on-background)',
                    borderColor: 'var(--select-border)',
                    width: '40%',
                    marginLeft: 'auto',
                    ...selectProps.style,
                }}
                styles={{
                    ...selectProps.styles,
                    popup: {
                        list: {
                            backgroundColor: 'var(--select-background)',
                            color: 'var(--select-on-background)',
                            ...selectProps.styles?.popup?.list
                        },
                        listItem: {
                            backgroundColor: 'var(--select-background)',
                            color: 'var(--select-on-background)',
                            ...selectProps.styles?.popup?.listItem
                        },
                        root: {
                            backgroundColor: 'var(--select-background)',
                            ...selectProps.styles?.popup?.root
                        },
                    },
                }}
                className={'hover:border-select-border-hover! active:border-select-border-active!' + ' ' + selectProps.className}
            />
        </label>
    );
});

export default SettingWithSelect;