import { memo } from "react";
import { useLanguage } from "../../contexts/LanguageProvider";

export const Credits = memo(
    function Credits() {
        const { i18n } = useLanguage();

        return (
            <div className="flex flex-col items-center mt-5">
                <p className="text-on-background">{i18n.t('madeBy')}</p>
                <a
                    href="https://andrecarvalho.io"
                    target="_blank"
                    className="text-link underline"
                >
                    andrecarvalho.io
                </a>
            </div>
        );
    }
);

export default Credits;