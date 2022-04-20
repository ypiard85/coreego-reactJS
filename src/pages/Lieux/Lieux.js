import React, { useState, useRef, useEffect, useCallback, useContext, useMemo } from "react";
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
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

//Import les services
import {LieuService} from '../../Services/LieuService';
import {CitieService} from '../../Services/CitieService';
import {CategorieService} from '../../Services/CategorieService';
import {StorageService} from '../../Services/StorageService';

const SearchContext = React.createContext({
  input: "" ,
  SearchInit: () => {}
});

function Cards(props) {

  const { lieu, cats, citie, images } = props;
  const [url, setUrl] = useState();
  //Récupération des images dans le storage
  useEffect(() => {
    StorageService.getOne(images).then(res=>{
      setUrl(res)
    }).catch(e => console.log(e))
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
              { citie[lieu.citie_id] }
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

  //Get places
  useEffect(() => {
    LieuService.getAll().then(res=>{
      setLieux(res)
    }).catch(e => console.log(e))
  }, [])

  //Get cities
  useEffect(() => {
    CitieService.getAll().then(res => {
      setCities(res[0].cities)
    }).catch(e => console.log(e))
  }, []);

  //Get categories
  useEffect(() => {
    CategorieService.getAll().then(res => {
      setCats(res)
    }).catch(e => console.log(e))
  }, []);

  const {input} = useContext(SearchContext);


  return (
    <>
    <Grid container spacing={2}>
      {lieux.filter(val => {
       return val.title.toLowerCase().includes(input.toLowerCase())
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
