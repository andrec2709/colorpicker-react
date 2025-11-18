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
import Modifiers from './components/Modifiers';
import { colornames } from 'color-name-list';
import nearestColor from 'nearest-color';

import { usePalette } from './contexts/PaletteContext';
import { useToolTip } from './contexts/ToolTipContext';


// Assets
import LockIcon from './assets/lock.svg';
import UnlockIcon from './assets/unlock.svg';
import RandomIcon from './assets/random.svg';
import PlusIcon from './assets/plus.svg';
import ArrowIcon from './assets/arrow.svg';
import DeleteIcon from './assets/delete.svg';
import ViewList from './assets/view-list.svg';
import ViewGrid from './assets/view-grid.svg';
import GrayScaleIcon from './assets/grayscale.svg';

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
  const { selectedPalette, selectedPaletteId, viewLayout, setViewLayout, palettesData, selectPalette, setSelectedPaletteName, updatePalettesData } = usePalette();
  const { showMessage } = useToolTip();


  const palettes = palettesData.map(palette => <Palette paletteData={palette} key={palette.id} />);

  const colorItems = [];

  selectedPalette?.colors.forEach(color => {
    colorItems.push(<ColorItem previewColor={color} key={color.id} colorId={color.id} onClick={handleSelectColor} />);
  });

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
    setRed(color.r);
    setGreen(color.g);
    setBlue(color.b);
    setHex(color.hex);
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

    const colorId = randomId(12);

    const colors = colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
    const nearest = nearestColor.from(colors);

    const colorName = nearest(hex).name;

    const colorToAdd = {
      id: colorId,
      r: red,
      g: green,
      b: blue,
      hex: hex,
      name: colorName,
    };

    const updatedPalettes = palettesData.map(palette => {
      if (palette.id === selectedPaletteId) {

        const colors = [colorToAdd].concat(palette.colors.slice());

        return {
          ...palette,
          colors
        }
      }
      return palette;
    });

    updatePalettesData(updatedPalettes);

  }

  function handleAddPalette() {

    const newPalette = {
      name: `Palette ${Object.keys(palettesData).length + 1}`,
      id: randomId(),
      colors: []
    };

    palettesData.push(newPalette)
    const newPalettesData = palettesData.slice();

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

  function handleNameChange(e, type) {

    if (e.target.value.length < 30) {

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
          option.current.classList.toggle('modifier__btn--active');
          option.current.children.item(0).classList.toggle('modifier__icon--active');
        } else {
          option.current.classList.remove('modifier__btn--active');
          option.current.children.item(0).classList.remove('modifier__icon--active');
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
      <Modifiers className='modifiers'>
        <button id='randomizer' className='modifier__btn' onClick={handlePickRandom} >
          <img className='modifier__icon' src={RandomIcon} alt="Pick a random color" />
        </button>
        <button id='grayscale' className='modifier__btn' ref={optGrayscaleRef} onClick={handleOptions} data-opt='grayscale'>
          <img className='modifier__icon' src={GrayScaleIcon} alt="grayscale mode" />
        </button>
        <button id='lock' className='modifier__btn' ref={optLockRef} onClick={handleOptions} data-opt='lock'>
          <img className='modifier__icon' src={isLocked ? LockIcon : UnlockIcon} alt="Lock distance between colors" title='lock distance between colors.&#10;You must move using the slider with the highest value.' />
        </button>
      </Modifiers>
      <Colorpicker id='colorpicker'>
        <ToolTip id='tooltip' />
        <ColorRange
          value={red}
          id='red-slider'
          mainId='red-slider-container'
          labelId="red-slider-label"
          textLabel='R'
          onChange={handleChange}
          color='red'
        />
        <Field
          value={red}
          id='red-field'
          mainId='red-field-container'
          textLabel='R'
          onChange={handleChange}
          color='red'
        />
        <ColorRange
          value={green}
          id='green-slider'
          mainId='green-slider-container'
          textLabel='G'
          labelId="green-slider-label"
          onChange={handleChange}
          color='green'
        />
        <Field
          value={green}
          id='green-field'
          mainId='green-field-container'
          textLabel='G'
          onChange={handleChange}
          color='green'
        />
        <ColorRange
          value={blue}
          id='blue-slider'
          mainId='blue-slider-container'
          textLabel='B'
          labelId="blue-slider-label"
          onChange={handleChange}
          color='blue'
        />
        <Field
          value={blue}
          id='blue-field'
          mainId='blue-field-container'
          textLabel='B'
          onChange={handleChange}
          color='blue'
        />
        <Field
          value={hex}
          id='hex-field'
          mainId='hex-field-container'
          textLabel='HEX'
          onChange={handleHexChange}
          color='hex'
        />
        <button
          id='add-color'
          className='colorpicker__btn'
          disabled={selectedPalette === null}
          onClick={handleAddColor}
        >Add to Palette
        </button>
      </Colorpicker>
      <Editor>
        <Header>
          <button
            id="back-btn"
            className='editor-header__btn'
            style={{ visibility: `${selectedPalette === null ? 'hidden' : 'visible'}` }}
            onClick={() => selectPalette(null)}
          >
            <img
              src={ArrowIcon}
              className='editor-header__icon'
              alt="go back"
            />
          </button>
          <label htmlFor="palette-title" id='palette-title-label' className='label--hidden'>Palette title</label>
          <input
            type='text'
            id='palette-title'
            className='name'
            value={selectedPalette?.name ?? 'Palettes'}
            onChange={(e) => handleNameChange(e, 'palette')}
            disabled={selectedPalette === null ? true : false}
            aria-label='palette title'
          />
          <button
            id='view-btn'
            className='editor-header__btn'
            onClick={e => setViewLayout(viewLayout === 'grid' ? 'block' : 'grid')}
          >
            <img
              src={viewLayout === 'grid' ? ViewGrid : ViewList}
              className='editor-header__icon'
              alt={viewLayout === 'grid' ? 'change to list view' : 'change to grid view'}
            />
          </button>
          <button
            id="palette-add"
            className='editor-header__btn'
            style={{ display: `${selectedPalette === null ? 'flex' : 'none'}` }}
            onClick={handleAddPalette}
          >
            <img
              src={PlusIcon}
              className='editor-header__icon'
              alt="new palette"
            />
          </button>
          <button
            id='palette-delete'
            className='editor-header__btn'
            style={{ display: `${selectedPalette === null ? 'none' : 'flex'}` }}
            onClick={handleDeletePalette}
          >
            <img
              src={DeleteIcon}
              className='editor-header__icon'
              alt="delete palette"
            />
          </button>
        </Header>
        <PalettesListView
          style={{ display: `${selectedPalette === null ? 'grid' : 'none'}` }}
        >
          {palettes}
        </PalettesListView>
        <PaletteDetailView
          style={{ display: `${selectedPalette === null ? 'none' : viewLayout}` }}
        >
          {colorItems}
        </PaletteDetailView>
      </Editor>
    </>
  );
}