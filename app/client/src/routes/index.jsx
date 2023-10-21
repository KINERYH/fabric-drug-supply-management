import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import InitPage from "../pages/InitPage";
import Home from "../pages/Home";
import About from "../pages/About.js";
import NavLayout from "../components/NavLayout";
import { useAuth } from '../provider/authProvider';


// gestisce il routing
const Routes = () => {
  const {token, user}  = useAuth();

  const NonProtectedRoutes = [
    { path: "/", element:
      <InitPage user={user} token={token}/>
    },
    { path: "/about", element: <About/>},
    { path: '*', element: <div>Not Found</div>}
  ]

  const protectedRoutes = [
    { path: "/", element: <ProtectedRoute />,
      children: [
        { path: "/home",
          element: <Home />
        },
      ] 
    }];

  //route solo per utenti non loggati
  const routesNonAuth = [
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp />},
  ];

  const routes = [{element:<NavLayout/>, children:[
    ...NonProtectedRoutes,
    ...( (!token || token == undefined) ? routesNonAuth : []),
    ...protectedRoutes
  ]
  }];

  const router = createBrowserRouter( routes );
  return <RouterProvider router={router} />;
}

export default Routes;