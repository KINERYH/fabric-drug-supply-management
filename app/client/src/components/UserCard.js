import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { useAuth } from '../provider/authProvider';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '@mui/joy/ModalDialog';
import Modal from '@mui/joy/Modal';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import FormControl from '@mui/joy/FormControl';
import { FormLabel } from '@mui/material';
import Input from '@mui/joy/Input';

export default function UserCard(props) {
  // gestione del logout
  const {setToken, setUser } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
     setToken();
     setUser();
     navigate("/");
  }
  return (
    <Box sx={{ width: '100%' }} >
      <Card
        orientation="horizontal"
        sx={{
          width: '100%',
          flexWrap: 'wrap'
        }}
      >
        <AspectRatio flex ratio="1" maxHeight={70} sx={{ minWidth: 150 }}>
          <img
            src={ props.userProfile?.src }
            loading="lazy"
            alt=""
          />
        </AspectRatio>
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            { props.userProfile?.firstName } { props.userProfile?.lastName }
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            { props.userProfile?.role }
          </Typography>
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                { (props.role != 'Manufacturer' && props.role != 'Pharmacy') ? 'Total prescriptions' : 'Total orders'}
              </Typography>
              <Typography fontWeight="lg">{ props.userProfile?.totPrescriptions }</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                { (props.role != 'Manufacturer' && props.role != 'Pharmacy') ? 'Pending prescriptions' : 'Pending orders'}
              </Typography>
              <Typography fontWeight="lg">{ props.userProfile?.pendingPrescriptions }</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                { (props.role != 'Manufacturer' && props.role != 'Pharmacy') ? 'Processed prescriptions' : 'Processed orders'}
              </Typography>
              <Typography fontWeight="lg">{ props.userProfile?.processedPrescriptions }</Typography>
            </div>
          </Sheet>
          <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="outlined" color="neutral" onClick={props.action}>
              {(props.role != 'Doctor') ? 'Edit Info' : 'Get patient info'}
            </Button>
            <Button variant="solid" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
