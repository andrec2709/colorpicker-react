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
import { randomID } from './utils';

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
import BackgroundIcon from './assets/background.png';
import TextIcon from './assets/text.png';

import './App.css'
import Preview from './components/Preview';


// Exercise:
// Make a simple colorpicker app.
// Read draft.md


/**
 * Main function for the colorpicker application.
 * 
 */
export default function ColorPickerApp() {
  const {
    selectedPalette,
    selectedPaletteId,
    viewLayout,
    setViewLayout,
    palettesData,
    selectPalette,
    updatePalettesData,
    red, setRed,
    green, setGreen,
    blue, setBlue,
    hex, setHex,
    selection, setSelection
  } = usePalette();
  const { showMessage } = useToolTip();


  const palettes = palettesData.map(palette => <Palette paletteData={palette} key={palette.id} />);

  const colorItems = [];

  selectedPalette?.colors.forEach(color => {
    colorItems.push(<ColorItem previewColor={color} key={color.id} colorId={color.id} onClick={handleSelectColor} />);
  });

  // const root = document.documentElement;
  // root.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

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

  const bgButtonRef = useRef(null);
  const txtButtonRef = useRef(null);

  /**
   * Function used to select a color from the palette's color list. This is generally called by {@link Components/ColorItem | ColorItem} as a callback.
   * @param {Object} color - a color Object with at least properties r, g, b, hex.
   * @alias functions/handleSelectColor 
   */
  function handleSelectColor(color) {
    setRed(color.r);
    setGreen(color.g);
    setBlue(color.b);
    setHex(color.hex);
  }

  /**
   * Handler function for changes on the hex value. Generally called as a callback from a {@link Components/Field | Field}.
   * For the moment, {@link functions/handleChange | handleChange} and this function are separate functions, but they might eventually be converted into one as they serve primarily the same purpose.
   * @param {string} value - the new value to set hex to.
   * @param {string} color - DEPRECATED: this parameter is not in use and will eventually be removed. It is supposed to be a string value indicating the color value to be modified, e.g. 'red', 'green', 'blue'. For this function it would be passed as 'hex', but it is not in use and unlikely will.
   * @returns {void}
   * @alias functions/handleHexChange
   */
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

  /**
   * Handler function used to add colors to the currently selected palette.
   * @returns {void}
   * @alias functions/handleAddColor
   */
  function handleAddColor() {
    if (selectedPalette === null) {
      showMessage('Please select a palette first', 'fail');
      return;
    }

    if (isNaN(red) || isNaN(green) || isNaN(blue) || red === "" || green === "" || blue === "") {
      showMessage('Not a valid color!', 'fail');
      return;
    }

    const colorId = randomID(12);

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

  /**
   * Handler function used to create a new palette.
   * @alias functions/handleAddPalette
   */
  function handleAddPalette() {

    const newPalette = {
      name: `Palette ${Object.keys(palettesData).length + 1}`,
      id: randomID(),
      colors: []
    };

    palettesData.push(newPalette)
    const newPalettesData = palettesData.slice();

    selectPalette(newPalette);
    updatePalettesData(newPalettesData);

  }

  /**
   * Handler function used to delete the selected palette.
   * @returns {void}
   * @alias functions/handleDeletePalette
   */
  function handleDeletePalette() {

    if (selectedPalette === null) {
      return;
    }

    const updatedPalettes = palettesData.filter(palette => palette.id !== selectedPalette.id);

    selectPalette(null);

    updatePalettesData(updatedPalettes);

  }

  /**
   * Function that handles the change to a palette's name.
   * @param {Event} e - event created by the input where the name is being edited.
   * @alias functions/handleNameChange
   */
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

  /**
   * Handler function that updates the values of red, green, and blue colors when they change.
   * @param {number|string} value - the new value to update to.
   * @param {string} color - the color to be updated. 
   * @returns {void}
   * @alias functions/handleChange
   */
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

  /**
   * Function used to randomly select a color.
   * @alias functions/handlePickRandom
   */
  function handlePickRandom() {

    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    handleChange(r, 'red');
    handleChange(g, 'green');
    handleChange(b, 'blue');
  }

  /**
   * Function that handles modifiers like locking sliders, grayscale.
   * @param {Event} e - Event generated by clicking the modifier button.
   * @alias functions/handleOptions
   */
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

  function handleSelectionType(e) {
    if (e.currentTarget.dataset.opt === 'background') {
      setSelection('background');
      bgButtonRef.current.classList.add('modifier__btn--active');
      bgButtonRef.current.children.item(0).classList.add('modifier__icon--active');
      
      txtButtonRef.current.classList.remove('modifier__btn--active');
      txtButtonRef.current.children.item(0).classList.remove('modifier__icon--active');
    } else {
      setSelection('text');

      txtButtonRef.current.classList.add('modifier__btn--active');
      txtButtonRef.current.children.item(0).classList.add('modifier__icon--active');
      
      bgButtonRef.current.classList.remove('modifier__btn--active');
      bgButtonRef.current.children.item(0).classList.remove('modifier__icon--active');
    }
  }

  /**
   * Handler function for the "lock sliders" modifier.
   * This function determines the lead color and calculates the difference from the other sliders.
   * @returns {void}
   * @alias functions/handleLockColors
   */
  function handleLockColors() {
    if (optLockRef.current) {
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
      <Preview />
      <Colorpicker id='colorpicker'>
        <ToolTip id='tooltip' />
        <ColorRange
          value={red}
          sliderId='red-slider'
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
          sliderId='green-slider'
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
          sliderId='blue-slider'
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
        <div id='color-options'>
          <button
            id='add-color'
            className='colorpicker__btn'
            disabled={selectedPalette === null}
            onClick={handleAddColor}
          ><img src={PlusIcon} className='colorpicker__icon' alt="add to palette" />
          </button>
          <button ref={bgButtonRef} className='colorpicker__btn modifier__btn--active' onClick={handleSelectionType} data-opt='background'>
            <img src={BackgroundIcon} className='colorpicker__icon modifier__icon--active' alt="set background color" />
          </button>
          <button ref={txtButtonRef} className='colorpicker__btn' onClick={handleSelectionType} data-opt='text'>
            <img src={TextIcon} className='colorpicker__icon' alt="set background color" />
          </button>
        </div>
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