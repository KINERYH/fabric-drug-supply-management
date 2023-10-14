import './App.css';
import {Link, Route, Routes, NavLink} from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';

function App() {
  return (
    <>
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Registrati</NavLink>
        </li>
        <li>
          <NavLink to="/signin">Login</NavLink>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path='*'>Not Found</Route>

    </Routes>
    </>
  )

}

export default App;
