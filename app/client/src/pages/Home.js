import * as React from 'react';
import '../css/Home.css';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import UserCard from '../components/UserCard';
import Breadcrumbs from '../components/Breadcrumbs';
import Table from '../components/Table';
import { useAuth } from '../provider/authProvider';



export default function Home() {
  const {token, user, role} = useAuth();

  const defaultState = {
    navigation: [
      { name: 'Dashboard', href: '/' },
      { name: 'TV Shows', href: '#' },
      { name: 'Characters', href: '#' },
      { name: 'Dr. Zoidberg' },
    ],
    userProfile: {
      firstName: 'Alex',
      lastName: 'Morrison',
      src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286',
      role: '{Patient}',
      totPrescriptions: 34,
      pendingPrescriptions: 4,
      processedPrescriptions: 30
    },
    dataTable: {
      header: ['ID', 'Status' ,'Doctor', 'Pharmacy', 'Description'],
      body: [
        [
          { display: '6918bcdb-bf53-4a88-9f11-986b52a72fc4', url: '/api/prescriptions/6918bcdb-bf53-4a88-9f11-986b52a72fc4' },
          { display: 'pending', chipStatus: true },
          { display: 'Pietro Ventr', favicon: true, url: '/api/users/6918bcdb-bf53-4a88-9f11-986b52a72fc4' },
          { display: 'La tua farmacia', favicon: true, url: '/api/users/6918bcdb-bf53-4a88-9f11-986b52a72fc4' },
          { display: 'Tachipirina 500g, 2 volte al giorno'},
        ],
        [
          { display: '6918bcdb-bf53-4a88-9f11-986b52a72fc5', url: '/api/prescriptions/6918bcdb-bf53-4a88-9f11-986b52a72fc4' },
          { display: 'processed', chipStatus: true },
          { display: 'Pietro Ventr', favicon: true, url: '/api/users/6918bcdb-bf53-4a88-9f11-986b52a72fc4' },
          { display: 'La tua farmacia', favicon: true, url: '/api/users/6918bcdb-bf53-4a88-9f11-986b52a72fc4' },
          { display: 'Tachipirina 500g, 2 volte al giorno'},
        ]
      ]
    }
  }

  const [navigation, setNavigation] = React.useState(defaultState.navigation);
  const [userProfileCard, setUserProfileCard] = React.useState(defaultState.userProfile);
  const [dataTable, setDataTable] = React.useState(defaultState.dataTable);
  const [isAddPrescrModalOpen, setAddPrescrModalOpen] = React.useState(false);
  const [isProcPrescrModalOpen, setProcPrescrModalOpen] = React.useState(false);
  const [isAddOrderModalOpen, setAddOrderModalOpen] = React.useState(false);
  const [isProcOrderModalOpen, setProcOrderModalOpen] = React.useState(false);

  //TODO: da finire
  const handleSubmitAddPrescr = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('patientCF'));
    console.log(data.get('description'));
    console.log(data.get('drugsList'));

    try{
      const response = await fetch('http://localhost:3001/api/prescriptions/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          PatientCF: data.get('patientCF'),
          Description: data.get('description'),
          DrugsList: data.get('drugsList'),
        })
      });

    } catch(e) {
      console.error(e);
    }
  }

  const handleSubmitProcPrescr = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const prescriptionID = data.get('prescriptionID');
    try{
      const response = await fetch(`http://localhost:3001/api/prescriptions/${prescriptionID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer '+ token,
          'Content-Type': 'application/json'
        },
      });

      console.log("Response: " + response.status)
    } catch(e) {
      console.error(e);
    }
  }
  
  const fetchUserProfile = async () => {
    try{
      const res = await fetch(`http://localhost:3001/api/users/${user}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (res.status == 200) {
        const result = await res.json();
        console.log("response fetch user");
        console.log(result.data);
        return result.data;
      } else {
        console.error("userProfileFetch status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }
  const fetchPrescriptions = async () => {
    try{
      const res = await fetch("http://localhost:3001/api/prescriptions/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ token,
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch precsrip");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchPrescriptions status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  React.useEffect( () => {
    const fetchData = async () => {
      const userProfile = await fetchUserProfile();
      const prescriptions = await fetchPrescriptions() || [];

      return { userProfile, prescriptions };
    }

    fetchData()
      .then( ({ userProfile, prescriptions }) => {
        console.log("setting profile card")
        setUserProfileCard({
          firstName: userProfile?.Name,
          lastName: userProfile?.Surname,
          src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286',
          role: "Ruolo: " + role,
          totPrescriptions: prescriptions?.length,
          pendingPrescriptions: prescriptions?.filter( p => p.Status === 'pending' ).length,
          processedPrescriptions: prescriptions?.filter( p => p.Status !== 'pending' ).length
        });

        let table;
        switch(role){
          case 'Patient':
            table = {
              header: ['ID', 'Status' ,'Doctor', 'Pharmacy', 'Description'],
              body: prescriptions.map(prescription => [
                { display: prescription?.ID, url: `/prescriptions/${prescription?.ID}` },
                { display: prescription?.Status, chipStatus: true },
                { display: prescription?.DoctorID, favicon: true, url: `/api/users/${prescription?.DoctorID}` },
                { display: prescription?.PharmacyID, favicon: true, url: `/api/users/${prescription?.PharmacyID}` },
                { display: prescription?.Description },
              ])
            }
            break;
          case 'Doctor':
            table = {
              header: ['ID', 'Status', 'Patient', 'Drugs', 'Description'],
              body: prescriptions.map(prescription => [
                { display: prescription?.ID, url: `/prescriptions/${prescription?.ID}` },
                { display: prescription?.Status, chipStatus: true },
                { display: prescription?.PatientID, favicon: true, url: `/api/users/${prescription?.PatientID}` },
                { display: 'More Info', url: `/api/prescriptions/${prescription?.ID}/drugs` },
                { display: prescription?.Description }
              ])
            }
            break;
          case 'Pharmacy':
            table = {
              header: ['ID', 'Status', 'Patient', 'Drugs', 'Description'],
              body: prescriptions.map(prescription => [
                { display: prescription?.ID, url: `/api/prescriptions/${prescription?.ID}` },
                { display: prescription?.Status, chipStatus: true },
                { display: prescription?.PatientID, favicon: true, url: `/api/users/${prescription?.PatientID}` },
                { display: 'More Info', url: `/api/prescriptions/${prescription?.ID}/drugs` },
                { display: prescription?.Description }
              ])
            }
            break;
          case 'Manufacturer':
            table = {}
            break;
          default:
            table = dataTable;
        }
        console.log(table)

        /* farei visualizzare il nome del dottore piuttosto che l'ID, quindi da fare altra chiamata per recuperare
        *  nome del dottore e nome della farmacia
        */
        setDataTable(table);
      });
  }, []);

  return (
    <Box className="Home">
      <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 5 }}>
        {/* <Breadcrumbs navigation={ navigation } /> */}
        <Box sx={{ maxWidth: '60%' }}>
          <UserCard userProfile={ userProfileCard } />
        </Box>
        <div>
          <Box sx={{ maxWidth: '100%', display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ minWidth: '50%' }}>
              <Typography level="h4" textAlign="left" sx={{ mb: 2, marginBottom: 0 }}>
                Current prescriptions.
              </Typography>
            </Box>
            <Box sx={{ minWidth: '50%', display: 'flex', justifyContent: 'right', marginBottom:'8px' }}>
              <ButtonGroup variant="solid" color="primary">
                {role === "Doctor" && (
                  <Button onClick={() => setAddPrescrModalOpen(true)}>Add prescription</Button>
                )}
                {role === "Pharmacy" && (
                  <>
                  <Button onClick={() => setProcPrescrModalOpen(true)}>Process prescription</Button>
                  <Button>Add order</Button>
                  <Button>Process Order</Button>
                  </>
                )}
              </ButtonGroup>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 250, }} >
            <Table dataTable={ dataTable } />
          </Box>
        </div>
      </Box>

      {/* TODO: finire -> Add prescription Modal */}
      <Modal open={isAddPrescrModalOpen} onClose={() => setAddPrescrModalOpen(false)}>
        <ModalDialog style={{ width: "60%" }}>
          <DialogTitle>Create new prescription</DialogTitle>
          <DialogContent>Fill in the prescription information.</DialogContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmitAddPrescr(event);
              setAddPrescrModalOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Patient CF</FormLabel>
                <Input name="patientCF" autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Enter a description of the prescription"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Drug List</FormLabel>
                <textarea
                  // TODO: Boundare la massima estensione della textarea a quella massima del modal
                  name="drugsList"
                  rows="4"
                  placeholder="Enter a list of drugs"
                  required
                />
              </FormControl>
              <Button type="submit">Submit</Button>
              {/* <Button type="submit" onClick={handleSubmitAddPrescr}>Submit</Button> */}
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Process prescription Modal */}
      <Modal open={isProcPrescrModalOpen} onClose={() => setProcPrescrModalOpen(false)}>
        <ModalDialog style={{ width: "60%" }}>
          <DialogTitle>Process a prescription</DialogTitle>
          <DialogContent>Insert the prescription ID.</DialogContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmitProcPrescr(event);
              // TODO: far apparire un messaggio di successo + aggiornare la tabella delle prescrizioni
              setProcPrescrModalOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Prescription ID</FormLabel>
                <Input autoFocus required name="prescriptionID"/>
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>


    </Box>

  );
}