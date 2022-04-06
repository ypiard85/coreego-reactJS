import React, { useState, useEffect, useLayoutEffect } from "react";
import { db, storage } from "../../backend/config.js";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import LoadingImg from '../../images/caree_loading.png';

function Cards(props) {
  const { lieu, cats, citie, images } = props;
  const [url, setUrl] = useState();
  //Récupération des images dans le storage
  useEffect(() => {
    const getImage = (id) => {
      const getRef = ref(storage, "lieux/" + id);
      getDownloadURL(getRef).then((x) => {
        setUrl(x);
      });
    };
    getImage(images);
  }, []);

  return (
    <Grid item md={4} xs={6}>
      <Card className="card__lieux">
      <Typography
    varaint="p"
    sx={{
        padding: "3px 5px",
        pointerEvents: "none",
        fontWeight: "bold",
        position: "absolute",
        top: "0",
        zIndex: "10",
        backgroundColor: "#005998",
      }}
      color="white"
      >
      {cats.map((c) => {
        return c.names[lieu.categorie_id];
      })}
    </Typography>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={url ? url : LoadingImg }
            />
          <CardContent>
            <Typography
              sx={{ fontWeight: "bold", color: "#005998" }}
              variant="h6"
              component="div"
              >
              {lieu.title}
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
              variant="p"
              component="p"
              >
              <AddLocationIcon sx={{ color: "#CE293B" }} />
              {citie.map((e) => {
                return e.cities[lieu.citie_id];
              })}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Link to={"/lieu/" + lieu.id} className="link__card"></Link>
      </Card>

    </Grid>
    );
  }

function List() {
  const [lieux, setLieux] = useState([]);
  const [cities, setCities] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  //Récupération des lieux
 useEffect(() => {
    const lieuxCollection = collection(db, "lieux");
    getDocs(lieuxCollection)
      .then((snap) => {
        snap.forEach((doc) => {
          lieux.push({ ...doc.data(), id: doc.id });
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

  //Récupération des catégories
  useEffect(() => {
    const citiesCollection = collection(db, "categories");
    getDocs(citiesCollection).then((snap) => {
      snap.forEach((doc) => {
        setCats([doc.data()]);
      });
    });
  }, []);

  return (
    <Grid container spacing={2}>
      {lieux.map((lieu, index) => {
      return <Cards
      lieu={lieu}
      key={index}
      citie={cities}
      images={lieu.images[0]}
      cats={cats}
    />
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
