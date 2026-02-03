import './App.css';
import ColorName from './components/ui/ColorName';
import Colorpicker from './components/ui/Colorpicker';
import Credits from './components/ui/Credits';
import Editor from './components/ui/Editor';
import Preview from './components/ui/Preview';
import Settings from './components/ui/Settings';


function App() {

  return (
    <>
      <ColorName />
      <Preview />
      <Colorpicker />
      <Editor />
      <Settings />
      <Credits />
    </>
  );
}

export default App;