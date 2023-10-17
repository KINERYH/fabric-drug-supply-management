import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import About from "../About.js";
import { NavLink } from "react-router-dom";
import Logout from "../pages/Logout";
import NavLayout from "../NavLayout";
import SignInAlt from "../pages/SignInAlt";


// gestisce il routing
const Routes = () => {
  const { token } = useAuth();

  const routes = [{element:<NavLayout/>, children:[
    { path: "/", element: <Home /> },
    {path:"/signinalt", element: <SignInAlt/>},
    { path: "/signin", element: <SignIn/> },
    {path: "/signup", element: <SignUp />},
    {path: "/about", element: <About/>},
    {path: '*', element: <div>Not Found</div>},
  // route con autorizzazione
    { path: "/", element: <ProtectedRoute />,
      children: [
        {path: "/dashboard",
        element: <div>User Home Page {token}</div>},
        {path: "/profile",
        element: <div>User Profile Page</div>},
        {path: "/logout", element: <Logout />}
    ] }
]}]



  const router = createBrowserRouter(
  routes

  );
  return <RouterProvider router={router} />;
}

export default Routes;