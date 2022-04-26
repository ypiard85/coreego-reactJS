import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../backend/config.js";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { useParams } from "react-router";
import Grid from "@mui/material/Grid";
import {Typography, Avatar} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { Box } from "@mui/material";
import { Map, MapMarker, Roadview } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import PersonIcon from "@mui/icons-material/Person";
import { CategorieService } from "../../Services/CategorieService";
import { CitieService } from "../../Services/CitieService";
import { UserService } from "../../Services/UserService";
import CustomizedProgressBars from '../../composants/FacebookCircularProgress'
// Import Swiper styles
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";
import { LieuService } from "../../Services/LieuService.js";

const Geopoint = React.createContext({
  lat: null,
  long: null,
  update: () => {},
});

const SingleLieu = () => {
  const [lieux, setLieux] = useState([]);
  const [cities, setCities] = useState([]);
  const [cats, setCats] = useState([]);
  const [user, setUser] = useState([]);
  const [urlAvatar, setUrlAvatar] = useState();

  //Récupération des catégories
  useEffect(() => {
    CategorieService.getAll()
      .then((res) => {
        setCats(res);
      })
      .catch((e) => console.log(e));
  }, []);

  //récupération du paramètre de l'url
  let param = useParams();

  //Récupération de la single lieux
  useEffect(() => {
    LieuService.getOneLieu(param.id).then((res) => {
      setLieux(res);
    });
  }, []);

  //Récupération de la ville
  useEffect(() => {
    CitieService.getAll().then((res) => {
      setCities(res);
    });
  }, []);

  const getUser = () => {
    if (lieux.length > 0) {
      UserService.getOneUser(lieux[0].user).then((res) => {
        setUser({...res});
      });
    }
  };

  useEffect(() => {
    lieux.length > 0 && getUser();
  }, [lieux])


  const getAvatar = async () => {
    const refs = ref(storage, "avatar");
    await listAll(refs)
    .then((res) => {
      res.items.forEach((item) => {
        if (user && item.name === user.avatar) {
          getDownloadURL(item).then((url) => {
              setUrlAvatar(url);
            });
          }
        });
      }).catch((erreur) => console.log(erreur));
    };

    useEffect(() => {
      user && getAvatar();
    }, [user])

  return (
    <>
      {lieux.map((l, index) => {
        return <Page lieu={l} key={index} cities={cities} cats={cats} user={user} avatar={urlAvatar} />;
      })}
    </>
  );
};

const Page = (props) => {
  const { lieu, cities, cats, user, avatar } = props;

  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        sx={{ flexDirection: { md: "row", xs: "column-reverse" } }}
      >
        <Grid item md={6} xs={12} sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Box sx={{ display: 'flex', alignItems:'center', alignContent: 'center', mt:3 }}>
          <Typography variant="h4" sx={{ mr:3 }}>{lieu.title}</Typography>
          <Typography
              varaint="p"
              sx={{
                padding: "3px 5px",
                fontSize: "12px",
                pointerEvents: "none",
                fontWeight: "bold",
                borderRadius: "5px",
                backgroundColor: "#005998",
                width: "max-content",
                height: "100%",
              }}
              color="white"
            >
              {cats.map((c) => {
                return c.names[lieu.categorie_id];
              })}
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            {avatar ?
                <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 35, height: 35, mr:1 }} /> : <CustomizedProgressBars />
                }
               <Typography sx={{ display: "flex", alignItems: "center", marginLeft: "10px", fontWeight: 'bold' }} > {user.pseudo} </Typography>

          </Box>
          <Box sx={{ marginTop: "20px" }}>
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
        loopFillGroupWithBlank={true}
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
        <Grid item md={8} xs={12}>
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
        <Grid item md={4} xs={12}>
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
