import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import About from "../About.js";
import Logout from "../pages/Logout";
import NavLayout from "../NavLayout";
import Dashboard from "../pages/Dashboard";


// gestisce il routing
const Routes = () => {

  const routes = [{element:<NavLayout/>, children:[
    { path: "/", element: <Home /> },
    { path: "/signin", element: <SignIn/> },
    {path: "/signup", element: <SignUp />},
    {path: "/about", element: <About/>},
    {path: '*', element: <div>Not Found</div>},
  // route con autorizzazione
    { path: "/", element: <ProtectedRoute />,
      children: [
        {path: "/home",
        element: <Home />},
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