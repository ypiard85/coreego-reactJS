import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { db, storage } from "../../backend/config.js";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchContext = React.createContext({
  input: "",
  SearchInit: () => {}
});

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

  //Récupération des lieux
 useEffect(() => {
  const r = collection(db, "lieux");
    getDocs(r)
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

  const {input} = useContext(SearchContext);

  return (
    <>
    <Grid container spacing={2}>
      {lieux.filter(val => {
       return val.title.includes(input)
      }).map((val, index) => {
        return (<Cards
        lieu={val}
        key={index}
        citie={cities}
        images={val.images[0]}
        cats={cats}
        />)
      })}
    </Grid>
    </>
  );

}

function Lieux() {

  const [search, setSearch] = useState("")

  const SearchInit = useCallback((event) => {
    setSearch(event.target.value)
  })

  const value = useMemo(() => {
    return{
      input: search,
      SearchInit
    }
  })


  return (
    <div>
      <Container sx={{ mt: 10 }}>
        <SearchContext.Provider value={value}>
          <Search />
          <List />
        </SearchContext.Provider>
      </Container>
    </div>
  );
}

function Search(){
  const {SearchInit} = useContext(SearchContext);

  return(
    <Paper
    component="div"
    sx={{ p: '2px 4px', m: ' 0 auto 100px auto' , display: 'flex', alignItems: 'center', width: "800px", maxWidth: '100%',  }}
    >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder="Rechercher un lieu"
      inputProps={{ 'aria-label': 'Rechercher un lieu' }}
      onChange={SearchInit}
      />
    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
      <SearchIcon />
    </IconButton>
    </Paper>
  )

}

export default Lieux;
