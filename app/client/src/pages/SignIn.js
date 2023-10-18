import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/joy/Avatar';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';



import {useNavigate} from "react-router-dom"
import { useAuth } from '../provider/authProvider';
import { useState } from 'react';
import Alert from '@mui/joy/Alert';
// TODO remove, this demo shouldn't need to reset the theme.

export default function SignIn() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState();
  const [isErrorVisible, setIsErrorVisible] = React.useState(true); // Add a state for controlling visibility

  const handleHideError = () => {
    setIsErrorVisible(false);
    setErrorMessage('');}

  //handler del form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);


    try{
      const response = await fetch(' http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cf: data.get('cf'),
          password: data.get('password'),
        })
      })

      const json =  await response.json()

      if (response.status === 200) {
        console.log('login effettuato con successo');
        setToken(json.token)
        console.log(json)
        navigate('/dashboard');}

      if (response.status === 401) {
        //unauthorized
        setErrorMessage('Codice Fiscale o Password errati.');
        setIsErrorVisible(true); // Show the error message

      }
      console.log(json)
    }
    catch(err){
      console.log(err)
      alert('Errore nella richiesta di login')
    }


  };

  return (
    <CssVarsProvider>
      <GlobalStyles
        styles={{
          ':root': {
            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
            '--Cover-width': '50vw', // must be `vw` only
            '--Form-maxWidth': '800px',
            '--Transition-duration': '5s', // set to `none` to disable transition
          }
        }}
      />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            px: 2,
          }}
        >
          <Box component="header"
            sx={{
              py: 3,
              display: 'flex',
              alignItems: 'left',
              justifyContent: 'space-between',
            }}
          >
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: 'hidden',
              },

            }}
          >
            <Stack gap={4}   justifyContent="center" alignItems="center">
              <Stack gap={1} justifyContent="center" alignItems="center">
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} size='lg'>
                <LockOutlinedIcon color='primary' />
              </Avatar>
              </Stack>
              <Stack gap={1} justifyContent="center" alignItems="center">
                <Typography level="h3" >Accedi</Typography>
                <Typography level="body-sm">
                  Non sei ancora registrato?{' '}
                  <Link href="/SignUp" level="title-sm">
                    Registrati!
                  </Link>
                </Typography>
              </Stack>
              </Stack>
              {isErrorVisible && errorMessage && (<Alert
                  startDecorator={<WarningIcon />}
                  variant="solid"
                  color="danger"
                  fullWidth>
                    {errorMessage}
                    <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={handleHideError}>
                    <CloseIcon />
                    </IconButton>
                  </Alert> )}
            <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={handleSubmit}
              >
                <FormControl required>
                  <FormLabel>Codice Fiscale</FormLabel>
                  <Input  type='cf' name="cf" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>

                  <Button type="submit" fullWidth>
                    Accedi
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3}}>
            <Typography level="body-xs" textAlign="center">
              © Your company {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
    </CssVarsProvider>
  );
}