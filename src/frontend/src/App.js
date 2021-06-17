import './App.css';
import {BrowserRouter as Router} from 'react-router-dom'
import NavBar from './components/Navbar'

function App() {
  return (
    <Router>
    <div className="App">
      <NavBar />
      <header className="App-header">

      </header>
    </div>
    </Router>
  );
}

export default App;
