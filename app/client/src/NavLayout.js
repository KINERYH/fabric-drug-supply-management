import { NavLink, Outlet } from "react-router-dom";

export default function NavLayout() {
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
          <li>
            <NavLink to="/logout">Logout</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}