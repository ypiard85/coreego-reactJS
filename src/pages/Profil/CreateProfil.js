import * as React from 'react';
import { useState } from "react"
import { Container, Typography, TextField, Fab } from "@mui/material"
import {UserService} from '../../Services/UserService';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DoneIcon from '@mui/icons-material/Done';
import Stepper from '@mui/material/Stepper';
import StepButton from '@mui/material/StepButton';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

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
    const [pseudoValid,setPseudoValid] = useState(false);
    const [description, setDescription] = useState();
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [tiktok, setTiktok] = useState("");

    
    //Pseudo verif
    UserService.verifPseudo(pseudo).then(res => {
        setPseudoErrorMessage(res)
      })
      
      const handlePseudo = (event) => {
        setPseudo(event.target.value)
      }
      
      const initSpace = (event) => {
        if(event.keyCode == 32){
          event.target.value = pseudo.replace(/\s/g, "")
          return true
        }
      }
      
      const [activeStep, setActiveStep] = React.useState(2);
      const [completed, setCompleted] = React.useState({});
      
    const totalSteps = () => {
      return steps.length;
    };
    
    const completedSteps = () => {
      return Object.keys(completed).length;
    };
    
    const nextStep = () => {
      setActiveStep(activeStep + 1)
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
    //
    

    return(
        <Container>
            <Box sx={{ width: '100%', maxWidth: "100%", mt: 10  }}>
            <Stepper activeStep={activeStep} sx={{flexWrap: 'wrap'}} >
                {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                    <StepButton color="inherit">
                    {label}
                    </StepButton>
                </Step>
                ))}
            </Stepper>
          <div style={{ marginTop: '100px' }}>
          <React.Fragment>
            <Box sx={{ display: activeStep == 0 ? 'flex' : 'none', flexDirection: "column", width: '300px', maxWidth: "100%", m:'auto'  }} >
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

          </React.Fragment>
      </div>
    </Box>
    </Container>
    )
}


export default CreateProfil