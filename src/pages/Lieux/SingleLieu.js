import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../backend/config.js";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { useParams } from "react-router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Box } from "@mui/material";
import { Map, MapMarker, Roadview } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import PersonIcon from '@mui/icons-material/Person';

// Import Swiper styles
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";

const Geopoint = React.createContext({
  lat: null,
  long: null,
  update: () => {},
});

const SingleLieu = () => {
  const [lieux, setLieux] = useState([]);
  const [cities, setCities] = useState([]);
  const [cats, setCats] = useState([]);

    //Récupération des catégories
    useEffect(() => {
      const citiesCollection = collection(db, "categories");
      getDocs(citiesCollection).then((snap) => {
        snap.forEach((doc) => {
          setCats([doc.data()]);
        });
      });
    }, []);

  //récupération du paramètre de l'url
  let topicId = useParams();
  //Récupération de la single lieux
  useEffect(() => {
    const lieuxCollection = collection(db, "lieux");
    getDocs(lieuxCollection)
      .then((snap) => {
        snap.forEach((doc) => {
          if (doc.id === topicId.id) {
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
        return <Page lieu={l} key={index} cities={cities} cats={cats} />;
      })}
    </>
  );
};

const Page = (props) => {
  const { lieu, cities, cats } = props;

  return (
    <React.Fragment>
      <Grid container spacing={0} sx={{ flexDirection: { md: 'row', xs: 'column-reverse'  }  }} >
        <Grid item md={6} xs={12} sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", alignItems: "center"}}>
              <Link
                to="/"
                style={{
                  display: "flex",
                  color: "#005998",
                  fontWeight: "bold",
                }}
              >
                <AddLocationIcon />
                {cities.map((c) => {
                  return c.cities[lieu.citie_id];
                })}
              </Link>
          </Box>
            <Typography variant="h4" sx={{  marginTop: '20px' }} >{lieu.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }} >
            <Typography
              varaint="p"
              sx={{
                padding: "3px 5px",
                fontSize: '12px',
                pointerEvents: "none",
                fontWeight: "bold",
                borderRadius: '5px',
                backgroundColor: "#005998",
                width: 'max-content'
              }}
              color="white"
              >
              {cats.map((c) => {
                return c.names[lieu.categorie_id];
              })}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}  >
              <PersonIcon />
                {lieu.user}
            </Typography>
          </Box>
          <Box sx={{  marginTop: '20px' }}>
          <Typography variant="p">{lieu.description}</Typography>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <Diapo images={lieu.images} />
        </Grid>
        </Grid>
        <Geopoint.Provider
          value={{ lat: lieu.geopoint._lat, long: lieu.geopoint._long }}
        >
          <Maps />
        </Geopoint.Provider>
    </React.Fragment>
  );
};

function Diapo(props) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const { images } = props;

  const [imgRef, setImgRef] = useState([]);
  const [url, setUrl] = useState([]);

  const refs = ref(storage, "lieux");
  useEffect(() => {
    listAll(refs)
      .then((res) => {
        res.items.forEach((item) => {
          images.forEach((image) => {
            if (image === item.name) {
              getDownloadURL(item).then((url) => {
                setUrl((arr) => [...arr, url]);
              });
            }
          });
        });
      })
      .catch((erreur) => console.log(erreur));
  }, []);

  return (
    <>
      <Swiper
        spaceBetween={10}
        navigation={false}
        loop={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="singlePlaceDiapoTop"
      >
        {url.map((u, i) => {
          return (
            <SwiperSlide key={i}>
              <img src={u} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={0}
        slidesPerView={4}
        freeMode={true}
        loops={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="singlePlaceDiapoBottom"
      >
        {url.map((u, j) => {
          return (
            <SwiperSlide key={j}>
              <img src={u} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}

function Maps() {
  const point = useContext(Geopoint);
  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={8}>
          <Roadview // 로드뷰를 표시할 Container
            position={{
              // 지도의 중심좌표
              lat: point.lat,
              lng: point.long,
              radius: 50,
            }}
            style={{
              // 지도의 크기
              width: "100%",
              height: "360px",
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Map
            center={{ lat: point.lat, lng: point.long }}
            style={{ width: "100%", height: "360px" }}
            level={2}
          >
            <MapMarker
              position={{ lat: point.lat, lng: point.long }}
            ></MapMarker>
          </Map>
        </Grid>
      </Grid>
    </>
  );
}

export default SingleLieu;
