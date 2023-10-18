import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // check if user is logged in
  if(!token) {
    return <Navigate to="/login" />;
  }

  // if user is logged in, render the protected page
  //Oulet is a placeholder for the child routes
  return <Outlet />;
};