import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import {useNavigate} from "react-router-dom"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function SignUp() {

  const navigate = useNavigate();
  const [registeredVisible, setRegistedVisible] = useState(false);

  const handleRegistrationAlert = () => {
    setRegistedVisible(false);

  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const data = new FormData(event.currentTarget);

    try{
      const response = await fetch('http://localhost:3001/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          cf: data.get('cf'),
          address: data.get('address'),
          password: data.get('password'),
          birthDate: data.get('birthDate'),
          weight: data.get('weight'),
          height: data.get('height'),
          role:'Patient'
        })
      })

      console.log(response.status)
      const json =  await response.json()
      if (response.status === 201){
        console.log('utente registrato con successo');
        setRegistedVisible(true);
      }
      else{
        alert('Errore nella registrazione')
      }
    }
    catch{}


  };

  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Collapsed-breakpoint': '769px',
            '--Cover-width': '50vw',
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          maxWidth: '100%',
          px: 2,
        }}
      >
        <Box
          component="main"
          sx={{
            my: 'auto',
            py: 4,
            px: 4,
            pb: 5,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            borderRadius: 'sm',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack gap={4} justifyContent="center" alignItems="center">
            <Typography level="h3">Sign up</Typography>
          </Stack>

          <div style={{ padding: '25px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
				<FormField label="First name" type="text" name="firstName" required />
				<FormField label="Last name" type="text" name="lastName" required />
				<FormField label="CF" type="text" name="cf" required />
				<FormField label="Address" type="text" name="address" required />
				<FormField label="Password" type="password" name="password" required />
				<FormField label="Birth Date" type="date" name="birthDate" required />
				<FormField label="Weight (kg)" type="number" name="weight" required />
				<FormField label="Height (cm)" type="number" name="height" required />
              </div>

              <Stack gap={4} sx={{ mt: 2 }}>

                <Button type="submit" fullWidth>
                  Sign up
                </Button>
                { registeredVisible && (<Alert
                  startDecorator={<CheckCircleIcon/>}
                  variant="solid"
                  color='success'
                  fullWidth>User successfully registered!
                  <IconButton  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={handleRegistrationAlert}>
                    <CloseIcon />
                  </IconButton>
                  </Alert>)}
              </Stack>
            </form>
          </div>
        </Box>
        <Box component="footer" sx={{ py: 3 }}>
          <Typography level="body-xs" textAlign="center">
            © Your company {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

function FormField({ label, type, name, required }) {
  return (
    <FormControl required={required}>
      <FormLabel>{label}</FormLabel>
      <Input type={type} name={name} />
    </FormControl>
  );
}