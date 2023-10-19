import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import About from "../About.js";
import NavLayout from "../NavLayout";
import { useAuth } from '../provider/authProvider';


// gestisce il routing
const Routes = () => {
  const {token}  = useAuth();

  const NonProtectedRoutes = [
    { path: "/", element:<div>Pagina Iniziale {token}</div> },
    {path: "/about", element: <About/>},
    {path: '*', element: <div>Not Found</div>}]

  const protectedRoutes = [
    { path: "/", element: <ProtectedRoute />,
      children: [
        {path: "/home",
        element: <Home />},
    ] }];

  //route solo per utenti non loggati
  const routesNonAuth = [
    { path: "/signin", element: <SignIn/> },
    {path: "/signup", element: <SignUp />},
  ];

  const routes = [{element:<NavLayout/>, children:[
    ...NonProtectedRoutes,
    ...(!token? routesNonAuth : []),
    ...protectedRoutes
  ]
  }];

  const router = createBrowserRouter(
  routes
  );
  return <RouterProvider router={router} />;
}

export default Routes;