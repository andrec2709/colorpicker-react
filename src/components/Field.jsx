import { useToolTip } from "../contexts/ToolTipContext";

export const Field = ({ id, value, onChange, textLabel, color, classLabel = 'visually-hidden' }) => {
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
        const color = e.target.dataset.color;

        switch (color) {
          case 'hex':
            clipText = clipText.replace('#', '');
            e.target.value = `#${clipText.slice(0, 6)}`;
            break;
          default:
            e.target.value = clipText;
            break;
        }
      });
  }
  return (
    <div className="field-wrapper-label">
      <label htmlFor={id} className={classLabel}>{textLabel}</label>
      <div className='field-container'>
        <input type="text" id={id} value={value} onChange={onChange} data-color={color} onPaste={handlePaste} />
        <button className="copy-btn" onClick={handleCopy}>
          <img src="/copy.png" alt="copy" />
        </button>
      </div>
    </div>
  );
};

export default Field;