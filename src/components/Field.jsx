import { useToolTip } from "../contexts/ToolTipContext";
import CopyIcon from '../assets/copy.svg';

/**
 * This component is a wrapper for the input 'text' of a specific color, preceded by a label.
 * @function
 * @param {string} id - ID for the input 'text' element. 
 * @param {string} mainId - ID for the wrapper div element.
 * @param {number|string} value - value for the input element. 
 * @param {function} onChange - callback function.
 * @param {string} textLabel - text content of the label. 
 * @param {string} color - the color this input represents (red, green blue).
 * @param {string} [classLabel] - classes for the label element.
 * @returns {JSX.Element} A wrapper of an input field preceded by a label.
 * @alias Components/Field
*/
export const Field = ({
  id,
  mainId,
  value,
  onChange,
  textLabel,
  color,
  classLabel = 'label--hidden field-container__label'
}) => {
  const { showMessage } = useToolTip();

  async function handleCopy() {

    await navigator.clipboard.writeText(value)
      .then(
        () => {
          showMessage('Copied!', 'ok');
        },
        () => {
          showMessage('Failed! Try again', 'fail')
        });
  }

  async function handlePaste(e) {
    e.preventDefault();

    await navigator.clipboard
      .readText()
      .then((clipText) => {

        onChange(clipText, color);

      });
  }
  return (
    <div className="field-container" id={mainId}>
      <label htmlFor={id} className={classLabel}>{textLabel}</label>
      <div className='field'>
        <input type="text" className="field__input" id={id} value={value} onChange={e => onChange(e.currentTarget.value, color)} data-color={color} onPaste={handlePaste} />
        <button className="field__btn" onClick={handleCopy}>
          <img className='field__icon' src={CopyIcon} alt="copy" />
        </button>
      </div>
    </div>
  );
};

export default Field;