import './App.css';
import ColorName from './components/ui/ColorName';
import Colorpicker from './components/ui/Colorpicker';
import Editor from './components/ui/Editor';
import Preview from './components/ui/Preview';


function App() {

  return (
    <>
      <ColorName />
      <Preview />
      <Colorpicker />
      <Editor />
    </>
  );
}

export default App;