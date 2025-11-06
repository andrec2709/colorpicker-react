import { useEffect, useState } from 'react'
import './App.css'

// Exercise:
// Make a simple colorpicker app.
// Read draft.md

function Field({ value, onChange, color, id }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(value)
      .then(() => { console.log('success') }, () => { console.log('fail') });
  }

  return (
    <div className='field-container' id={id}>
      <input min={0} max={255} value={value} onChange={onChange} type='text' data-color={color} />
      <button onClick={handleCopy}>
        <img src='/src/assets/copy.png'></img>
      </button>
    </div>
  );
}

function LabeledComponent({ label, content }) {
  return (
    <div className='labeled-container'>
      <span>{label}</span>
      {content}
    </div>
  );
}

function Slider({ label, value, onChange, color, id }) {
  return (
    <>
      <div className='slider-container' id={id}>
        <span>{label}</span>
        <input type="range" value={value} onChange={onChange} data-color={color} min={0} max={255} />
        <Field value={value} onChange={onChange} color={color} />
      </div>
    </>
  );
}

export default function ColorPickerApp() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [rgb, setRgb] = useState([red, green, blue]);
  const [hex, setHex] = useState(
    `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`
  );
  console.log(hex);

  function handleChange(e) {
    const color = e.target.dataset.color;
    let value = isNaN(parseInt(e.target.value)) ? '' : parseInt(e.target.value, 10);

    if (value < 0) { value = 0 }

    if (value > 255) { value = 255 }

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
    }

    setRgb([nextRed, nextGreen, nextBlue]);
    setHex(`#${nextRed.toString(16).padStart(2, '0')}${nextGreen.toString(16).padStart(2, '0')}${nextBlue.toString(16).padStart(2, '0')}`)

    const root = document.documentElement;
    root.style.backgroundColor = `rgb(${nextRed}, ${nextGreen}, ${nextBlue})`;
  }

  return (
    <>
      <Slider label='R' value={red} onChange={handleChange} color='red' id='red-slider' />
      <Slider label='G' value={green} onChange={handleChange} color='green' id='green-slider' />
      <Slider label='B' value={blue} onChange={handleChange} color='blue' id='blue-slider' />
      <Field value={hex} id='hex-field' />
    </>
  );
}