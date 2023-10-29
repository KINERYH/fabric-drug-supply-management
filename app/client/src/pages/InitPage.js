import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import { useAuth } from '../provider/authProvider';
import { useNavigate } from 'react-router-dom';

export default function InitPage(props) {
  
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setToken();
    setUser();
    navigate("/");
  }

  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap: 2, alignItems:'center', justifyContent:'center', minHeight:'80vh', maxWidth: '100%' }}>
      <Typography level="h1" fontSize="54px">Fabric Drug Supply Management</Typography>
        <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          { ["Pietro Ventrella", "Francesco Diana", "Fabrizio Bottalico"].map((member) => (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Avatar size="sm">{ member.charAt(0) }</Avatar>
              <Typography level="h3" fontSize="xl" sx={{ mb: 0.5 }}>{ member }</Typography>
            </Box>
          ))}
        </Box>
      <Typography>
        Current User: {props.user}
      </Typography>
      <Typography sx={{ maxWidth: '50%', overflow: 'hidden'}}>
        Current Token: {props.token}
      </Typography>
      <Button onClick={handleLogout}>Logout</Button>
    </Box>
  );
}