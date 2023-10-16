import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import Button from '@mui/joy/Button';



const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    setToken();
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 3 * 1000);

  return (<Button onClick={handleLogout}>Logout</Button>);
};

export default Logout;