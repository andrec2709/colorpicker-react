import { useState } from 'react'
import ToolTip from './components/ToolTip';
import Slider from './components/Slider';
import HexField from './components/HexField';
import './App.css'
import ContextProvider from './contexts/ContextProvider';

// Exercise:
// Make a simple colorpicker app.
// Read draft.md

export default function ColorPickerApp() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [hex, setHex] = useState(
    `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
  );
  const root = document.documentElement;
  root.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

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

    setHex(`#${nextRed.toString(16).padStart(2, '0')}${nextGreen.toString(16).padStart(2, '0')}${nextBlue.toString(16).padStart(2, '0')}`)
  }

  function handleHexChange(e) {
    let value = e.target.value;

    if (/^#[a-fA-F0-9]{0,6}$/.test(value)) {

      setHex(value);

      value = value.replace('#', '');
      
      const nextRed = parseInt(value.slice(0, 2).padStart(2, '0'), 16);
      const nextGreen = parseInt(value.slice(2, 4).padStart(2, '0'), 16);
      const nextBlue = parseInt(value.slice(4, 6).padStart(2, '0'), 16);

      setRed(nextRed);
      setGreen(nextGreen);
      setBlue(nextBlue);


    } else {
      return;
    }

  }

  return (
    <ContextProvider>
      <ToolTip id='tooltip'/>
      <Slider label='R' value={red} onChange={handleChange} color='red' id='red-slider' />
      <Slider label='G' value={green} onChange={handleChange} color='green' id='green-slider' />
      <Slider label='B' value={blue} onChange={handleChange} color='blue' id='blue-slider' />
      <HexField value={hex} id='hex-field' label='HEX' onChange={handleHexChange} />
    </ContextProvider>
  );
}