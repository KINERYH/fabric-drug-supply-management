import * as React from 'react';
import '../css/Home.css';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Button from '@mui/joy/Button';
import UserCard from '../components/UserCard';
import Breadcrumbs from '../components/Breadcrumbs';
import Table from '../components/Table';



export default function Home() {
  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiODk1ZWZkOTYtYzFjYi00MjRhLTg1NGItZWRhMDUzOGUwZjdkIiwicm9sZSI6IlBhdGllbnQiLCJzbWFydENvbnRyYWN0IjoiUGF0aWVudENvbnRyYWN0IiwiaWF0IjoxNjk3NjY2MjU2LCJleHAiOjE2OTc2ODQyNTZ9.r8x8vOgZ1ikJp_sTksd8jK1D3t_Lpcd7ZnmhNxCb2mo"

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
      role: 'Patient',
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
  
  const fetchUserProfile = async () => {
    try{
      const res = await fetch("http://localhost:3001/api/users/895efd96-c1cb-424a-854b-eda0538e0f7d", {
        method: 'GET', 
        headers: { 
          'Authorization': 'Bearer '+ jwtToken,
        }
      });
      if (res.status == 200) {
        const data = await res.json();
        console.log("response fetch user");
        console.log(data);
        return data.data;
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
          'Authorization': 'Bearer '+ jwtToken,
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
      const prescriptions = await fetchPrescriptions();

      return { userProfile, prescriptions };
    }

    fetchData()
      .then( ({ userProfile, prescriptions }) => {
        console.log("setting profile card")
        setUserProfileCard({
          firstName: userProfile?.Name,
          lastName: userProfile?.Surname,
          src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286',
          role: 'ruolo da ricavare dal token',
          totPrescriptions: prescriptions?.length,
          pendingPrescriptions: prescriptions?.filter( p => p.Status === 'pending' ).length,
          processedPrescriptions: prescriptions?.filter( p => p.Status !== 'pending' ).length
        }); 
        

        /* farei visualizzare il nome del dottore piuttosto che l'ID, quindi da fare altra chiamata per recuperare
        *  nome del dottore e nome della farmacia
        */
        setDataTable({
          header: ['ID', 'Status' ,'Doctor', 'Pharmacy', 'Description'],
          body: prescriptions.map(prescription => [
            { display: prescription?.ID, url: `/api/prescriptions/${prescription?.ID}` },
            { display: prescription?.Status, chipStatus: true },
            { display: prescription?.DoctorID, favicon: true, url: `/api/users/${prescription?.DoctorID}` },
            { display: prescription?.PharmacyID, favicon: true, url: `/api/users/${prescription?.PharmacyID}` },
            { display: prescription?.Description },
          ])
        }); 
      });
  }, []);

  return (
    <Box className="Home">
      <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 5 }}>
        <Breadcrumbs navigation={ navigation } />
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
                <Button>Add prescription</Button>
                <Button>Process prescription</Button>
                <Button>Add order</Button>
              </ButtonGroup>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 250, }} >
            <Table dataTable={ dataTable } />
          </Box>
        </div>
      </Box>
    </Box>
  );
}