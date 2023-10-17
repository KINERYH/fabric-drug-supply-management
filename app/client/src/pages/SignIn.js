import * as React from 'react';
import Button from '@mui/joy/Button';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';



import Avatar from '@mui/joy/Avatar';
import CssBaseline from '@mui/joy/CssBaseline';
import TextField from '@mui/joy/TextField';
import Checkbox from '@mui/joy/Checkbox';
//import Link from '@mui/material/Link';
import Box from '@mui/joy/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
//import Typography from '@mui/material/Typography';
import Container from '@mui/joy/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from "react-router-dom"
import { useAuth } from '../provider/authProvider';
import { Grid } from '@mui/joy';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInAlt() {
  //TODO: passa il token per poter accedere alla dashboard specifica
  const navigate = useNavigate();
  const { setToken } = useAuth();

  //handler del form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });

    try{
      const response = await fetch(' http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password'),
        })
      })

      const json =  await response.json()

      if (response.status === 200) {
        console.log('login effettuato con successo');
        setToken(json.token)
        console.log(json.token)
        navigate('/');
      if (response.status === 401) {
        alert('Errore nella richiesta di login')
      } }
      console.log(json)
    }
    catch(err){
      console.log(err)
      alert('Errore nella richiesta di login')
    }


  };

  return (
    <CssVarsProvider>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} size='lg'>
          <LockOutlinedIcon color='primary' />
         </Avatar>
          <Typography component="h1" variant="h5">
            Accedi
          </Typography>
        </Box>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input  type='username' name="username" placeholder="Username" autoComplete="username" autoFocus/>
        </FormControl>
        <FormControl>
        <FormLabel>Password</FormLabel>
        <Input  name="password" placeholder="Password" type='password' autoComplete="current-password"/>
        </FormControl>
        <Button
              type="submit"
              fullWidth
              variant="solid"
              sx={{ mt: 3, mb: 2 }}
            >Accedi</Button>
        <Grid container spacing={2}>
         <Grid item xs={6}>
            <Link href="#">
              Hai dimenticato la password?
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Link href="/signup" >
              {"Non hai un account? Registrati"}
            </Link>
         </Grid>
         <Grid item >
            <Link href="/" variant="body2">
              {"Torna alla Home"}
            </Link>
          </Grid>
        </Grid>

      </Container>

    </CssVarsProvider>
  );
}