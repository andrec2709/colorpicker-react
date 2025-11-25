import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { randomID } from './utils/index';

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
import GearIcon from './assets/gear.svg';
import CloseIcon from './assets/close.svg';

import './App.css'
import Preview from './components/Preview';
import { useColor } from './contexts/ColorContext';
import { Settings } from './components/Settings';
import { useSettings } from './contexts/SettingsContext';
import ToggleSwitch from './components/ToggleSwitch';
import type { Color } from './types/palette';


// Exercise:
// Make a simple colorpicker app.
// Read draft.md


/**
 * Main function for the colorpicker application.
 * 
 */
export default function ColorPickerApp() {
  // Palette context provider
  const {
    selectedPalette,
    selectedPaletteId,
    viewLayout,
    setViewLayout,
    palettesData,
    selectPalette,
    updatePalettesData,
  } = usePalette();

  // Color context provider
  const {
    red, setRed,
    green, setGreen,
    blue, setBlue,
    hex, setHex,
    selection, setSelection,
    bgColor, setBgColor,
    txtColor, setTxtColor,
  } = useColor();

  // Settings context provider
  const {
    isSettingsVisible,
    setIsSettingsVisible,
    copyHexWithoutHash,
    setCopyHexWithoutHash,
    addColorToEnd,
    setAddColorToEnd
  } = useSettings();

  // Tooltip context provider
  const { showMessage } = useToolTip();

  const paletteDetailViewRef = useRef<HTMLDivElement>(null);

  const palettes = useMemo(() => palettesData.map(palette => <Palette paletteData={palette} key={palette.id} />), [palettesData]);


  // Options
  const [useGrayscale, setUseGrayscale] = useState(false);
  const optGrayscaleRef = useRef<HTMLButtonElement>(null);

  // Lock
  const [isLocked, setIsLocked] = useState(false);
  const optLockRef = useRef<HTMLButtonElement>(null);
  const leadColor = useRef<[string, number]>(null);
  const redLeadDiff = useRef<number>(0);
  const greenLeadDiff = useRef<number>(0);
  const blueLeadDiff = useRef<number>(0);

  // 'modifiers'
  const options = useRef([optGrayscaleRef, optLockRef]);


  const bgButtonRef = useRef<HTMLButtonElement>(null);
  const txtButtonRef = useRef<HTMLButtonElement>(null);


  const [contrastRatio, setContrastRatio] = useState(0);


  const textColor = () => {
    switch (true) {
      case contrastRatio < 4.5:
        return '#e90000';

      case contrastRatio >= 4.5 && contrastRatio < 7:
        return '#d5e500';

      case contrastRatio >= 7:
        return '#44ff4d';

    }
  };

  /**
   * @function
   * Loads the selected color to the sliders and fields.
   * @param color - Color to be selected
   */
  const handleSelectColor = (color: Color) => {
    setRed(color.r);
    setGreen(color.g);
    setBlue(color.b);
    setHex(color.hex);
  }

  // Rendered color items when a palette is selected
  const colorItems = useMemo(() => (
    selectedPalette?.colors.map(color => <ColorItem previewColor={color} key={color.id} colorId={color.id} onClick={handleSelectColor} />)
  ), [selectedPalette]);

  /**
   * @function
   * Adds the current color to the selected palette.
   * 
   */
  const handleAddColor = () => {
    if (selectedPalette === null) {
      showMessage('Please select a palette first', 'fail');
      return;
    }

    if (isNaN(red) || isNaN(green) || isNaN(blue)) {
      showMessage('Not a valid color!', 'fail');
      return;
    }


    const colorId = randomID(12);

    const colors = colornames.reduce((o: any, { name, hex }: { name: any, hex: any }) => Object.assign(o, { [name]: hex }), {});
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

        let colors;
        if (addColorToEnd) {
          colors = palette.colors.slice().concat(colorToAdd);
        } else {
          colors = [colorToAdd].concat(palette.colors.slice());
        }

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
   * @function
   * Adds a new palette to palettesData.
   */
  const handleAddPalette = () => {

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
   * @function
   * Deletes the currently selected palette.
   * 
   */
  const handleDeletePalette = () => {

    if (selectedPalette === null) {
      return;
    }

    const updatedPalettes = palettesData.filter(palette => palette.id !== selectedPalette.id);

    selectPalette(null);

    updatePalettesData(updatedPalettes);

  }

  /**
   * @function
   * Changes the name of the selected palette.
   * @param e - Event generated by the input field.
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.value.length < 30) {

      const updatedPalettes = palettesData.map(palette => {
        if (palette.id === selectedPalette?.id) {



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
   * @function
   * Handles changes to red, green and blue states.
   * @param value - the new value.
   * @param color - the color that is to be changed.
   * @param modifierAllowed - if modifiers like grayscale or lock mode are allowed to be used.
   */
  const handleChange = useCallback((value: any, color: string, modifierAllowed = true) => {
    // TODO: value should not be any type
    value = isNaN(parseInt(value)) ? '' : parseInt(value, 10);
    value = Math.max(0, Math.min(value, 255));

    if (useGrayscale && modifierAllowed) {

      setRed(value);
      setGreen(value);
      setBlue(value);

      return;
    }

    if (isLocked && modifierAllowed) {

      if (color !== leadColor.current![0]) return showMessage('When in locked mode, drag by the slider with the highest value!', 'fail', 3000);

      let clampRed = value - redLeadDiff.current;
      let clampGreen = value - greenLeadDiff.current;
      let clampBlue = value - blueLeadDiff.current;

      clampRed = Math.max(0, Math.min(clampRed, 255));
      clampGreen = Math.max(0, Math.min(clampGreen, 255));
      clampBlue = Math.max(0, Math.min(clampBlue, 255));

      setRed(clampRed);
      setGreen(clampGreen);
      setBlue(clampBlue);

      return;
    }

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
    }

  }, [red, green, blue, hex, isLocked, useGrayscale]);

  /**
   * @function
   * Handles changes on the hex state.
   */
  const handleHexChange = useCallback((value: number | string, color: string) => {
    value = value.toString();

    if (/^#?[a-fA-F0-9]{0,6}$/.test(value)) {

      setHex(value);

      value = value.replace('#', '');

      // const nextRed = parseInt(value.slice(0, 2).padStart(2, '0'), 16);
      // const nextGreen = parseInt(value.slice(2, 4).padStart(2, '0'), 16);
      // const nextBlue = parseInt(value.slice(4, 6).padStart(2, '0'), 16);

      let nextRed;
      let nextGreen;
      let nextBlue;

      if (value.length === 6) {
        nextRed = parseInt(value.slice(0, 2), 16);
        nextGreen = parseInt(value.slice(2, 4), 16);
        nextBlue = parseInt(value.slice(4, 6), 16);
        handleChange(nextRed, 'red');
        handleChange(nextGreen, 'green');
        handleChange(nextBlue, 'blue');
      }

      console.log(`nextRed: ${nextRed}\nnextGreen: ${nextGreen}\nnextBlue: ${nextBlue}`);

    } else {
      return;
    }

  }, [red, green, blue]);

  /**
   * @function
   * Selects a randomly generated color.
   */
  const handlePickRandom = useCallback(() => {

    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    handleChange(r, 'red');
    handleChange(g, 'green');
    handleChange(b, 'blue');

  }, [handleChange]);

  /**
   * @function
   * This function changes the value of red, green, blue states when the user changes the selection type (background, text).
   * @param e - the event generated by the button element.
   */
  const handleSelectionType = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.dataset.opt === 'background') {
      setSelection('background');
      handleChange(bgColor[0], 'red', false);
      handleChange(bgColor[1], 'green', false);
      handleChange(bgColor[2], 'blue', false);
    } else {
      setSelection('text');
      handleChange(txtColor[0], 'red', false);
      handleChange(txtColor[1], 'green', false);
      handleChange(txtColor[2], 'blue', false);
    }
  }

  /**
   * @function
   * Function called when used toggles locked mode.
   */
  const handleLockColors = useCallback(() => {
    if (optLockRef.current) {

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

      // console.log(`
      //     leadColor: (${leadColor.current}),
      //     redLeadDiff: ${redLeadDiff.current},
      //     greenLeadDiff: ${greenLeadDiff.current},
      //     blueLeadDiff: ${blueLeadDiff.current},
      //   `);

      return;
    }

  }, [isLocked, optLockRef, red, green, blue]);

  /**
   * @function
   * Function called when the user changes any of the modifiers.
   */
  const handleOptions = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: This function should be called handleModifiers instead.

    const optClicked = e.currentTarget.dataset.opt;

    if (options.current) {
      options.current.forEach(option => {

        if (!option.current) return;

        if (option.current.dataset.opt === optClicked) {
          option.current.classList.toggle('modifier__btn--active');
          option.current.children.item(0)?.classList.toggle('modifier__icon--active');
        } else {
          option.current.classList.remove('modifier__btn--active');
          option.current.children.item(0)?.classList.remove('modifier__icon--active');
        }
      });

      switch (optClicked) {
        case 'grayscale':
          setUseGrayscale(!useGrayscale);
          setIsLocked(false);
          break;
        case 'lock':
          setUseGrayscale(false);
          setIsLocked(!isLocked);
          handleLockColors();
          break;
      }
    }

  }, [isLocked, useGrayscale, handleLockColors]);

  /**
   * @function
   * Called when any of the available settings is changed.
   * @param e - the event generated by the element representing the setting
   */
  const handleSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case 'hex-copy-opt':
        setCopyHexWithoutHash(e.target.checked);
        localStorage.setItem('copy-hex-without-hash', e.target.checked.toString())
        break;
      case 'add-color-to-end-opt':
        setAddColorToEnd(e.target.checked);
        localStorage.setItem('add-color-to-end', e.target.checked.toString());
        break;
    }
  }

  useEffect(() => {
    const el = paletteDetailViewRef.current;

    if (el) {
      if (addColorToEnd) {
        el.scrollTo({
          top: el.scrollHeight,
          left: 0,
          behavior: 'smooth',
        });
      } else {
        el.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [palettesData, addColorToEnd]);

  useEffect(() => {

    const nextColor = [red, green, blue].join(',');

    if (selection === 'background') {
      setBgColor([red, green, blue]);
      localStorage.setItem('bg-color', nextColor);
    }
    else {
      setTxtColor([red, green, blue])
      localStorage.setItem('txt-color', nextColor);
    };

    const hexRed = red.toString(16).padStart(2, '0');
    const hexGreen = green.toString(16).padStart(2, '0');
    const hexBlue = blue.toString(16).padStart(2, '0');

    setHex(`#${hexRed}${hexGreen}${hexBlue}`);


  }, [red, green, blue]);


  useEffect(() => {

    // luminance for bgColor

    let linearRed = (bgColor[0] ?? 0) / 255;
    let linearGreen = (bgColor[1] ?? 0) / 255;
    let linearBlue = (bgColor[2] ?? 0) / 255;

    linearRed = linearRed <= 0.03928 ? linearRed / 12.92 : ((linearRed + 0.055) / 1.055) ** 2.4;
    linearGreen = linearGreen <= 0.03928 ? linearGreen / 12.92 : ((linearGreen + 0.055) / 1.055) ** 2.4;
    linearBlue = linearBlue <= 0.03928 ? linearBlue / 12.92 : ((linearBlue + 0.055) / 1.055) ** 2.4;

    let luminanceBgColor = (0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue) + 0.05;

    // luminance for txtColor
    linearRed = (txtColor[0] ?? 0) / 255;
    linearGreen = (txtColor[1] ?? 0) / 255;
    linearBlue = (txtColor[2] ?? 0) / 255;

    linearRed = linearRed <= 0.03928 ? linearRed / 12.92 : ((linearRed + 0.055) / 1.055) ** 2.4;
    linearGreen = linearGreen <= 0.03928 ? linearGreen / 12.92 : ((linearGreen + 0.055) / 1.055) ** 2.4;
    linearBlue = linearBlue <= 0.03928 ? linearBlue / 12.92 : ((linearBlue + 0.055) / 1.055) ** 2.4;

    let luminanceTxtColor = (0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue) + 0.05;

    let ratio;

    if (luminanceTxtColor > luminanceBgColor) {
      ratio = luminanceTxtColor / luminanceBgColor;
    } else {
      ratio = luminanceBgColor / luminanceTxtColor;
    }

    setContrastRatio(parseFloat(ratio.toFixed(2)))

  }, [bgColor, txtColor]);

  return (
    <>
      <Settings style={{ display: isSettingsVisible ? 'flex' : 'none' }}>
        <button id='close-settings' className='settings__btn' onClick={e => setIsSettingsVisible(false)}><img src={CloseIcon} className="settings__icon" alt="close settings" /></button>
        <ToggleSwitch
          id='hex-copy-opt'
          labelId='hex-copy-opt-label'
          onChange={handleSettings}
          labelText='Copy hex values without the hash symbol.'
          checked={copyHexWithoutHash}
        >
        </ToggleSwitch>
        <ToggleSwitch
          id='add-color-to-end-opt'
          labelId='add-color-to-end-opt-label'
          onChange={handleSettings}
          labelText='Add colors to the end of the palette instead of the start.'
          checked={addColorToEnd}
        >
          
        </ToggleSwitch>
      </Settings>
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
        <button id='settings' className='modifier__btn' onClick={() => setIsSettingsVisible(true)}>
          <img className='modifier__icon' src={GearIcon} alt="open settings menu" title='open settings menu' />
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
          <button ref={bgButtonRef} className={`colorpicker__btn ${selection === 'background' ? 'modifier__btn--active' : ''}`} onClick={handleSelectionType} data-opt='background'>
            <img src={BackgroundIcon} className={`colorpicker__icon ${selection === 'background' ? 'modifier__icon--active' : ''}`} alt="set background color" />
          </button>
          <button ref={txtButtonRef} className={`colorpicker__btn ${selection === 'text' ? 'modifier__btn--active' : ''}`} onClick={handleSelectionType} data-opt='text'>
            <img src={TextIcon} className={`colorpicker__icon ${selection === 'text' ? 'modifier__icon--active' : ''}`} alt="set background color" />
          </button>
        </div>
        <input
          type="text"
          id='contrast__field'
          value={`Contrast ratio: ${contrastRatio}`}
          style={{
            color: textColor()
          }}
          disabled
          readOnly
        />
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
            onChange={(e) => handleNameChange(e)}
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
          style={{ display: `${selectedPalette === null ? viewLayout : 'none'}` }}
        >
          {palettes}
        </PalettesListView>
        <PaletteDetailView
          style={{ display: `${selectedPalette === null ? 'none' : viewLayout}` }}
          ref={paletteDetailViewRef}
        >
          {colorItems}
        </PaletteDetailView>
      </Editor>
    </>
  );
}