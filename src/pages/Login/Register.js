import { Box, Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {auth} from '../../backend/config';
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { useRef, useState } from "react";
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack';

function Register() {

  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const [erreur, setErreur] = useState({erreur: false, message: null});
  const [success, setCuccess] = useState({valid: false, message: null});
  const [isLoad, setIsLoad] = useState(false);

  const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
  function handleSubmit(event){
    event.preventDefault();
    setIsLoad(true)
    setTimeout(() => {
      setIsLoad(false)
    }, 2000 )

    /*try {
      console.log(emailRegex.test(email.current.value))
      console.log(passwordRegex.test(password.current.value))



      createUserWithEmailAndPassword(auth, email.current.value, password.current.value).then(res=> {
        console.log(res)
      }).catch(error => console.log(error))

    } catch (error) {
        alert(error)
    }*/


  };


  return (
    <Container sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', height: '80vh' }} >
      <form className="loginForm" onSubmit={handleSubmit} >
        <Paper elevation={8}>
          <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} >
              <Box>
            <Typography variant="h3" sx={{ textAlign: "center" }} >
                Inscription
            </Typography>
              </Box>
              <Box >
                <TextField sx={{ width: '100%' }} inputRef={email}  type="email" label="Email@email.com" variant="outlined" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
              <TextField type="password" inputRef={password} id="password" label="Mot de passe" variant="outlined" />
              <TextField type="password" inputRef={confirmPassword} id="passwordConfirm" label="confirmer le mot de passe" variant="outlined" />
              </Box>
              <Box sx={{ textAlign: 'center' }} >
              <Button type="submit"  variant="contained" size="large">
                {isLoad ? <CircularProgress sx={{ color: 'white', fontSize: '12px' }} /> : '  Créer un compte' }
                </Button>
              </Box>
              <Box sx={{ width: '100%' }} spacing={2}>
                <Alert severity="error">This is an error alert — check it out!</Alert>
              </Box>
          </Container>
        </Paper>
      </form>
    </Container>
  );
}

export default Register;
