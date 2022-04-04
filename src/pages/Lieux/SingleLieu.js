import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../backend/config.js";
import { useParams } from "react-router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { Box } from "@mui/material";

const SingleLieu = () => {
  return <Getlieu />;
};

const Getlieu = () => {
  const [lieux, setLieux] = useState([]);
  const [cities, setCities] = useState([]);

  //récupération du paramètre de l'url
  let topicId = useParams();
  //Récupération de la single lieux
  useEffect(() => {
    const lieuxCollection = collection(db, "lieux");
    getDocs(lieuxCollection)
      .then((snap) => {
        snap.forEach((doc) => {
          if (doc.id == topicId.id) {
            setLieux((arr) => [...arr, doc.data()]);
          }
        });
      })
      .catch((erreur) => console.log(erreur));
  }, []);

  //Récupération de la ville
  useEffect(() => {
    const citiesCollection = collection(db, "cities");
    getDocs(citiesCollection).then((snap) => {
      snap.forEach((doc) => {
        setCities([doc.data()]);
      });
    });
  }, []);

  return (
    <>
      {lieux.map((l, index) => {
        return <Page lieu={l} key={index} cities={cities} />;
      })}
    </>
  );
};

const Page = ({...props}) => {

  const {lieu, cities} = props
  return (
    <React.Fragment>
      <Grid container spacing={0}>
        <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <Box>
                <Typography variant="h6" sx={{ display: 'flex', alignItem: 'center', marginRight: '50px' }} >
                    <AddLocationIcon />
                    {cities.map(c => {
                        return c.cities[lieu.citie_id]
                    })}
                </Typography>
                </Box>
                <Box>4° C</Box>
            </Box>
            <Box>
                <Typography variant="h4" >
                    {lieu.title}
                </Typography>
            </Box>
        </Grid>
        <Grid item xs={6}>
          ezr
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SingleLieu;
