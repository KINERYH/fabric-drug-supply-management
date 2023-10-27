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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Fab from '@mui/material/Fab';




export default function Home() {
  const { token, user, role } = useAuth();

  // const [navigation, setNavigation] = React.useState(defaultState.navigation);
  const [userProfileCard, setUserProfileCard] = React.useState(null);
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [pharmacies, setPharmacies] = React.useState([]);
  const [drugs, setDrugs] = React.useState([]);
  const [dataTable, setDataTable] = React.useState(null);
  const [orderTable, setOrderTable] = React.useState(null);
  const [storageTable, setStorageTable] = React.useState(null);
  const [isAddPrescrModalOpen, setAddPrescrModalOpen] = React.useState(false);
  const [isProcPrescrModalOpen, setProcPrescrModalOpen] = React.useState(false);
  const [isAddOrderModalOpen, setAddOrderModalOpen] = React.useState(false);
  const [isProcOrderModalOpen, setProcOrderModalOpen] = React.useState(false);
  const [isBoxInfoModalOpen, setBoxInfoModalOpen] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);
  const [autocompleteManOptions, setAutocompleteManOptions] = React.useState([]);
  const [selectedDrugs, setSelectedDrugs] = React.useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = React.useState(null);
  const [selectedOrderID, setSelectedOrderID] = React.useState(null);
  const [selectedDrugName, setSelectedDrugName] = React.useState(null);
  const [boxList, setBoxList] = React.useState(null);


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

  // open process order modal and autofill the orderID field
  const openModalWithOrderID = (orderID, state) => {
    setSelectedOrderID(orderID);
    setProcOrderModalOpen(state);
  };

  const handleShipOrder = async(orderId) => {
    console.log("============== HANDLE SHIP ORDER ===============")
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (res.status == 200) {
        showAlertMessage("Order shipped successfully", 'success');
        updateDataTables();
        return;
      } else {
        const errorResponse = await res.json();
        if (errorResponse && errorResponse.error) {
          showAlertMessage(errorResponse.error, 'error');
        } else {
          // In case of generic/unknown error
          showAlertMessage("Error shipping order", 'error');
        }
        console.error("patchOrder status code: " + res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleSubmitAddPrescr = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('patientCF'));
    console.log(data.get('description'));
    // console.log(data.get('drugsList'));

    const drugs = [];
    for (const drug of selectedDrugs) {
      drugs.push({
        DrugID: drug.DrugID,
        Quantity: drug.Quantity
      });
    }

    try {
      const response = await fetch('http://localhost:3001/api/prescriptions/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          PatientCF: data.get('patientCF'),
          Description: data.get('description'),
          DrugsList: JSON.stringify(drugs),
        })
      });

      if (response.status == 201) {
        showAlertMessage("Prescription created successfully", 'success');
      } else {
        const errorResponse = await response.json();
        if (errorResponse && errorResponse.message) {
          showAlertMessage(errorResponse.message, 'error');
        } else {
          // In case of generic/unknown error
          showAlertMessage("Error creating prescription", 'error');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

    // handle  Add Order
    const handleSubmitAddOrder = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log(data.get('ManufacturerID'));
      console.log(data.get('description'));

      const drugs = [];
      for (const drug of selectedDrugs) {
        drugs.push({
          DrugID: drug.DrugID,
          Quantity: drug.Quantity,
          BoxIDs:[]
        });
      }

      try{
        const response = await fetch('http://localhost:3001/api/orders/', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ManufacturerID: data.get('ManufacturerID'),
            PharmacyID: user,
            Description: data.get('description'),
            Drugs: JSON.stringify(drugs),
          })
        });

        if (response.status == 201) {
          showAlertMessage("Order created successfully", 'success');
        }
        else{
          showAlertMessage("Error creating order", 'error');
        }
      }
      catch(e){
        console.error(e);
      }
    }

  const handleSubmitProcPrescr = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data)
    const prescriptionID = data.get('prescriptionID');
    try {
      const response = await fetch(`http://localhost:3001/api/prescriptions/${prescriptionID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
      });

      if (response.status == 200) {
        showAlertMessage("Prescription processed successfully", 'success');
      } else {
        // TODO: gestire la propagazione degli errori
        const errorResponse = await response.json();
        if (errorResponse && errorResponse.message) {
          showAlertMessage(errorResponse.message, 'error');
        } else {
          // In case of generic/unknown error
          showAlertMessage("Error processing prescription", 'error');
        }
      }
    } catch (e) {
      console.error(e);
      showAlertMessage("An error occurred while processing the prescription.", 'error');
    }
  }

  const handleSubmitProcOrder = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const orderID = data.get('orderID');
    try{
      const response = await fetch(`http://localhost:3001/api/orders/${orderID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer '+ token,
          'Content-Type': 'application/json'
        },
      });

      if (response.status == 201) {
        showAlertMessage("Order processed successfully", 'success');
      } else {
        const errorResponse = await response.json();
        if (errorResponse && errorResponse.message) {
          showAlertMessage(errorResponse.message, 'error');
        } else {
          // In case of generic/unknown error
          showAlertMessage("Error processing order", 'error');
        }
      }
      console.log("Response: " + response.status)
    } catch(e) {
      console.error(e);
    }
  }

  const fetchUserProfile = async () => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  }
  // get all the info about boxes in a list
  const fetchBoxesInfo = async (boxIds) => {
    try {
      const res = await fetch(`http://localhost:3001/api/boxes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (res.status == 200) {
        const result = await res.json();
        const info = result.data;
        let allInfo = [];
        for (let boxId of boxIds) {
          let boxInfo = info.find(b => b.BoxID === boxId);
          allInfo.push(boxInfo);
        }
        console.log("allInfo");
        console.log(Array.isArray(allInfo));
        console.log(JSON.stringify(allInfo));
        return allInfo;
      } else {
        console.error("boxInfoFetch status code: " + res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }


  const fetchUserInfo = async (userId) => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  }
  const fetchPrescriptions = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/prescriptions/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
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
    } catch (e) {
      console.error(e);
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/orders/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
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
    } catch (e) {
      console.error(e);
    }

  }

  // fetching drug info
  const fetchDrugInfo = async (drugId) => {
    try{
      const res = await fetch(`http://localhost:3001/api/drugs/${drugId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        return data.data;
      } else {
        console.error("fetchDrugInfo status code: " + res.status);
      }
    } catch(e){
      console.error(e);
    }
  }

  // fetching drugs in the pharmacy storage
  const fetchStorage = async () => {
    try{
      const pharmacyInfo = await fetchUserInfo(user);

      const storage = pharmacyInfo.DrugStorage
      for (let drug of storage) {
        let drugInfo = await fetchDrugInfo(drug.DrugID);
        drug.Name = drugInfo.Name;
        drug.ManufacturerID = drugInfo.ManufacturerID;
      }


      console.log("storage");
      console.log(storage);

      return storage;
    }
    catch(e){
      console.error(e);
    }

  }

  const fetchAllManufacturers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch manufacturers");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchAllManufacturers status code: " + res.status);
      }
    } catch (e) {
      console.error(e);
    }
  }


  const fetchAllDrugs = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/drugs/", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
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
    } catch (e) {
      console.error(e);
    }

  }

  // Update the data table
  const updateDataTables = async () => {
    let orders = [];
    let prescriptions = [];
    if (role != "Manufacturer") {
      prescriptions = await fetchPrescriptions() || [];
    }
    if (role === "Pharmacy" || role === "Manufacturer") {
      orders = await fetchOrders() || [];
    }

    setOrders(orders);
    setPrescriptions(prescriptions);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const userProfile = await fetchUserProfile();
      let prescriptions = [];
      if (role != "Manufacturer") {
        prescriptions = await fetchPrescriptions() || [];
      }
      let options = [];
      let manOptions = [];
      let orders = [];
      let drugs = [];
      if (role === "Doctor" || role === "Pharmacy") {
        options = await fetchAllDrugs() || [];
      }
      setAutocompleteOptions(options);
      if (role === "Pharmacy" || role === "Manufacturer") {
        orders = await fetchOrders() || [];
        drugs = await fetchStorage() || [];
      }

      if (role === "Pharmacy") {
        manOptions = await fetchAllManufacturers() || [];
      }
      setAutocompleteManOptions(manOptions);

      let doctors = []
      let patients = []
      if (role != "Manufacturer") {
        doctors = await Promise.all(
          prescriptions?.map(async (prescription) => {
            const doctorInfo = await fetchUserInfo(prescription?.DoctorID);
            console.log(doctorInfo);
            return { ...doctorInfo, prescriptionId: prescription.ID };
          })
        )
        patients = await Promise.all(
          prescriptions?.map(async (prescription) => {
            const patientInfo = await fetchUserInfo(prescription?.PatientID);
            console.log(patientInfo);
            return { ...patientInfo, prescriptionId: prescription.ID };
          })
        )
      }

      let pharmacies = []
      if (role != "Manufacturer") {
        pharmacies = await Promise.all(
          prescriptions?.map(async (prescription) => {
            if (prescription?.Status === 'processed') {
              const pharmacyInfo = await fetchUserInfo(prescription?.PharmacyID);
              console.log(pharmacyInfo);
              return { ...pharmacyInfo, prescriptionId: prescription.ID };
            }
          })
        )
      } else {
        pharmacies = await Promise.all(
          orders?.map(async (order) => {
            const pharmacyInfo = await fetchUserInfo(order?.PharmacyID);
            console.log(pharmacyInfo);
            return { ...pharmacyInfo, orderId: order.ID };
          })
        )
      }

      return { userProfile, prescriptions, orders, drugs, doctors, patients, pharmacies };
    }


    fetchData()
      .then(({ userProfile, prescriptions, orders, drugs, doctors, patients, pharmacies }) => {
        console.log("setting profile card");
        console.log(orders);
        console.log(orders?.filter(o => o.Status === 'pending').length);
        console.log(orders?.filter(o => o.Status !== 'pending').length);
        setUserProfileCard({
          firstName: userProfile?.Name,
          lastName: userProfile?.Surname,
          src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286',
          role: "Role: " + role,
          totPrescriptions: (role != 'Manufacturer' && role != 'Pharmacy') ? prescriptions?.length : orders?.length,
          pendingPrescriptions:  (role != 'Manufacturer' && role != 'Pharmacy') ?
            prescriptions?.filter(p => p.Status === 'pending').length :
            orders?.filter(o => o.Status === 'pending').length ,
          processedPrescriptions:  (role != 'Manufacturer' && role != 'Pharmacy') ?
            prescriptions?.filter(p => p.Status !== 'pending').length :
            orders?.filter(o => o.Status !== 'pending').length
        });

        setOrders(orders);
        setDrugs(drugs);
        setDoctors(doctors);
        setPatients(patients);
        setPharmacies(pharmacies);
        setPrescriptions(prescriptions);
      });
  }, []);

  function BoxInfoModal(props) {
    const boxes = props.boxes;
    console.log("props", props);

    return (
      <div>
        {
          // TODO: aggiungere altre info, come il nome del manufacturer
        boxes.map((box, index) => (
          <div>
            <Typography level='h4'>Box {index}</Typography>
            <Typography level='h5'>Box Id: {box.BoxID}</Typography>
            <Typography>Expiration Date: {box.ExpirationDate}</Typography>
            <Typography>Production Date: {box.ProductionDate}</Typography>
          </div>
        ))}
      </div>
    );
  }

  React.useEffect(() => {
    let table;
    let tableOrders;
    let tableStorage;
    switch (role) {
      case 'Patient':
        console.log("***prescriptions");
        console.log(prescriptions);
        table = {
          header: ['ID', 'Status', 'Doctor', 'Pharmacy', 'Description'],
          body: prescriptions?.map(prescription => [
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
          body: prescriptions?.map(prescription => [
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
          body: prescriptions?.map(prescription => [
            { display: prescription?.ID, url: `/prescriptions/${prescription?.ID}` },
            { display: prescription?.Status, chipStatus: true },
            { display: patients.find(p => p?.prescriptionId === prescription?.ID)?.Surname, favicon: true },
            { display: doctors.find(d => d?.prescriptionId === prescription?.ID)?.Surname, favicon: true },
            { display: prescription?.Description }
          ])
        }

        tableOrders = {
          header: ['ID', 'Status', 'Manufacturer', 'Description', 'Actions '],
          body: orders?.map(order => [
            { display: order?.ID, url: `/orders/${order?.ID}` },
            { display: order?.Status, chipStatus: true },
            { display: order?.ManufacturerID, favicon: true },
            { display: order?.Description },
            { display: order?.Status === 'shipped' &&
            <Tooltip arrow color="neutral" placement="right" title="Process">
              <Fab color="primary" size="small" onClick={() => openModalWithOrderID(order.ID, true)}>
                <ControlPointIcon size="sm" />
              </Fab>
            </Tooltip>
            }
          ])
        }

        tableStorage = {
          header: ['Drug ID', 'Name', 'Manufacturer', 'Quantity', 'Additional info'],
          body: drugs?.map(drug => [
            { display: drug?.DrugID},
            { display: drug?.Name },
            { display: drug?.ManufacturerID, favicon: true },
            { display: drug?.Quantity},
            {display:  <Tooltip arrow color="neutral" placement="right" title="box info">
            <Fab color="primary" size="small" onClick={
              async ()=>{
                setSelectedDrugName(drug?.Name);
                const boxInfos = await fetchBoxesInfo(drug?.BoxIDs);
                setBoxList(boxInfos);
                setBoxInfoModalOpen(true);
               }}>
              <ControlPointIcon size="sm" />
            </Fab>
          </Tooltip>}
          ])
        }

        break;
      case 'Manufacturer':
        tableOrders = {
          header: ['ID', 'Status', 'Pharmacy', 'Description', 'Action'],
          body: orders?.map(order => [
            { display: order?.ID, url: `/orders/${order?.ID}` },
            { display: order?.Status, chipStatus: true },
            { display: pharmacies?.find(p => p?.orderId === order?.ID)?.Name, favicon: true },
            { display: order?.Description },
            { display: 
              <Tooltip disabled={ order?.Status != 'pending' } arrow color="success" placement="right" title="ship"> 
                <IconButton variant="solid" color="primary" onClick={() => {handleShipOrder(order?.ID)}}>
                  <LocalShippingIcon size="sm" />
                </IconButton>
              </Tooltip>
            }
          ])
        }
        break;
      default:
        table = dataTable;
        tableOrders = orderTable;
        tableStorage = storageTable;
    }
    console.log("table");
    console.log(table);

    setDataTable(table);
    setOrderTable(tableOrders);
    setStorageTable(tableStorage);
  }, [prescriptions, orders, doctors, patients, pharmacies, drugs ]);
  // ^^^^ indicando gli state come dipendenza ogni volta che cambiano parte l'hook

  return (
    <Box className="Home">
      <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 5 }}>
        {/* <Breadcrumbs navigation={ navigation } /> */}
        <Box sx={{ maxWidth: '60%' }}>
          <UserCard role={role} userProfile={userProfileCard} />
        </Box>
        {/* <Stack> */}
          <div>
            <Box sx={{ maxWidth: '100%', display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ minWidth: '50%' }}>
                { dataTable && (
                  <Typography level="h4" textAlign="left" sx={{ mb: 2, marginBottom: 0 }}>
                  Prescriptions
                  </Typography>
                )}
              </Box>
              <Box sx={{ minWidth: '50%', display: 'flex', justifyContent: 'right', marginBottom: '8px' }}>
                  {role === "Doctor" && (
                    <Button onClick={() => setAddPrescrModalOpen(true)}>Add prescription</Button>
                  )}
                  {role === "Pharmacy" && (
                     <ButtonGroup variant="solid" color="primary">
                      <Button onClick={() => {setAddOrderModalOpen(true); setAutocompleteOptions([])} }>New Order</Button>
                      <Button onClick={() => setProcPrescrModalOpen(true)}>Process prescription</Button>
                      </ButtonGroup>
                  )}
              </Box>
            </Box>
            <Box sx={{ width: '100%', height: 250, }} >
              <Stack spacing={5}>
                <Table dataTable={dataTable} />
                {orderTable &&
                  <Typography level="h4" textAlign="left" mb={1}>
                  Orders
                  </Typography>
                }
                <Table dataTable={orderTable} />
                {storageTable &&
                  <Typography level="h4" textAlign="left" mb={1}>
                  Storage
                  </Typography>
                }
                <Table dataTable={storageTable} />
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
              updateDataTables();
              setSelectedDrugs([])
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
                  required
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
                      let newOptions = autocompleteOptions.filter(d => d.DrugID !== selectedOption.DrugID);
                      setAutocompleteOptions(newOptions);
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
                            defaultValue={1}
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
                              setAutocompleteOptions([...autocompleteOptions, selectedDrug]);

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
              updateDataTables();

            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Prescription ID</FormLabel>
                <Input autoFocus required name="prescriptionID" />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Process order Modal */}
      <Modal open={isProcOrderModalOpen} onClose={() => setProcOrderModalOpen(false)}>
        <ModalDialog style={{ width: "60%" }}>
          <DialogTitle>Process an order</DialogTitle>
          <DialogContent>Insert the order ID.</DialogContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmitProcOrder(event);
              // TODO: far apparire un messaggio di successo + aggiornare la tabella delle prescrizioni
              setProcOrderModalOpen(false);
              updateDataTables();
              setSelectedDrugs([]);
              setAutocompleteOptions([]);


            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Order ID</FormLabel>
                <Input autoFocus required name="orderID" value={selectedOrderID || ''} onChange={(e) => setSelectedOrderID(e.target.value)}/>
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>


      {/* BoxInfo Modal */}
      <Modal open={isBoxInfoModalOpen} onClose={() => setBoxInfoModalOpen(false)}>
      <ModalDialog style={{ width: "60%" }}>
          <DialogTitle level='h3'>{selectedDrugName} Storage</DialogTitle>
          <BoxInfoModal boxes={boxList}/>
        </ModalDialog>
      </Modal>

      {/* Add order Modal */}
      <Modal open={isAddOrderModalOpen}
      onClose={() => {
        setAddOrderModalOpen(false)
        setSelectedDrugs([]);
        setSelectedManufacturer([])}}>
        <ModalDialog style={{ width: "60%" }}>
          <DialogTitle>Create new order</DialogTitle>
          <DialogContent>Fill in the order information.</DialogContent>
          <form onSubmit={async (event) => {
            event.preventDefault();
            await handleSubmitAddOrder(event);
            setAddOrderModalOpen(false);
            updateDataTables();
            setSelectedDrugs([]);
            setSelectedManufacturer([]);
            setAutocompleteOptions([]);
          }}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Manufacturer ID</FormLabel>
              <Autocomplete
                required
                name='ManufacturerID'
                placeholder='Select a manufacturer'
                options={autocompleteManOptions}
                autoHighlight
                getOptionLabel={(option) => option.Name}
                renderOption={(props, option) => (
                  <AutocompleteOption {...props}>
                    <ListItemContent sx={{ fontSize: 'sm' }}>
                      {option.Name}
                      <Typography level="body-xs">
                        {option.ID}
                      </Typography>
                    </ListItemContent>
                  </AutocompleteOption>
                )}
                onChange={(event, selectedOption) => {
                  if (selectedOption) {
                    setSelectedManufacturer([ selectedOption]);
                    event.target.value = ''; // Clear the input
                    let filteredDrugs = drugs.filter(d => d.ManufacturerID === selectedOption.ID);
                    setAutocompleteOptions(filteredDrugs);
                    console.log(filteredDrugs)
                    setSelectedDrugs([]); // Se cambio manufacturer il campo è pulito
                  }
                }}/>
            </FormControl>
            <FormControl>
                <FormLabel>Description</FormLabel>
                <textarea
                  name="description"
                  rows="4"
                  style={{ maxWidth: "100%", minWidth: "100%" }}
                  placeholder="Add a description"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Drugs</FormLabel>
                <Autocomplete
                required
                placeholder='Select a drug'
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
                    let newOptions = autocompleteOptions.filter(d => d.DrugID !== selectedOption.DrugID);
                    setAutocompleteOptions(newOptions);
                    event.target.value = ''; // Clear the input
                  }
                }}/>
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
                            defaultValue={1}
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
                              setAutocompleteOptions([...autocompleteOptions, selectedDrug]);
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
          </Stack>
          </form>
          </ModalDialog>

      </Modal>

    </Box>

  );


}