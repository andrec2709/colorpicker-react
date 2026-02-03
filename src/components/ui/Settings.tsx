import { memo, useEffect, useRef, useState } from "react";
import { Dropdown } from 'antd';
import { Select, Space } from 'antd';
import type { MenuProps } from 'antd';
import CloseIcon from "../icons/CloseIcon";
import ButtonWithIcon from "./ButtonWithIcon";
import SettingWithSelect from "./SettingWithSelect";
import { useSettings } from "../../contexts/SettingsProvider";
import { useLanguage } from "../../contexts/LanguageProvider";
import { clamp } from "../../utils";

export const Settings = memo(function Settings() {
    const { addColorToEnd, setAddColorToEnd, isSettingsVisible, setIsSettingsVisible } = useSettings();
    const { i18n } = useLanguage();

    const settingWindowRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(true);

    const handleColorToEndChange = (value: string) => {
        if (value === 'bottom') {
            setAddColorToEnd(true);
        } else {
            setAddColorToEnd(false);
        }
    };

    const handleClickOut = (e: PointerEvent) => {
        const settingWin = settingWindowRef.current;
        if (!settingWin) return;

        const rect = settingWin.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        const x1 = rect.left;
        const x2 = rect.right;
        const y2 = rect.bottom;
        const y1 = rect.top;

        const isXBounds = clamp(x1, x2, clientX) === clientX;
        const isYBounds = clamp(y1, y2, clientY) === clientY;

        if (!isXBounds || !isYBounds) {
            setIsSettingsVisible(false);
        }



    };

    useEffect(() => {
        if (isSettingsVisible) {
            if (!loading) {
                window.addEventListener('click', handleClickOut);
            }
            setLoading(false);
        } else {
            setLoading(true);
        }

        return () => {
            window.removeEventListener('click', handleClickOut);
        };
    }, [isSettingsVisible, loading]);

    return (
        <div
            className="absolute w-full h-full top-0 left-0 bg-background/90"
            hidden={!isSettingsVisible}
        >
            <div
                className="absolute w-[90%] max-w-150 aspect-square bg-background-container rounded-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                ref={settingWindowRef}
            >
                <nav className="flex p-2">
                    <ButtonWithIcon
                        Icon={CloseIcon}
                        className='cursor-pointer ml-auto active:bg-icon-active/20 hover:bg-icon-active/10 transition-[background-color] duration-150 p-1 rounded-4xl'
                        iconProps={{
                            className: 'fill-icon-active',
                        }}
                        onClick={() => setIsSettingsVisible(false)}
                    />
                </nav>
                <section
                    className="p-5"
                >
                    <SettingWithSelect
                        defaultValue={addColorToEnd ? i18n.t('bottom') : i18n.t('top')}
                        id="add-color-to-end-opt"
                        options={[
                            { value: 'top', label: i18n.t('top') },
                            { value: 'bottom', label: i18n.t('bottom') },
                        ]}
                        description="How to add colors to a palette."
                        onChange={handleColorToEndChange}
                    />
                </section>
            </div>
        </div>
    );
});

export default Settings;