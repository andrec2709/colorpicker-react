import { useToolTip } from "../contexts/ToolTipContext";
import CopyIcon from '../assets/copy.svg';

export const Field = ({ id, mainId, value, onChange, textLabel, color, classLabel = 'label--hidden field-container__label' }) => {
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