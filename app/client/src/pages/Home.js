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

  // const [navigation, setNavigation] = React.useState(defaultState.navigation);
  const [userProfileCard, setUserProfileCard] = React.useState(null);
  const [dataTable, setDataTable] = React.useState(null);
  const [orderTable, setOrderTable] = React.useState(null);
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
  const fetchUserInfo = async (userId) => {
    try{
      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
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

  const fetchOrders = async () => {
    try{
      const res = await fetch("http://localhost:3001/api/orders/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ token,
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch orders");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchOrders status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }

  }

  React.useEffect( () => {
    const fetchData = async () => {
      const userProfile = await fetchUserProfile();
      const prescriptions = await fetchPrescriptions() || [];
      const orders = await fetchOrders() || [];

      const doctors = await Promise.all(
        prescriptions?.map(async (prescription) => {
          const doctorInfo = await fetchUserInfo(prescription?.DoctorID);
          console.log(doctorInfo);
          return { ...doctorInfo, prescriptionId: prescription.ID };
        })
      )
      const patients = await Promise.all(
        prescriptions?.map(async (prescription) => {
          const patientInfo = await fetchUserInfo(prescription?.PatientID);
          console.log(patientInfo);
          return { ...patientInfo, prescriptionId: prescription.ID };
        })
      )

      const pharmacies = await Promise.all(
        prescriptions?.map(async (prescription) => {
          if (prescription?.Status === 'processed') {
            const pharmacyInfo = await fetchUserInfo(prescription?.PharmacyID);
            console.log(pharmacyInfo);
            return { ...pharmacyInfo, prescriptionId: prescription.ID };
          }
        })
      )
      
      return { userProfile, prescriptions, orders, doctors, patients, pharmacies };
    }


    fetchData()
      .then( ({ userProfile, prescriptions, orders, doctors, patients, pharmacies }) => {
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
        let tableOrders;
        switch(role){
          case 'Patient': 
            table = {
              header: ['ID', 'Status' ,'Doctor', 'Pharmacy', 'Description'],
              body: prescriptions.map(prescription => [
                { display: prescription?.ID, url: `/prescriptions/${prescription?.ID}` },
                { display: prescription?.Status, chipStatus: true },
                { display: doctors.find(d => d?.prescriptionId === prescription?.ID)?.Surname, favicon: true },
                { display: pharmacies.find(p => p?.prescriptionId === prescription?.ID)?.Name, favicon: true },
                { display: prescription?.Description },
              ])
            }
            break;
          case 'Doctor':
            table = {
              header: ['ID', 'Status', 'Patient', 'Pharmacy', 'Description'],
              body: prescriptions.map(prescription => [
                { display: prescription?.ID, url: `/prescriptions/${prescription?.ID}` },
                { display: prescription?.Status, chipStatus: true },
                { display: patients.find(p => p?.prescriptionId === prescription?.ID)?.Surname, favicon: true },
                { display: pharmacies.find(p => p?.prescriptionId === prescription?.ID)?.Name, favicon: true },
                { display: prescription?.Description }
              ])
            }
            break;
          case 'Pharmacy':
            table = {
              header: ['ID', 'Status', 'Patient', 'Doctor', 'Description'],
              body: prescriptions.map(prescription => [
                { display: prescription?.ID, url: `/prescriptions/${prescription?.ID}` },
                { display: prescription?.Status, chipStatus: true },
                { display: patients.find(p => p?.prescriptionId === prescription?.ID)?.Surname, favicon: true },
                { display: doctors.find(d => d?.prescriptionId === prescription?.ID)?.Surname, favicon: true },
                { display: prescription?.Description }
              ])
            }

            tableOrders = {
              header: ['ID', 'Status', 'Manufacturer', 'Description'],
              body: orders.map(order => [
                { display: order?.ID, url: `/orders/${order?.ID}` },
                { display: order?.Status, chipStatus: true },
                { display: order?.ManufacturerID, favicon: true },
                { display: order?.Description }
              ])
            }
            break;
          case 'Manufacturer':
            table = {}
            break;
          default:
            table = dataTable;
            tableOrders = orderTable;
        }
        console.log(table)

        /* farei visualizzare il nome del dottore piuttosto che l'ID, quindi da fare altra chiamata per recuperare
        *  nome del dottore e nome della farmacia
        */
        setDataTable(table);
        setOrderTable(tableOrders);
      });
  }, []);

  return (
    <Box className="Home">
      <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 5 }}>
        {/* <Breadcrumbs navigation={ navigation } /> */}
        <Box sx={{ maxWidth: '60%' }}>
          <UserCard userProfile={ userProfileCard } />
        </Box>
        <Stack>
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
                  <Button  onClick={setAddOrderModalOpen}>Add order</Button>
                  <Button onClick={setProcOrderModalOpen}>Process Order</Button>
                  </>
                )}
              </ButtonGroup>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 250}} >
            <Stack spacing={5}>
            <Table dataTable={ dataTable } />
            
            { orderTable &&
              <Typography level="h4" textAlign="left" mb={1}>
                Current orders.
              </Typography>
            }
            <Table dataTable={ orderTable } />
            </Stack>
          </Box>
        </div>
        </Stack>
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