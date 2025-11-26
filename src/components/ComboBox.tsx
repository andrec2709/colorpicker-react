import { useState } from "react";
import ArrowIcon from '../assets/arrow2.svg';

type Props = {
    value: any;
    options: any[];
    id: string;
    labelId: string;
    labelText: string;
    onClick: (e: React.MouseEvent<HTMLOptionElement>) => void;
};

export const ComboBox = ({ value, options, id, labelId, labelText, onClick }: Props) => {

    const listItems = options.map(option => <option className="combobox__list-item" value={option} onClick={onClick} key={option} tabIndex={0} role="button">{option}</option>);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <label id={labelId} htmlFor={id} className="combobox__container">
            <span className="combobox__label">{labelText}</span>
            <div className="combobox" id={id} aria-labelledby={labelId} role="combobox">
                <div
                    className="combobox__selection"
                    onClick={() => setIsOpen(!isOpen)}
                    tabIndex={0}
                    role="button"
                >{value}
                    <img src={ArrowIcon} className={`combobox__icon ${isOpen ? 'opened' : ''}`} alt="arrow displaying if the combobox is opened or closed." />
                </div>
                <div className="combobox__list" style={{ display: isOpen ? 'block' : 'none' }}>
                    {listItems}
                </div>
            </div>
        </label>
    );
};

export default ComboBox;