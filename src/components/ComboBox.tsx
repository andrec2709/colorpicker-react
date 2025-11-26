import { useState } from "react";
import ArrowIcon from '../assets/arrow2.svg';

type Props = {
    value: any;
    options: any[];
    id: string;
    onClick: (e: React.MouseEvent<HTMLOptionElement>) => void;
};

export const ComboBox = ({ value, options, id, onClick }: Props) => {

    const listItems = options.map(option => <option className="combobox__list-item" value={option} onClick={onClick} key={option}>{option}</option>);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="combobox" id={id}>
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
    );
};

export default ComboBox;