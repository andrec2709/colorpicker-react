import { useToolTip } from "../contexts/ToolTipContext.jsx";
import CopyIcon from '../assets/copy.svg';
import { useSettings } from "../contexts/SettingsContext.jsx";

type Props = {
  id: string;
  mainId: string;
  value: number | string;
  onChange: (value: number | string, color: string, modifierAllowed?: boolean) => void;
  textLabel: string;
  color: string;
  classLabel?: string;
}

export const Field = ({
  id,
  mainId,
  value,
  onChange,
  textLabel,
  color,
  classLabel = 'label--hidden field-container__label'
}: Props) => {
  const { showMessage } = useToolTip();
  const { copyHexWithoutHash } = useSettings();

  async function handleCopy() {
    let copy = copyHexWithoutHash ? String(value).replace('#', '') : value;

    await navigator.clipboard.writeText(String(copy)).then(
      () => showMessage('Copied!', 'ok'),
      () => showMessage('Failed! Try again', 'fail')
    );
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
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