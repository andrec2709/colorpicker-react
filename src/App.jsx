import { useState } from 'react'
import ToolTip from './components/ToolTip';
import './App.css'
import ContextProvider from './contexts/ContextProvider';
import Field from './components/Field';
import { Color } from './components/Color';
import Slider from './components/Slider';
import Colorpicker from './components/Colorpicker';

// Exercise:
// Make a simple colorpicker app.
// Read draft.md

export default function ColorPickerApp() {
  const lastColor = localStorage.getItem('last-color')?.split(',') || [0, 0, 0];

  const [red, setRed] = useState(parseInt(lastColor[0]));
  const [green, setGreen] = useState(parseInt(lastColor[1]));
  const [blue, setBlue] = useState(parseInt(lastColor[2]));
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

    setHex(`#${nextRed.toString(16).padStart(2, '0')}${nextGreen.toString(16).padStart(2, '0')}${nextBlue.toString(16).padStart(2, '0')}`);
    localStorage.setItem('last-color', `${nextRed},${nextGreen},${nextBlue}`);
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
      <Colorpicker id='colorpicker'>
        <ToolTip id='tooltip' />
        <Color id='red-color'>
          <Slider value={red} id='red-slider' textLabel='R' onChange={handleChange} color='red' />
          <Field value={red} id='red-field' textLabel='R' onChange={handleChange} color='red' />
        </Color>
        <Color id='green-color'>
          <Slider value={green} id='green-slider' textLabel='G' onChange={handleChange} color='green' />
          <Field value={green} id='green-field' textLabel='G' onChange={handleChange} color='green' />
        </Color>
        <Color id='blue-color'>
          <Slider value={blue} id='blue-slider' textLabel='B' onChange={handleChange} color='blue' />
          <Field value={blue} id='blue-field' textLabel='B' onChange={handleChange} color='blue' />
        </Color>
        <Color id='hex-color'>
          <Field value={hex} id='hex-field' textLabel='HEX' onChange={handleHexChange} color='hex' classLabel='' />
        </Color>
      </Colorpicker>
    </ContextProvider>
  );
}