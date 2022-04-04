import { useState, useEffect, useCallback } from "react";
import { db, storage } from "../backend/config.js";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from '@mui/material/Grid';
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import {Link} from 'react-router-dom';
import AddLocationIcon from '@mui/icons-material/AddLocation';

function Cards(props) {

  const [url, setUrl] = useState();

   useEffect(()=>{
    const getImage =  (id) => {
      const getRef = ref(storage, 'lieux/' + id )
        getDownloadURL(getRef).then(x => {
          setUrl(x)
      })
    }
    getImage(props.images)
   }, [])

   console.log(props.lieu)

  return (
    <Grid item md={4} xs={6} >
    <Card className="card__lieux">
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={url}
          alt="green iguana"
          />
        <CardContent>
          <Typography sx={{ fontWeight: 'bold',  color: '#005998' }} variant="h6" component="div">
            {props.lieu.title}
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}  variant="p" component="p">
            <AddLocationIcon sx={{ color: '#CE293B' }} />
            {props.citie.map((e) => {
              return e.cities[props.lieu.citie_id];
            })}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Link to="/" className="link__card css-1dj8qml-MuiContainer-root" ></Link>
    </Card>
    </Grid>
  );
}

function List() {
  const [lieux, setLieux] = useState([]);
  const [cities, setCities] = useState([]);

  //Récupération des lieux
  useEffect(() => {
    const lieuxCollection = collection(db, "lieux");
    getDocs(lieuxCollection)
      .then((snap) => {
        snap.forEach((doc) => {
          lieux.push({...doc.data(), id: doc.id});
        });
      })
      .catch((erreur) => console.log(erreur));
  }, []);
  console.log(lieux)
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

    <Grid container spacing={2}>
        {lieux.map((lieu, index) => {
          return  <Cards lieu={lieu} key={index} citie={cities} images={lieu.images[0]} />
        })}
    </Grid>

  );
}

function Lieux() {
  return (
    <div>
      <Container sx={{ mt: 10 }}>
        <List />
      </Container>
    </div>
  );
}

export default Lieux;
