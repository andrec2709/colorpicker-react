import { useRef, useState } from 'react'
import ToolTip from './components/ToolTip';
import Field from './components/Field';
import ColorRange from './components/ColorRange';
import Colorpicker from './components/Colorpicker';
import Editor from './components/Editor';
import Header from './components/Header';
import PalettesListView from './components/PalettesListView';
import Palette from './components/Palette';
import PaletteDetailView from './components/PaletteDetailView';
import ColorItem from './components/ColorItem';
import Options from './components/Options';

import { usePalette } from './contexts/PaletteContext';
import { useToolTip } from './contexts/ToolTipContext';


// Assets
import LockIcon from './assets/lock.svg';
import UnlockIcon from './assets/unlock.svg';
import RandomIcon from './assets/random.svg';
import PlusIcon from './assets/plus.svg';
import ArrowIcon from './assets/arrow.svg';
import DeleteIcon from './assets/delete.svg';

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
  const max = chars.length - 1;
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


  const [red, setRed] = useState(parseInt(lastColor[0]));
  const [green, setGreen] = useState(parseInt(lastColor[1]));
  const [blue, setBlue] = useState(parseInt(lastColor[2]));
  const [hex, setHex] = useState(`#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`);

  const root = document.documentElement;
  root.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

  // Options
  const [useGrayscale, setUseGrayscale] = useState(false);
  const optGrayscaleRef = useRef(null);

  // Lock
  const [isLocked, setIsLocked] = useState(false);
  const optLockRef = useRef(null);
  const leadColor = useRef(null);
  const redLeadDiff = useRef(null);
  const greenLeadDiff = useRef(null);
  const blueLeadDiff = useRef(null);

  const options = useRef([optGrayscaleRef, optLockRef]);

  function handleSelectColor(color) {
    setRed(color[0]);
    setGreen(color[1]);
    setBlue(color[2]);
    setHex(color[3]);
  }


  function handleHexChange(value, color) {
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

  function handleChange(value, color) {

    value = isNaN(parseInt(value)) ? '' : parseInt(value, 10);
    value = Math.max(0, Math.min(value, 255));

    let nextRed = red;
    let nextGreen = green;
    let nextBlue = blue;

    if (useGrayscale) {
      setRed(value);
      setGreen(value);
      setBlue(value);

      nextRed = value;
      nextGreen = value;
      nextBlue = value;
    } else if (isLocked) {

      if (color !== leadColor.current[0]) return;

      // clamping values
      const valueRed = Math.max(0, Math.min(255, value - redLeadDiff.current));
      const valueGreen = Math.max(0, Math.min(255, value - greenLeadDiff.current));
      const valueBlue = Math.max(0, Math.min(255, value - blueLeadDiff.current));

      
      setRed(valueRed);
      setGreen(valueGreen);
      setBlue(valueBlue);

      nextRed = valueRed;
      nextGreen = valueGreen;
      nextBlue = valueBlue;
    } else {
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
    }

    setHex(`#${nextRed.toString(16).padStart(2, '0')}${nextGreen.toString(16).padStart(2, '0')}${nextBlue.toString(16).padStart(2, '0')}`);
    localStorage.setItem('last-color', `${nextRed},${nextGreen},${nextBlue}`);

  }

  function handlePickRandom() {

    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    handleChange(r, 'red');
    handleChange(g, 'green');
    handleChange(b, 'blue');
  }

  function handleOptions(e) {
    const optClicked = e.currentTarget.dataset.opt;

    if (options.current) {
      options.current.forEach(option => {

        if (option.current.dataset.opt === optClicked) {
          option.current.classList.toggle('selected');
        } else {
          option.current.classList.remove('selected');
        }
      });

      switch (optClicked) {
        case 'grayscale':
          setUseGrayscale(!useGrayscale);
          setIsLocked(false);
          break;
        case 'lock':
          setUseGrayscale(false);
          handleLockColors();
          break;
      }
    }

  }

  function handleLockColors() {
    if (optLockRef) {
      setIsLocked(!isLocked);

      if (red > green) {
        leadColor.current = ['red', red];
      } else {
        leadColor.current = ['green', green];
      }

      if (leadColor.current[1] < blue) {
        leadColor.current = ['blue', blue];
      }

      redLeadDiff.current = Math.abs(leadColor.current[1] - red);
      greenLeadDiff.current = Math.abs(leadColor.current[1] - green);
      blueLeadDiff.current = Math.abs(leadColor.current[1] - blue);

      return;
    }

  }

  return (
    <>
      <Options>
        <button id='grayscale' ref={optGrayscaleRef} onClick={handleOptions} data-opt='grayscale' className='options-button'>Grayscale</button>
        <button id='randomizer' className='randomizer' onClick={handlePickRandom} ><img src={RandomIcon} alt="Pick a random color" /></button>
        <button id='lock' className='lock' ref={optLockRef} onClick={handleOptions} data-opt='lock'><img src={isLocked ? LockIcon : UnlockIcon} alt="Lock distance between colors" title='lock distance between colors.&#10;You must move using the slider with the highest value.' /></button>
      </Options>
      <Colorpicker id='colorpicker'>
        <ToolTip id='tooltip' />
        <ColorRange value={red} id='red-slider' mainId='red-slider-container' textLabel='R' labelId="red-slider-label" onChange={handleChange} color='red' />
        <Field value={red} id='red-field' mainId='red-field-container' textLabel='R' onChange={handleChange} color='red' />
        <ColorRange value={green} id='green-slider' mainId='green-slider-container' textLabel='G' labelId="green-slider-label" onChange={handleChange} color='green' />
        <Field value={green} id='green-field' mainId='green-field-container' textLabel='G' onChange={handleChange} color='green' />
        <ColorRange value={blue} id='blue-slider' mainId='blue-slider-container' textLabel='B' labelId="blue-slider-label" onChange={handleChange} color='blue' />
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
            <img src={ArrowIcon} alt="go back" />
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
            <img src={PlusIcon} alt="new palette" />
          </button>
          <button id='palette-delete' style={{ display: `${selectedPalette === null ? 'none' : 'flex'}` }} onClick={handleDeletePalette}>
            <img src={DeleteIcon} alt="delete palette" />
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