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

function ColorField({ id, value, onChange, min = 0, max = 255 }) {
  async function handleClick() {
    await navigator.clipboard.writeText(value);
  }
  
  return (
    <div className='color-field-container'>
      <input
        type="number"
        id={id}
        className='color-field'
        min={min}
        max={max}
        value={value}
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

export default function ColorPickerApp() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  useEffect(() => {

    const newColor = `rgb(${red}, ${green}, ${blue})`;
    document.documentElement.style.backgroundColor = newColor;

  }, [red, green, blue]);

  function handleChange(e, value, color) {

    if (!/^[0-9]{0,3}$/.test(value)) { return }

    else if (value < 0) { value = 0 }

    else if (value > 255) { value = 255 }

    switch (color) {
      case 'red':
        setRed(value);
        break;
      case 'green':
        setGreen(value);
        break;
      case 'blue':
        setBlue(value);
        break;
      case 'red-field':
        setRed(value);
        break;
      case 'green-field':
        setGreen(value);
        break;
      case 'blue-field':
        setBlue(value);
        break;
    }
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
        <ColorField id='hex-field' onChange={handleChange} value={blue} />
      </div>
    </>
  );
}