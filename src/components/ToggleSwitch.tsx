import React, { useEffect, useRef, useState } from "react";

type Props = {
    id: string;
    labelId: string;
    labelText: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ToggleSwitch = ({ id, labelId, labelText, onChange }: Props) => {

    return (
        <label htmlFor={id} id={labelId} className="switch__container">
            <input
                type="checkbox"
                className="switch__input"
                name={id}
                id={id}
                aria-labelledby={labelId}
                onChange={onChange}
            />
            <span className="switch__label">{labelText}</span>
            <div className="switch" aria-hidden>
                <span className="switch__slider"></span>
            </div>
        </label>
    );
};


export default ToggleSwitch;