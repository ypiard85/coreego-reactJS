import {useState, useRef, useEffect} from "react";
import { Box, Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import {AuthService} from '../../Services/AuthService';

function Login() {
  const email = useRef(null);
  const password = useRef(null);


  const [erreur, setErreur] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [user, setUSer] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoad(true);
    AuthService.signInWithEmailAndPassword(
      email.current.value,
      password.current.value
    ).then(res => {
      if(res){
        window.location.href = "/"
      }
    }).catch(error => {
      if(error.code == "auth/user-not-found"){
        setErreur("Aucun utilisateur n'a été trouvé")
      }else if (error.code == "auth/wrong-password"){
        setErreur("Mot de passe invalide")
      }
    }).finally(setIsLoad(false))

  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        height: "80vh",
      }}
    >
      <form className="loginForm" onSubmit={handleSubmit}>
        <Paper elevation={8}>
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ textAlign: "center" }}>
                Connexion
              </Typography>
            </Box>
            <Box>
              <TextField
                sx={{ width: "100%" }}
                inputRef={email}
                type="email"
                label="Email@email.com"
                variant="outlined"
              />
            </Box>
            <Box>
              <TextField
                sx={{ width: "100%" }}
                type="password"
                inputRef={password}
                id="password"
                label="Mot de passe"
                variant="outlined"
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" size="large">
                {isLoad ? (
                  <CircularProgress sx={{ color: "white", fontSize: "12px" }} />
                ) : (
                  "  Je me connecte"
                )}
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

export default Login;
