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
  const [userProfile, setUserProfile] = React.useState(defaultState.userProfile);
  const [dataTable, setDataTable] = React.useState(defaultState.dataTable);
  
  const fetchUserProfile = async () => {
    try{
      const res = await fetch("http://localhost:3001/api/users/a47e117d-3a2f-4f08-b986-474b2dd7044f", {
        method: 'GET', 
        headers: { 
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZhYnJ5Iiwicm9sZSI6IlBhdGllbnQiLCJzbWFydENvbnRyYWN0IjoiUGF0aWVudENvbnRyYWN0IiwiaWF0IjoxNjk3MzgwMTM0LCJleHAiOjE2OTczOTgxMzR9.yNCxholpgHBEKbVjuyr62kM800TaCaJTUhPrhHwbsag',
        }
      });
      console.log(res);
      if (res.status == 200) {
        const data = await res.json();
        console.log(data);
      } else {
        console.error("userProfileFetch status code: " + res.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    fetchUserProfile();
  }, [])

  return (
    <Box className="Home">
      <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 5 }}>
        <Breadcrumbs navigation={ navigation } />
        <Box sx={{ maxWidth: '60%' }}>
          <UserCard userProfile={ userProfile } />
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