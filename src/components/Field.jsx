import { useToolTip } from "../contexts/ToolTipContext";

export default function Field({ value, onChange, color, id }) {
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
    <div className='field-container' id={id}>
      <input min={0} max={255} value={value} onChange={onChange} onPaste={handlePaste} type='text' data-color={color} />
      <button onClick={handleCopy}>
        <img src='/copy.png'></img>
      </button>
    </div>
  );
}