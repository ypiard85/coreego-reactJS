import { Box, Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {auth, logOut} from '../../backend/config';
import { createUserWithEmailAndPassword, sendEmailVerification } from "@firebase/auth";
import { useEffect, useRef, useState } from "react";
import Alert from '@mui/material/Alert';
import {AuthService} from '../../Services/AuthService'


function Register() {




  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const [erreur, setErreur] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [user,setUSer] = useState();
  const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{5,})/);
  function handleSubmit(event){
    event.preventDefault();
    setIsLoad(true)

      if(emailRegex.test(email.current.value)){
        if(passwordRegex.test(password.current.value)){
          if(password.current.value === confirmPassword.current.value ){
            createUserWithEmailAndPassword(auth, email.current.value, password.current.value).then(res=> {
              setErreur(null)
              setSuccess("Merci de votre inscription, merci de confirmer votre compte")
            }).catch(error => {
              if(error.code == "auth/email-already-in-use"){
                setSuccess(null)
                setErreur("L'email est déjâ utilisé")
              }else if(error.code == "auth/id-token-expired"){
                setSuccess(null)
                setErreur("Le jeton d'identification Firebase fourni a expiré")
              }
            })
            .finally(setIsLoad(false))
          }else{
            setSuccess(null)
            setErreur("Les mots de passe doivent être identique")
          }
        }else{
            setSuccess(null)
            setErreur("Le mot de passe doit contenir au moins 1 majuscule, 1 caractère spécial, avec au minimum 5 caractères")
        }
      }else{
        setSuccess(null)
        setErreur("Merci d'utiliser un mail valide")
      }

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
              <Box sx={{ width: '100%' }}>
                { (erreur != null) ? <Alert severity="error"> {erreur} </Alert> : '' }
                { (success != null) ? <Alert severity="success">{success}</Alert> : '' }
              </Box>
          </Container>
        </Paper>
      </form>
    </Container>
  );
}

export default Register;
