import { BrowserRouter } from 'react-router-dom';
import Admin from './pages/Admin';
import 'core-js/stable';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Admin />
    </BrowserRouter>
  );
};

export default App;