import { NavLink } from "react-router-dom";

export default function NavLayout() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/users">Users</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Sign In</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}