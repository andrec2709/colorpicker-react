import { useEffect, useState } from 'react'
import './App.css'

// Exercise:
// Make a simple colorpicker app.
// Read draft.md

function Slider({ id, value, onChange, min = 0, max = 255 }) {

  return <input
    type="range"
    id={id}
    className='custom-range'
    min={min}
    max={max}
    value={value}
    onChange={e => onChange(e, e.target.value, e.target.getAttribute('id'))}
  />;
}

function ColorField({ id, value, onChange, classInput = 'color-field', typeInput = 'number', maxLength,min = 0, max = 255 }) {
  async function handleClick() {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className='color-field-container'>
      <input
        type={typeInput}
        id={id}
        className={classInput}
        min={min}
        max={max}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e, e.target.value, e.target.getAttribute('id'))} />
      <button
        className='color-field-btn'
        onClick={handleClick}
      >
        📋
      </button>
    </div>
  );
}

function toHEX(r, g, b) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function ColorPickerApp() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [hex, setHex] = useState(toHEX(red, green, blue));
  useEffect(() => {

    const newColor = `rgb(${red}, ${green}, ${blue})`;
    document.documentElement.style.backgroundColor = newColor;

  }, [red, green, blue]);

  function handleChange(e, value, color) {

    if (!/^[0-9]{0,3}$/.test(value)) { return }

    else if (value < 0) { value = 0 }

    else if (value > 255) { value = 255 }

    value = parseInt(value);

    let nextRed = red;
    let nextGreen = green;
    let nextBlue = blue;

    switch (color) {
      case 'red':
        setRed(value);
        nextRed = value;
        break;
      case 'green':
        setGreen(value);
        nextGreen = value;
        break;
      case 'blue':
        setBlue(value);
        nextBlue = value;
        break;
      case 'red-field':
        setRed(value);
        nextRed = value;
        break;
      case 'green-field':
        setGreen(value);
        nextGreen = value;
        break;
      case 'blue-field':
        setBlue(value);
        nextBlue = value;
        break;
    }

    setHex(toHEX(nextRed, nextGreen, nextBlue));
  }

  function handleHexChange(e, value, color) {
    setHex(value);

    value = value.replace('#', '')

    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);

    if (!isNaN(r)) setRed(r)
    if (!isNaN(g)) setGreen(g)
    if (!isNaN(b)) setBlue(b)

  }

  return (
    <>
      <div id='sliders'>
        <Slider id='red' onChange={handleChange} value={red} />
        <Slider id='green' onChange={handleChange} value={green} />
        <Slider id='blue' onChange={handleChange} value={blue} />
      </div>
      <div id='fields'>
        <ColorField id='red-field' onChange={handleChange} value={red} />
        <ColorField id='green-field' onChange={handleChange} value={green} />
        <ColorField id='blue-field' onChange={handleChange} value={blue} />

        <ColorField
          id='hex-field'
          onChange={handleHexChange}
          typeInput='text'
          classInput='color-field hex-field'
          value={hex}
          maxLength={7}
        />
      </div>
    </>
  );
}