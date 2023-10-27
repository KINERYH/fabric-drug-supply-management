import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Modal from '@mui/joy/Modal';
import Stack from '@mui/joy/Stack';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import FormControl from '@mui/joy/FormControl';
import { useAuth } from '../provider/authProvider';
import { useNavigate } from 'react-router-dom';

export default function UserCard(props) {
  // gestione del logout
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const [isEditInfoModalOpen, setEditInfoModalOpen] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState({});
  const [isModified, setIsModified] = React.useState(false);

  // Funzione per gestire la modifica dei campi di input
  const handleInputChange = (field, value) => {
    setUserDetails({
      ...userDetails,
      [field]: value,
    });
    setIsModified(true);
  };

  const handleEditInfoModalSubmit = async (event) => {
    // Invia i dati modificati al server
    // Una volta completato con successo, reimposta isModified su false
    // E chiudi il modal
    setIsModified(false);
    setEditInfoModalOpen(false);
  };

  // TODO: non funge
  const populateUserDetails = () => {
    setUserDetails({
      firstName: props.userProfile?.firstName || "",
      lastName: props.userProfile?.lastName || "",
      email: props.userProfile?.email || "",
      cf: props.userProfile?.cf || "",
      address: props.userProfile?.address || "",
      height: props.userProfile?.height || "",
      weight: props.userProfile?.weight || "",
      allergies: props.userProfile?.allergies || "",
      medicalHistory: props.userProfile?.medicalHistory || "",
    });

    console.log("USER DETAILS da stato: ", userDetails);
    console.log("USER DETAILS da props: ", props);
  };
  


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
            src={props.userProfile?.src}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {props.userProfile?.firstName} {props.userProfile?.lastName}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {props.userProfile?.role}
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
                {props.role != 'Manufacturer' ? 'Total prescriptions' : 'Total orders'}
              </Typography>
              <Typography fontWeight="lg">{props.userProfile?.totPrescriptions}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                {props.role != 'Manufacturer' ? 'Pending prescriptions' : 'Pending orders'}
              </Typography>
              <Typography fontWeight="lg">{props.userProfile?.pendingPrescriptions}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                {props.role != 'Manufacturer' ? 'Processed prescriptions' : 'Processed orders'}
              </Typography>
              <Typography fontWeight="lg">{props.userProfile?.processedPrescriptions}</Typography>
            </div>
          </Sheet>
          <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="outlined" color="neutral" onClick={() => {
              setEditInfoModalOpen(true);
              populateUserDetails();
            }}>
              Edit info
            </Button>
            <Button variant="solid" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* TODO: Not reponsive - Edit info modal */}
      <Modal
        open={isEditInfoModalOpen}
        onClose={() => setEditInfoModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalDialog
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            p: 3, // Increase padding
            m: 2, // Increase margin
            display: 'flex',
            bgcolor: 'background.level1',
            borderRadius: 'sm',
            flexDirection: 'column',
          }}
        >
          {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}> */}
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit info
          </Typography> */}
          {/* <IconButton variant="outlined" onClick={() => setEditInfoModalOpen(false)}>Close</IconButton> */}
          {/* </div> */}
          <DialogTitle> User Information</DialogTitle>
          <DialogContent>Visualize and edit the user information.</DialogContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleEditInfoModalSubmit(event);
              setEditInfoModalOpen(false);
            }}
          > 
          <Stack direction='row' style={{ display: 'flex' }}>
            <Stack style={{ flex: 1, margin: '0.5rem'}}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  value={userDetails.firstName}
                  readOnly
                  style={{ marginBottom: '0.5rem' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  value={userDetails.lastName}
                  readOnly
                  style={{ marginBottom: '0.5rem' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  value={userDetails.email}
                  readOnly
                  style={{ marginBottom: '0.5rem' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>CF</FormLabel>
                <Input
                  type="text"
                  value={userDetails.cf}
                  readOnly
                  style={{ marginBottom: '0.5rem' }}
                />
              </FormControl>
            </Stack>
            <Stack style={{ flex: 1, margin: '0.5rem' }}>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={userDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                />
              </FormControl>
              <Stack direction = 'row' style={{ display: 'flex', flex: 1 }}>
                <FormControl>
                  <FormLabel>Height</FormLabel>
                  <Input
                    type="number"
                    value={userDetails.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Weight</FormLabel>
                  <Input
                    type="number"
                    value={userDetails.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                </FormControl>
              </Stack>
              <FormControl>
                <FormLabel>Allergies</FormLabel>
                <Input
                  type="text"
                  value={userDetails.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Medical History</FormLabel>
                <Input
                    type="text"
                    value={userDetails.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </form>
          <Button 
            onClick={handleEditInfoModalSubmit}
            sx={{ mx: 'auto', width: '30%' }}
            >
              Submit</Button>
        </ModalDialog>
      </Modal>




    </Box>
  );
}