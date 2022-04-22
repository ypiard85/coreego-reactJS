import * as React from 'react';
import { useState } from "react"
import { storage, auth, db } from "../../backend/config.js";
import { Container, Typography, TextField, Fab, Alert, AlertTitle, CircularProgress, LinearProgress } from "@mui/material"
import {UserService} from '../../Services/UserService';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import Stepper from '@mui/material/Stepper';
import StepButton from '@mui/material/StepButton';
import Step from '@mui/material/Step';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { doc, setDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";


const steps = [
    'Ajouter un pseudo',
    'Ajouter une description',
    'Réseaux sociaux',
    'Photo de profil',
  ];

const CreateProfil = () => {
    //Pseudo control
    const [pseudo, setPseudo] = useState("");
    const [pseudoErrorMessage, setPseudoErrorMessage] = useState(null);
    //const [pseudoValid,setPseudoValid] = useState(false);
    const [description, setDescription] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [tiktok, setTiktok] = useState("");
    const [file, setFile] = useState();
    const [fileView, setFileView] = useState();
    const [loading, setLoading] = React.useState(false);
    const [progress, setProgress] = useState(0);
    const [messageValidation, setMessageValidation]  = useState("")


    //Pseudo verif
    UserService.verifPseudo(pseudo).then(res => {
        setPseudoErrorMessage(res)
      })

      const initSpace = (event) => {
        if(event.keyCode == 32){
          event.target.value = pseudo.replace(/\s/g, "")
          return true
        }
      }

      const [activeStep, setActiveStep] = React.useState(0);


    const nextStep = () => {
      setActiveStep(activeStep + 1)
    }

    const handlePseudo = (event) => {
      setPseudo(event.target.value)
    }

    const handleDescription = (event) => {
      setDescription(event.target.value)
    }

    const handleInstagram = (event) => {
      setInstagram(event.target.value)
    }

    const handleFacebook = (event) => {
      setFacebook(event.target.value)
    }

    const handleTwitter = (event) => {
      setTwitter(event.target.value)
    }

    const handleTiktok = (event) => {
      setTiktok(event.target.value)
    }

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    const regextUrl = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)

    const acordeons = [
      {
        titre: "Instagram",
        label: "Mon instagram",
        icon: <InstagramIcon/>,
        def: handleInstagram,
        value: instagram,
        valid: true,
      },
      {
        titre: "Facebook",
        label: "Mon facebook",
        icon: <FacebookIcon/>,
        def: handleFacebook,
        value: facebook,
        valid: true,
      },
      {
        titre: "Twitter",
        label: "Mon twitter",
        icon: <TwitterIcon/>,
        def: handleTwitter,
        value: twitter,
        valid: true,
      },
      {
        titre: "TikTok",
        label: "Mon tiktok",
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 50 50" width="20px" height="20px"><path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"/></svg>,
        def: handleTiktok,
        value: tiktok,
        valid: true,
      },
    ]

    acordeons.forEach(a => {
      if(a.value !== ""){
        if(regextUrl.test(a.value)){
          a.valid = true
        }else{
          a.valid = false
        }
      }
    })

    //Vérifier si tous les input sont bien des URLs
    var validation = acordeons.filter(v => v.valid === false );

    const etatValidation = () => {
        if(validation.length > 0){
          return false
        }else{
          return true
        }
    }

    const handleAvatar = (event) => {
        //setFile([])
        var preview = document.querySelector('#av');
        var fileimg = document.getElementById('fileimg').files[0]
        setFile(event.target.files[0])
        setFileView(preview)
        var reader = new FileReader();
        reader.addEventListener("load", function(){
            preview.src = reader.result;
        }, false)
        if(fileimg){
          reader.readAsDataURL(fileimg)
        }
      }
      const handleSubmit = () => {

        const nb = Math.round(Math.random() * (300000 * 10)) + auth.currentUser.uid
              //Upload image
              if(file){
                var storageRef = ref(storage,`/avatar/${nb}`);
                const u = uploadBytesResumable(storageRef, file);
                u.on("state_changed", (snap) => {
                  const prog = Math.round(
                    (snap.bytesTransferred / snap.totalBytes) * 100
                    );
                    console.log(snap)
                    setProgress(prog);
                  });
                }

          const userRef = doc(db, 'users', auth.currentUser.uid);
          const fetchData = setDoc(userRef, {
                pseudo: pseudo.replace(/ /g, ""),
                description: description,
                avatar: file ? nb : null,
                instagram: instagram,
                facebook: facebook,
                twitter: twitter,
                tiktok: tiktok
              });

        if(pseudoErrorMessage != ""){
          if(etatValidation()){
            setLoading(true)
            if(file && progress === 100){
                console.log('progress up')
                  setLoading(false)
                  fetchData()
                  setMessageValidation("Votre profil à été créé avec Succès");
                  setTimeout(() => {
                    window.location.href = "/profil/" + auth.currentUser.uid
                  }, 3000)
            }else{
              setTimeout(() => {
                setLoading(false)
                setMessageValidation("Votre profil à été créé avec Succès");
                fetchData()
              }, 2000)
              setTimeout(() => {
                window.location.href = "/profil/" + auth.currentUser.uid
              }, 4000)
            }

            }else{
              setActiveStep(2);
              alert("Merci de coriger vos URLs")
            }
        }else{
          setActiveStep(0);
          alert(pseudoErrorMessage)
        }
      }



    return(
        <Container sx={{ my: 10 }}>
            <Alert severity="success" sx={{mt:10, display: messageValidation != "" ? 'blobk' : 'none' }}  >
            <AlertTitle>Success</AlertTitle>
              {messageValidation}
            </Alert>
            <Box sx={{ width: '100%', maxWidth: "100%" }}>
            <Stepper activeStep={activeStep} sx={{flexWrap: 'wrap'}} >
                {steps.map((label, index) => (
                <Step key={label}>
                    <StepButton color="inherit">
                    {label}
                    </StepButton>
                </Step>
                ))}
            </Stepper>
          <div style={{ marginTop: '100px' }}>
          <React.Fragment>
            <Box sx={{ display: activeStep == 0 ? 'flex' : 'none', flexDirection: "column", width: '300px', maxWidth: "100%", m:'auto'  }} >
              <Typography sx={{mb:3}}>
                Le pseudo ne peut pas être modifié
              </Typography>
                <TextField
                onChange={handlePseudo}
                id="outlined-helperText"
                label="Pseudo"
                onKeyUp={initSpace}
                sx={{width: '100%'}}
                helperText={pseudoErrorMessage ? pseudoErrorMessage : null}
                value={pseudo}
                />
                <Fab variant="contained" sx={{ m: 'auto', mt:3 }} onClick={nextStep} color="success" disabled={pseudoErrorMessage ? true : false }  >
                    <DoneIcon />
                </Fab>
            </Box>

            <Box sx={{ display: activeStep == 1 ? 'flex' : 'none',  flexDirection: "column",  maxWidth: "100%", m:'auto'  }}>
            <TextField
                onChange={handleDescription}
                id="outlined-helperText"
                label="Description du profil"
                multiline
                minRows={10}
                value={description}
                />
                <Fab variant="contained" color="success" sx={{ m: 'auto', mt: 3 }} onClick={nextStep} >
                <DoneIcon />
                </Fab>
            </Box>
            <Box style={{ width: '500px', maxWidth: "100%", m:'auto', display: activeStep === 2 ? 'block' : 'none' }} >
                {acordeons.map((a,i) => {
                  return (
                    <Accordion  expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)} key={i}>
                      {a.value != "" ?
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ backgroundColor: a.valid ? ""  : "#CE293B"  }}
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {a.icon}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}> {a.titre} </Typography>
                      </AccordionSummary>
                        :
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {a.icon}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}> {a.titre} </Typography>
                      </AccordionSummary>
                      }
                    <AccordionDetails>
                      <TextField id="standard-basic" onChange={a.def} value={a.value} label={a.label} type="url" variant="standard" fullWidth  />
                    </AccordionDetails>
                  </Accordion>
                  )
                })}
                <Fab variant="contained" color="success" sx={{ m: 'auto', mt: 3 }} onClick={etatValidation() ? nextStep : ""} disabled={etatValidation() ? false : true} >
                <DoneIcon />
              </Fab>
              </Box>


              <Box sx={{width: '500px', m: 'auto', maxWidth: '100%', display: activeStep === 3 ? 'block' : 'none' }} >
                <Paper elevation={8} sx={{py:5, display: 'flex',position: 'relative', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                  <input onChange={handleAvatar} id="fileimg" accept='image/png, image/jpg, image/jpeg' type="file" style={{cursor: 'pointer', position: 'absolute', opacity: '0', top: 0, left: 0, right: 0, bottom:0 , height: '100%', width: '100%', display: "block"}} />
                <img src={typeof file === undefined ? '' : "https://cdn-icons-png.flaticon.com/512/147/147142.png" } id="av" alt="" style={{width: '150px', height: '150px', borderRadius: '50%'}} />
                  <Typography sx={{ p:2, mt:5, border: '3px dashed  #CE293B'}} variant="h6" component="h6">
                  Télécharger ma photo de profil
                  </Typography>
                </Paper>
                <Box sx={{display: "flex", justifyContent: 'center', flexDirection: 'column', alignItems: 'center' , mt:5}}>
                {loading && <CircularProgress sx={{ my: 2 }} color="secondary" /> }
                {progress > 0 && <LinearProgress color="secondary" sx={{ width: '100%', my:2 }} variant="determinate" value={progress} /> }
                  <Button variant="contained" sx={{width: 'max-content'}} disabled={loading ? true : false} onClick={handleSubmit}>Créer mon profil</Button>
                </Box>
              </Box>

          </React.Fragment>
      </div>
    </Box>
    </Container>
    )
}



export default CreateProfil