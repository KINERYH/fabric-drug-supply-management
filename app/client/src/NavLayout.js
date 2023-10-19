import { NavLink, Outlet } from "react-router-dom";

export default function NavLayout() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Pagina Iniziale</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Registrati</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Login</NavLink>
          </li>
          <li>
            <NavLink to="/home">User Home</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}