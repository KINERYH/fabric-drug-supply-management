import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import About from "../About.js";
import { NavLink } from "react-router-dom";
import Logout from "../pages/Logout";
import NavLayout from "../NavLayout";


// gestisce il routing
const Routes = () => {
  const { token } = useAuth();
  const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/signin", element: <SignIn/> },
    {path: "/signup", element: <SignUp />},
    {path: "/about", element: <About/>},
    {path: '*', element: <div>Not Found</div>}
  ];

  const AppLayout = () => {
    return (
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
    );
  };

  const privateRoutes = [
    { path: "/", element: <ProtectedRoute />, children: [
      {path: "/", element: <div>Home Page {token}</div>},
      {path: "/dashboard",
      element: <div>User Home Page {token}</div>},
      {path: "/profile",
      element: <div>User Profile Page</div>},
      {path: "/logout", element: <Logout />}
    ] },
  ];

  // TODO: aggiungere il NavLayout
  const router = createBrowserRouter([
    ...publicRoutes,
    ...privateRoutes
  ]
  );
  return <RouterProvider router={router} />;
}

export default Routes;