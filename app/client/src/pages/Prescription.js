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


export default function Prescription(props) {
  const {token, user, role} = useAuth();
  const { prescriptionId } = useParams();
  
  const [prescription, setPrescription] = React.useState(null);
  const [doctor, setDoctor] = React.useState(null);
  const [pharmacy, setPharmacy] = React.useState(null);
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
  const fetchPrescription = async (prescriptionId) => {
    try{
      const res = await fetch(`http://localhost:3001/api/prescriptions/${prescriptionId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer '+ token }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch prescription");
        console.log(data);
        return data.data;
      } else {
        console.error("fetchPrescription status code: " + res.status);
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
      const prescription = await fetchPrescription(prescriptionId);
      setPrescription(prescription);
      const doctorInfo = await fetchUserInfo(prescription?.DoctorID);
      setDoctor(doctorInfo);
      if (prescription?.PharmacyID) {
        const pharmacyInfo = await fetchUserInfo(prescription.PharmacyID);
        setPharmacy(pharmacyInfo);
      }
      const drugsInfo = await Promise.all(
        prescription.Drugs?.map(async (drugPrescription) => {
          const drugLedger = await fetchDrug(drugPrescription.DrugID);
          return { ...drugLedger, ...drugPrescription };
        })
      );
      setDrugs(drugsInfo);

      if (prescription?.Status === 'processed') {
        console.log("======== PROCESSED ===========")
        const boxes = await Promise.all(
          prescription.Drugs?.map( async (drugPrescription) => {
            const boxes = await Promise.all(
              drugPrescription?.BoxIDs?.map(async (boxId) => {
                const box = await fetchBox(boxId);
                console.log(box);
                return box;
              })
            )
            return boxes.flat();
          })
        );
        setBoxes(boxes.flat());
        console.log("=====================");
        console.log(boxes.flat());
      }
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
                processed: <CheckRoundedIcon  />
              }[prescription?.Status]
            }
            color={
              {
                pending: 'neutral',
                processed: 'success',
              }[prescription?.Status]
            }
          >
            { prescription?.Status }
          </Chip>
        }
      >
        <Card orientation="vertical" mb={5}>
          <Typography level="h4">Prescription { prescriptionId }</Typography>
          <Typography level="body-mg">Description: { prescription?.Description }</Typography>
          <Box sx={{ display:'flex', justifyContent:'space-around' }}>
            <MiniUserCard
              title='Prescripted by doctor' 
              user={doctor} 
              firstIcon={<MedicalInformationIcon variant="soft" color="primary"/>} 
              secondIcon={<LocalHospitalIcon variant="soft" color="primary"/>}
            />
            <MiniUserCard
              title='Processed by pharmacy'
              user={pharmacy} 
              secondIcon={<LocalPharmacyIcon variant="soft" color="primary"/>}
            />
          </Box>

          {/*============ Visualizzazione drugs ============*/}
          <Typography startDecorator={<VaccinesIcon />} level="h4">Drugs list</Typography>
          <AccordionGroup>
            {drugs.map( (drug) => (
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
                  { boxes.filter(box => box.DrugID === drug.DrugID ).map((box) => (
                    <Box mb={1} sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                      <Card orientation="vertical" mb={2} sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                        <CardOverflow variant="soft">
                          <Typography level="body-sm" textTransform="uppercase" mb={1}>{box.BoxID}</Typography>
                          <Divider inset="context" />
                        </CardOverflow>
                        <CardContent orientation="horizontal">
                          <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                            <Avatar color="primary" variant="outlined" size="sm"></Avatar>  
                            <Typography level="body-xs">you</Typography>
                            <Typography level="body-xs" color="danger">{box?.ExpirationDate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center' }}>
                            <Divider orientation="horizontal" flexItem color='primary' sx={{ width: '50px', height:'2px' }} />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                            <Avatar color="primary" variant="outlined" size="sm"><LocalPharmacyIcon variant="soft" color="primary"/></Avatar>  
                            <Typography level="body-xs">{pharmacy.Name}</Typography>
                            <Typography level="body-xs" color="neutral">{prescription?.ProcessingDate}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center' }}>
                            <Divider orientation="horizontal" flexItem color='primary' sx={{ width: '50px', height:'2px' }} />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection:'column', gap: 1, alignItems: 'center', justifyContent:'center' }}>
                            <Avatar color="primary" variant="outlined" size="sm"><BusinessIcon variant="soft" color="primary"/></Avatar>  
                            <Typography level="body-xs">{drug.ManufacturerID}</Typography>
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