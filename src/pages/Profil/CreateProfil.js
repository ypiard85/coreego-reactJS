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

const steps = [
    'Ajouter un pseudo',
    'Ajouter une description',
    'Réseaux sociaux',
    'Photo de profil',
  ];


const SnsContext = React.createContext({instagram: "", facebook: "", tiktok: "", twitter: "" })

const CreateProfil = () => {
    //Pseudo control
    const [pseudo, setPseudo] = useState("");
    const [pseudoErrorMessage, setPseudoErrorMessage] = useState(null);
    const [pseudoValid,setPseudoValid] = useState(false);
    const [sns, setSns] = useState({instagram: "", facebook: "", tiktok: "", twitter: "" });
    const [description, setDescription] = useState();

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

    return(
        <Container>
            <Box sx={{ width: '100%', mt: 10  }}>
            <Stepper nonLinear activeStep={activeStep}>
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

            <Box sx={{  display: activeStep == 1 ? 'flex' : 'none',  flexDirection: "column",  maxWidth: "100%", m:'auto'  }}>
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
            <SnsContext.Provider value={sns}>
                <SnsControl id={activeStep} sns={sns} />
            </SnsContext.Provider>    
          </React.Fragment>
      </div>
    </Box>
    </Container>
    )
}


function SnsControl(props){
    const [instagram, setInstagram] = useState("");

    const {id} = props

    const snscontext = React.useContext(SnsContext);

    const handleInsta = (event) => {
        setInstagram(event.target.value);
    }   

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    return(
        <div style={{ width: '500px', maxWidth: "100%", m:'auto', display: id == 2 ? 'block' : 'none' }} >
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            <InstagramIcon/>
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}> {instagram.length > 0 ? instagram : "INSTAGRAM"} </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TextField id="standard-basic" onChange={handleInsta} label="Url instagram" type="url" variant="standard" fullWidth  />
        </AccordionDetails>
      </Accordion>
    </div>
    )

}

export default CreateProfil