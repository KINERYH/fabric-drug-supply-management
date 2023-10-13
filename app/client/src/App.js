import './App.css';
import {Link, Route, Routes} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Persona from './Persona';

function App() {
  return (
    <>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li><Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/kvnwlvwrn">Errore</Link>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/about/:id" element={<Persona />} />
      <Route path='about'>
        <Route path=':id' element={<Persona/>}></Route>
      </Route>
      <Route path='*'>Not Found</Route>

    </Routes>
    </>
  )

}

export default App;
