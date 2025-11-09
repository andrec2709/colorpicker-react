import { useState } from 'react'
import ToolTip from './components/ToolTip';
import './App.css'
import ContextProvider from './contexts/ContextProvider';
import Field from './components/Field';
import Color from './components/Color';
import Slider from './components/Slider';
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

// Exercise:
// Make a simple colorpicker app.
// Read draft.md

export default function ColorPickerApp() {
  const { selectedPalette, palettesData, selectPalette, updatePalettesData } = usePalette();
  const { showMessage } = useToolTip();

  const palettes = palettesData.map(palette => <Palette paletteData={palette} key={palette.id} />);

  const colorItems = [];

  for (const key in selectedPalette?.colors) {
    if (selectedPalette.colors.hasOwnProperty(key)) {
      colorItems.push(<ColorItem previewColor={selectedPalette.colors[key]} key={key} colorId={key} />);
    }
  }

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
    const colorId = `R${red.toString(10)[0]}G${green.toString(10)[0]}B${blue.toString(10)[0]}${Object.keys(selectedPalette.colors).length.toString(10).padStart(4, '0000')}`;

    selectedPalette.colors[colorId] = colorToAdd;

    const updatedPalettes = palettesData.map(palette => {
      return palette;
    });

    console.log(selectedPalette)
    console.log(palettesData)
    updatePalettesData(updatedPalettes);

  }

  function handleAddPalette() {
    const newPalette = {
      name: `Palette ${Object.keys(palettesData).length + 1}`,
      id: `PLT${(Object.keys(palettesData).length + 1).toString(10).padStart(4, '0000')}`,
      colors: {}
    };

    palettesData.push(newPalette)
    const newPalettesData = palettesData;

    selectPalette(newPalette);
    updatePalettesData(newPalettesData);

  }

  function handleDeletePalette() {

    if (selectedPalette === null){
      return;
    }

    const updatedPalettes = palettesData.filter(palette => palette.id !== selectedPalette.id);

    selectPalette(null);

    updatePalettesData(updatedPalettes);

  }

  return (
    <>
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
        <button id='add-color' disabled={selectedPalette === null} onClick={handleAddColor}>Add to Palette</button>
      </Colorpicker>
      <Editor>
        <Header>
          <button
            id="back-btn"
            style={{ visibility: `${selectedPalette === null ? 'hidden' : 'visible'}` }}
            onClick={() => selectPalette(null)}
          >
            <img src="/arrow.png" alt="go back" />
          </button>
          <p>{selectedPalette?.name ?? 'Palettes'}</p>
          <button id="add-btn" style={{ display: `${selectedPalette === null ? 'flex' : 'none'}` }} onClick={handleAddPalette}>
            <img src="/add.png" alt="new palette" />
          </button>
          <button id='palette-delete' style={{ display: `${selectedPalette === null ? 'none' : 'flex'}` }} onClick={handleDeletePalette}>
            <img src="/delete.png" alt="delete palette" />
          </button>
        </Header>
        <PalettesListView
          style={{ visibility: `${selectedPalette === null ? 'visible' : 'hidden'}`, display: `${selectedPalette === null ? 'grid' : 'none'}` }}
        >
          {palettes}
        </PalettesListView>
        <PaletteDetailView
          style={{ display: `${selectedPalette === null ? 'none' : 'flex'}` }}
        >
          {colorItems}
        </PaletteDetailView>
      </Editor>
    </>
  );
}