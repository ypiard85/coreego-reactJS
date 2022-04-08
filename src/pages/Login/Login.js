import {useState, useRef, Redirect, useEffect} from "react";
import { Box, Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import Alert from "@mui/material/Alert";

function Login() {
  const email = useRef(null);
  const password = useRef(null);

  const auth = getAuth();

  const [erreur, setErreur] = useState({ erreur: false, message: null });
  const [success, setSuccess] = useState({ valid: false, message: null });
  const [isLoad, setIsLoad] = useState(false);
  const [user, setUSer] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoad(true);

    signInWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .finally(() => setIsLoad(false))

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
                  "  Créer un compte"
                )}
              </Button>
            </Box>
            <Box sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error"></Alert>
            </Box>
          </Container>
        </Paper>
      </form>
    </Container>
  );
}

export default Login;
