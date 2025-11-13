import { useState } from 'react'
import ToolTip from './components/ToolTip';
import Field from './components/Field';
import ColorRange from './components/ColorRange';
import Colorpicker from './components/Colorpicker';
import Editor from './components/Editor';
import Header from './components/Header';
import PalettesListView from './components/PalettesListView';

// import palettesData from './palettes.json';
import Palette from './components/Palette';
import PaletteDetailView from './components/PaletteDetailView';
import { usePalette } from './contexts/PaletteContext';
import { ColorItem } from './components/ColorItem';
import { useToolTip } from './contexts/ToolTipContext';
import './App.css'


// Exercise:
// Make a simple colorpicker app.
// Read draft.md

function randomId(size = 12) {
  const chars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '@', '!',
    '#', '$', '%', '&', '*', '?', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  let number;
  let finalId = '';
  const max = 69;
  const min = 0;

  for (let index = 0; index < size; index++) {
    number = Math.floor(Math.random() * (max - min + 1) + min);
    finalId += chars[number];
  }

  return finalId;

}

export default function ColorPickerApp() {
  const { selectedPalette, selectedPaletteName, palettesData, selectPalette, setSelectedPaletteName, updatePalettesData } = usePalette();
  const { showMessage } = useToolTip();

  const palettes = palettesData.map(palette => <Palette paletteData={palette} key={palette.id} />);

  const colorItems = [];

  for (const key in selectedPalette?.colors) {
    if (selectedPalette.colors.hasOwnProperty(key)) {
      colorItems.push(<ColorItem previewColor={selectedPalette.colors[key]} key={key} colorId={key} onClick={handleSelectColor} />);
    }
  }

  const lastColor = localStorage.getItem('last-color')?.split(',') || [0, 0, 0];

  // const [red, setRed] = useState(parseInt(lastColor[0]));
  const [red, setRed] = useState(parseInt(lastColor[0]));
  const [green, setGreen] = useState(parseInt(lastColor[1]));
  const [blue, setBlue] = useState(parseInt(lastColor[2]));
  const [hex, setHex] = useState(
    `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
  );

  const root = document.documentElement;
  root.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

  function handleSelectColor(color) {
    setRed(color[0]);
    setGreen(color[1]);
    setBlue(color[2]);
    setHex(color[3]);
  }


  function handleHexChange(e) {
    let value = e.value;
    console.log(value)
    if (/^#[a-fA-F0-9]{0,6}$/.test(value)) {

      setHex(value);

      value = value.replace('#', '');

      const nextRed = parseInt(value.slice(0, 2).padStart(2, '0'), 16);
      const nextGreen = parseInt(value.slice(2, 4).padStart(2, '0'), 16);
      const nextBlue = parseInt(value.slice(4, 6).padStart(2, '0'), 16);
      console.log(`nextRed: ${nextRed}\nnextGreen: ${nextGreen}\nnextBlue: ${nextBlue}`);
      setRed(nextRed);
      setGreen(nextGreen);
      setBlue(nextBlue);


    } else {
      return;
    }

  }

  function handleAddColor() {
    if (selectedPalette === null) {
      showMessage('Please select a palette first', 'fail');
      return;
    }

    if (isNaN(red) || isNaN(green) || isNaN(blue) || red === "" || green === "" || blue === "") {
      showMessage('Not a valid color!', 'fail');
      return;
    }

    const colorToAdd = [red, green, blue, hex];
    const colorId = randomId(12);

    selectedPalette.colors[colorId] = colorToAdd;

    const updatedPalettes = palettesData.map(palette => {
      return palette;
    });

    updatePalettesData(updatedPalettes);

  }

  function handleAddPalette() {

    const newPalette = {
      name: `Palette ${Object.keys(palettesData).length + 1}`,
      id: randomId(),
      colors: {}
    };

    palettesData.push(newPalette)
    const newPalettesData = palettesData;

    selectPalette(newPalette);
    updatePalettesData(newPalettesData);

  }

  function handleDeletePalette() {

    if (selectedPalette === null) {
      return;
    }

    const updatedPalettes = palettesData.filter(palette => palette.id !== selectedPalette.id);

    selectPalette(null);

    updatePalettesData(updatedPalettes);

  }

  function handleNameChange(e) {

    if (e.target.value.length < 30) {
      setSelectedPaletteName(e.target.value);

      const updatedPalettes = palettesData.map(palette => {
        if (palette.id === selectedPalette.id) {
          const name = e.target.value;

          return {
            ...palette,
            name
          };
        }

        return palette;
      });

      updatePalettesData(updatedPalettes);
    }
  }

  function handleChange(e) {

    const color = e.dataset.color;
    let value;
    if (e.tagName === 'INPUT') {
      value = isNaN(parseInt(e.value)) ? '' : parseInt(e.value, 10);
    } else {
      value = isNaN(parseInt(e.dataset.value)) ? '' : parseInt(e.dataset.value, 10);
    }

    value = Math.max(0, Math.min(value, 255));

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

  return (
    <>
    
      <Colorpicker id='colorpicker'>
        <ToolTip id='tooltip' />
        <ColorRange value={red} id='red-slider' mainId='red-slider-container' textLabel='R' onChange={handleChange} color='red' />
        <Field value={red} id='red-field' mainId='red-field-container' textLabel='R' onChange={handleChange} color='red' />
        <ColorRange value={green} id='green-slider' mainId='green-slider-container' textLabel='G' onChange={handleChange} color='green' />
        <Field value={green} id='green-field' mainId='green-field-container' textLabel='G' onChange={handleChange} color='green' />
        <ColorRange value={blue} id='blue-slider' mainId='blue-slider-container' textLabel='B' onChange={handleChange} color='blue' />
        <Field value={blue} id='blue-field' mainId='blue-field-container' textLabel='B' onChange={handleChange} color='blue' />
        <Field value={hex} id='hex-field' mainId='hex-field-container' textLabel='HEX' onChange={handleHexChange} color='hex' classLabel='' />
        <button id='add-color' disabled={selectedPalette === null} onClick={handleAddColor}>Add to Palette</button>
      </Colorpicker>
      <Editor>
        <Header>
          <button
            id="back-btn"
            style={{ visibility: `${selectedPalette === null ? 'hidden' : 'visible'}` }}
            onClick={() => selectPalette(null)}
          >
            <img src="./arrow.svg" alt="go back" />
          </button>
          <label htmlFor="palette-title" id='palette-title-label'>Palette title</label>
          <input
            type='text'
            id='palette-title'
            value={selectedPaletteName}
            onChange={(e) => handleNameChange(e)}
            disabled={selectedPalette === null ? true : false}
            aria-label='palette title'
          />
          <button id="palette-add" style={{ display: `${selectedPalette === null ? 'flex' : 'none'}` }} onClick={handleAddPalette}>
            <img src="./plus.svg" alt="new palette" />
          </button>
          <button id='palette-delete' style={{ display: `${selectedPalette === null ? 'none' : 'flex'}` }} onClick={handleDeletePalette}>
            <img src="./delete.svg" alt="delete palette" />
          </button>
        </Header>
        <PalettesListView
          style={{ display: `${selectedPalette === null ? 'grid' : 'none'}` }}
        >
          {palettes}
        </PalettesListView>
        <PaletteDetailView
          style={{ display: `${selectedPalette === null ? 'none' : 'grid'}` }}
        >
          {colorItems}
        </PaletteDetailView>
      </Editor>
    </>
  );
}