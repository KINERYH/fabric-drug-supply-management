import MiniUserCard from '../components/MiniUserCard'
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import * as React from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../provider/authProvider';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import Badge from '@mui/joy/Badge';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import BusinessIcon from '@mui/icons-material/Business';


export default function Order(props) {
  const { token, user, role } = useAuth();
  const { orderId } = useParams();
  
  const [order, setOrder] = React.useState(null);
  const [prescriptions, setPrescriptions] = React.useState(null);
  const [patient, setPatient] = React.useState(null);
  const [pharmacy, setPharmacy] = React.useState(null);
  const [manufacturer, setManufacturer] = React.useState(null);
  const [drugs, setDrugs] = React.useState([]);
  const [boxes, setBoxes] = React.useState([]);

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
  const fetchOrder = async (orderId) => {
    try{
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+ token }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch order");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchOrder status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }
  const fetchPrescriptions = async () => {
    try{
      const res = await fetch(`http://localhost:3001/api/prescriptions`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+ token }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch prescriptions");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchPrescriptions status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }
  const fetchDrug = async (drugId) => {
    try{
      const res = await fetch(`http://localhost:3001/api/drugs/${drugId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+ token }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch drug");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchDrug status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }
  const fetchBox = async (boxId) => {
    try{
      const res = await fetch(`http://localhost:3001/api/boxes/${boxId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+ token }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch box");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchBox status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  React.useEffect( () => {
    const fetchData = async () => {
      const order = await fetchOrder(orderId);
      setOrder(order);
      const prescriptions = await fetchPrescriptions();
      setPrescriptions(prescriptions);
      if (order?.PharmacyID) {
        const pharmacyInfo = await fetchUserInfo(order.PharmacyID);
        setPharmacy(pharmacyInfo);
      }
      if (order?.ManufacturerID) {
        const manufacturerInfo = await fetchUserInfo(order.ManufacturerID);
        setManufacturer(manufacturerInfo);
      }
      const drugsInfo = await Promise.all(
        order?.Drugs?.map(async (drugOrder) => {
          const drugLedger = await fetchDrug(drugOrder.DrugID);
          return { ...drugLedger, ...drugOrder };
        })
      );
      setDrugs(drugsInfo);

      // const patientInfo = await fetchUserInfo(prescription?.PatientID);
      // setPatient(patientInfo);
      const boxes = await Promise.all(
        order?.Drugs?.map( async (drugOrder) => {
          const boxes = await Promise.all(
            drugOrder?.BoxIDs?.map(async (boxId) => {
              const box = await fetchBox(boxId);
              console.log(box);
              return box;
            })
          )
          return boxes.flat();
        })
      );
      setBoxes(boxes.flat());
      // console.log(boxes);
      // boxes.map( (box) => (
      //   console.log("=== box ===");
      //   console.log(box);
      //   // const patientId = await prescriptions.find(prescription => {
      //   //   return prescription.Drugs.some(drug => drug.BoxIDs.includes(box.BoxID));
      //   // })?.PatientID;
      //   // const patientName = await fetchUserInfo(patientId);
      //   { ...box, PatientName: 'Patient 1' }
      // ))
      // console.log("======= boxes with patient name ========");
      // console.log(boxes);
    }

    fetchData();
  }, []);
  
  
  return (
    <Box sx={{ minWidth: '100%', display:'flex', alignItems:'center', justifyContent:'center', paddingTop: '100px' }}>
      <Badge variant="outlined" badgeInset="0 70px 0 0" badgeContent=
        {
          <Chip variant="plain" size="lg"
            startDecorator={
              {
                pending: <AutorenewRoundedIcon />,
                shipped: <LocalShippingIcon />,
                processed: <CheckRoundedIcon  />
              }[order?.Status]
            }
            color={
              {
                pending: 'neutral',
                shipped: 'primary',
                processed: 'success',
              }[order?.Status]
            }
          >
            { order?.Status }
          </Chip>
        }
      >
        <Card orientation="vertical" mb={5}>
          <Typography level="h4">Order { orderId }</Typography>
          <Typography level="body-mg">Description: { order?.Description }</Typography>
          <Box sx={{ display:'flex', justifyContent:'space-around' }}>
            <MiniUserCard
              title='Requested by pharmacy' 
              user={pharmacy} 
              secondIcon={<LocalPharmacyIcon variant="soft" color="primary"/>}
            />
            <MiniUserCard
              title='Processed by Manufacturer'
              user={manufacturer} 
              secondIcon={<BusinessIcon variant="soft" color="primary"/>}
            />
          </Box>

          {/*============ Visualizzazione drugs ============*/}
          <Typography startDecorator={<VaccinesIcon />} level="h4">Drugs list</Typography>
          <AccordionGroup>
            {drugs?.map( (drug) => (
              <Accordion>
                <AccordionSummary><Typography level="title-md">{drug.Name}</Typography></AccordionSummary>
                <AccordionDetails>
                  <Typography level="body-sm">ID: { drug?.DrugID }</Typography>
                  <Typography level="body-xs">DESCRIZIONE { drug?.Description }</Typography>
                  <Typography level="body-sm">QUANTITÀ: { drug?.Quantity }</Typography>
                  <Typography level="body-sm">PREZZO: { drug?.Price }</Typography>
                  <Typography level="body-md" textTransform="uppercase" textAlign={'center'} mb={1}>Composition</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                      { drug?.Composition.map(ingredient => (
                        <Chip variant="soft" size="sm" color="primary">
                          {ingredient}
                        </Chip>
                      ))}
                    </Box>
                  <Typography level="body-md" textTransform="uppercase" mb={1} mt={3} textAlign={'center'}>Traceability</Typography>
                  { boxes.filter(box => box.DrugID === drug.DrugID )?.map((box) => (
                    <Box mb={1} sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                      <Card orientation="vertical" mb={2} sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                        <CardOverflow variant="soft">
                          <Typography level="body-sm" textTransform="uppercase" mb={1}>{box.BoxID}</Typography>
                          <Divider inset="context" />
                        </CardOverflow>
                        <CardContent orientation="horizontal">
                          <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                            <Avatar color="primary" variant="outlined" size="sm"></Avatar>  
                            <Typography level="body-xs">{box?.PatientName || 'Patient 1'}</Typography>
                            <Typography level="body-xs" color="danger">{box?.ExpirationDate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center' }}>
                            <Divider orientation="horizontal" flexItem color='primary' sx={{ width: '50px', height:'2px' }} />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                            <Avatar color="primary" variant="outlined" size="sm"><LocalPharmacyIcon variant="soft" color="primary"/></Avatar>  
                            <Typography level="body-xs">{pharmacy?.Name}</Typography>
                            <Typography level="body-xs" color="neutral">{box?.ExpirationDate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center' }}>
                            <Divider orientation="horizontal" flexItem color='primary' sx={{ width: '50px', height:'2px' }} />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                            <Avatar color="primary" variant="outlined" size="sm"><BusinessIcon variant="soft" color="primary"/></Avatar>  
                            <Typography level="body-xs">{drug?.ManufacturerID}</Typography>
                            <Typography level="body-xs" color="success">{box?.ProductionDate}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionGroup>
        </Card>
      </Badge>
    </Box>
  );
}