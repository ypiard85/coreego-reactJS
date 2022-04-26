import React, {useState, useEffect} from 'react'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import LoadingImg from '../images/caree_loading.png';
import Grid from "@mui/material/Grid";
import {StorageService} from '../Services/StorageService';
import Skeletons from './Skeleton';
function CardLieux(props) {

    const { lieu, cats, citie, images } = props;
    const [url, setUrl] = useState();
    //Récupération des images dans le storage
    useEffect(() => {
      StorageService.getOne(images).then(res=>{
        setUrl(res)
      }).catch(e => console.log(e))
    }, []);

    const getCat = () => {
      return (
        cats.map(c => {
          return  c.names[lieu.categorie_id]
        })
      )
    }

    const getCitie = () => {
      return (
        citie.map(t => {
          return t.cities[lieu.citie_id]
        })
      )
    }

    const Onecard = () => {
      return(
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
        {getCat()}
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
                {getCitie()}
              </Typography>
            </CardContent>
          </CardActionArea>
          <Link to={"/lieu/" + lieu.id} className="link__card"></Link>
        </Card>
      )
    }

    return (
      <>
       { url ? <Onecard /> : <Skeletons /> }
      </>
      );
    }

export default CardLieux