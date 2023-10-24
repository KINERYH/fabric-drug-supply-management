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
import WarningIcon from '@mui/icons-material/Warning';
import Add from '@mui/icons-material/Add';
import UserCard from '../components/UserCard';
import Breadcrumbs from '../components/Breadcrumbs';
import Table from '../components/Table';
import Autocomplete from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import Alert from '@mui/joy/Alert';
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
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
  const [selectedDrugs, setSelectedDrugs] = React.useState([]);


  //TODO: mettere una duration di default appropriata
  const showAlertMessage = (message, type, duration = 10000) => {
    // Determine which state variables to set based on the type
    const showStateVariable = type === 'success' ? setShowSuccessAlert : type === 'error' ? setShowErrorAlert : null;
  
    if (showStateVariable) {
      setAlertMessage(message);
      showStateVariable(true);
  
      setTimeout(() => {
        showStateVariable(false);
        setAlertMessage('');
      }, duration);
    }
  }
  

  const handleSubmitAddPrescr = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('patientCF'));
    console.log(data.get('description'));
    // console.log(data.get('drugsList'));

    const drugs = [];
    for(const drug of selectedDrugs){
      drugs.push({
        DrugID: drug.DrugID,
        Quantity: drug.Quantity
      });
    }

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
          DrugsList: JSON.stringify(drugs),
        })
      });

      if(response.status == 201) {
        showAlertMessage("Prescription created successfully", 'success');
      } else {
        const errorResponse = await response.json();
        if(errorResponse && errorResponse.message){
          showAlertMessage(errorResponse.message, 'error');
        } else {
          // In case of generic/unknown error
          showAlertMessage("Error creating prescription", 'error');
        }
      }
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

      if(response.status == 200) {
        showAlertMessage("Prescription processed successfully", 'success');
      } else {
        // TODO: gestire la propagazione degli errori
        const errorResponse = await response.json();
        if(errorResponse && errorResponse.message){
          showAlertMessage(errorResponse.message, 'error');
        } else {
          // In case of generic/unknown error
          showAlertMessage("Error processing prescription", 'error');
        }
      }
    } catch(e) {
      console.error(e);
      showAlertMessage("An error occurred while processing the prescription.", 'error');
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


  const fetchAllDrugs = async () => {
    try{
      const res = await fetch("http://localhost:3001/api/drugs/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ token,
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch drugs");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchAllDrugs status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }

  }

  // Update the data table
  const updateDataTable = async () => {
    const prescriptions = await fetchPrescriptions() || [];
    
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

    setDataTable(table);
    setOrderTable(tableOrders);

  }

  React.useEffect( () => {
    const fetchData = async () => {
      const userProfile = await fetchUserProfile();
      const prescriptions = await fetchPrescriptions() || [];
      let options = [];
      let orders = [];
      if(role === "Doctor") {
        options = await fetchAllDrugs() || [];
      }
      setAutocompleteOptions(options);
      if(role ==="Pharmacy") {
        orders = await fetchOrders() || [];
      }


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


        //TODO: mettere setOrderTable
        updateDataTable(role, prescriptions, setDataTable);


        /* farei visualizzare il nome del dottore piuttosto che l'ID, quindi da fare altra chiamata per recuperare
        *  nome del dottore e nome della farmacia
        */
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
            <Box sx={{ minWidth: '50%', display: 'flex', justifyContent: 'right', marginBottom: '8px' }}>
              <ButtonGroup variant="solid" color="primary">
                {role === "Doctor" && (
                  <Button onClick={() => setAddPrescrModalOpen(true)}>Add prescription</Button>
                )}
                {role === "Pharmacy" && (
                  <>

                  <Button onClick={() => setProcPrescrModalOpen(true)}>Process prescription</Button>
                  <Button onClick={setAddOrderModalOpen}>Add order</Button>
                  <Button onClick={setProcOrderModalOpen}>Process Order</Button>
                  </>
                )}
              </ButtonGroup>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 250, }} >
            <Stack spacing={5}>
            <Table dataTable={dataTable} />
              { orderTable &&
              <Typography level="h4" textAlign="left" mb={1}>
                Current orders.
              </Typography>
            }
            <Table dataTable={ orderTable } />
            </Stack>
          </Box>
        </div>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '90%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}>
          {showSuccessAlert && (
            <Alert
              variant="soft"
              color="success"
              startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
            >
              {alertMessage}
            </Alert>)}
          {showErrorAlert && (
            <Alert
            variant="soft"
            color="danger"
            startDecorator={<WarningIcon />}
          >
              {alertMessage}
            </Alert>)}
        </Box>


      </Box>



      {/* TODO: finire -> Add prescription Modal */}
      <Modal open={isAddPrescrModalOpen} onClose={() => {
        setAddPrescrModalOpen(false);
        setSelectedDrugs([]);
        }}>
        <ModalDialog style={{ width: "60%" }}>
          <DialogTitle>Create new prescription</DialogTitle>
          <DialogContent>Fill in the prescription information.</DialogContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmitAddPrescr(event);
              setAddPrescrModalOpen(false);
              updateDataTable();
              setSelectedDrugs([]);
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
                  style={{ maxWidth: "100%", minWidth: "100%" }}
                  placeholder="Enter a description of the prescription"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Drugs List</FormLabel>
                <Autocomplete
                  placeholder="Select a drug"
                  slotProps={{
                    input: {
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    },
                  }}
                  options={autocompleteOptions}
                  autoHighlight
                  getOptionLabel={(option) => option.Name}
                  renderOption={(props, option) => (
                    <AutocompleteOption {...props}>
                      <ListItemContent sx={{ fontSize: 'sm' }}>
                        {option.Name}
                        <Typography level="body-xs">
                          {option.DrugID}
                        </Typography>
                      </ListItemContent>
                    </AutocompleteOption>
                  )}
                  onChange={(event, selectedOption) => {
                    if (selectedOption) {
                      setSelectedDrugs([...selectedDrugs, selectedOption]);
                      event.target.value = ''; // Clear the input
                    }
                  }}
                    />
              </FormControl>
              {selectedDrugs.length > 0 && (<FormControl>
                <FormLabel sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Selected Drugs</FormLabel>
                <table style={{ borderCollapse: 'collapse', width: '50%' }}>
                  <tbody>
                    {selectedDrugs.map((selectedDrug, index) => (
                      <tr key={index}>
                        <td style={{ width: 'auto' }}>{selectedDrug.Name}</td>
                        <td style={{ width: '100px', padding: '0' }}>
                          <Input
                            sx={{ width: '100px' }}
                            type="number"
                            min="1"
                            value={selectedDrug.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value, 10);
                              if (!isNaN(newQuantity)) {
                                const updatedDrugs = [...selectedDrugs];
                                updatedDrugs[index].Quantity = newQuantity;
                                setSelectedDrugs(updatedDrugs);
                              }
                            }}
                          />
                        </td>
                        <td style={{ width: '70px' }}>
                          <Button
                            variant="solid"
                            color="primary"
                            onClick={() => {
                              const updatedDrugs = [...selectedDrugs];
                              updatedDrugs.splice(index, 1);
                              setSelectedDrugs(updatedDrugs);
                            }}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </FormControl>
              )}

              <Button type="submit">Submit</Button>
              {/* <Button type="submit" onClick={handleSubmitAddPrescr}>Submit</Button> */}
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Process prescription Modal */}
      <Modal open={isProcPrescrModalOpen} 
      onClose={() => setProcPrescrModalOpen(false)}>
        <ModalDialog style={{ width: "60%" }}>
          <DialogTitle>Process a prescription</DialogTitle>
          <DialogContent>Insert the prescription ID.</DialogContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmitProcPrescr(event);
              setProcPrescrModalOpen(false);
              updateDataTable();

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