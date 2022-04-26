import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { Map, MapMarker, Roadview, MapTypeControl } from "react-kakao-maps-sdk";
import { Box } from "@mui/material";
import MarkerContext from "../../Contexts/MarkerContext";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { CategorieService } from "../../Services/CategorieService";
import { CitieService } from "../../Services/CitieService";
import Alert from "@mui/material/Alert";
import { getAuth } from "firebase/auth";
import { db } from "../../backend/config.js";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
//import { ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, GeoPoint } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

const Input = styled("input")({
  display: "none",
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const RoadviewStyle = {
  position: "absolute",
  bottom: "0px",
  right: "0",
  zIndex: "100",
};

const MapViewStyle = {
  width: "100vw",
  height: "90vh",
  zIndex: "90",
};

//Modal pour ajout d'un lieux
function TransitionsModal(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { _lat, _long } = useContext(MarkerContext);
  const { latitute, longitude, lat, long } = props;

  //Get value from database
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    CategorieService.getAll()
      .then((res) => {
        setCategories(res[0].names);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    CitieService.getAll()
      .then((res) => {
        setCities(res[0].cities);
      })
      .catch((e) => console.log(e));
  }, []);

  //A pusher dans la base de données
  const [selectCat, setSelectCat] = useState(0);
  const [selectCitie, setSelectCitie] = useState(0);
  const [title, setTitle] = useState();
  const [viewImg, setViewImg] = useState(false);
  const [inputDescription, setInputDescription] = useState("");
  const [inputFile, setInputFile] = useState([]);
  const [fileUpload, setFileUpload] = useState(0);
  const [user, setUSer] = useState(
    getAuth().currentUser ? getAuth().currentUser.uid : null
  );
  const [load, setLoad] = useState(false);
  const [imgStorage, setImgStorage] = useState([]);
  //State pour le chargement des images
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(null);
  const [erreur, setErreur] = useState(null);

  //Méthode des inputs
  const handleChangeCat = (event) => {
    setSelectCat(event.target.value);
  };

  const handleChangeCitie = (event) => {
    setSelectCitie(event.target.value);
  };

  const handleDescription = (event) => {
    setInputDescription(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleFiles = (event) => {
    if (event.target.files && event.target.files[0]) {
      setViewImg(true);
      for (let i = 0; i < event.target.files.length; i++) {
        inputFile.push({ id: inputFile.length, item: event.target.files[i] });
      }
    } else {
      setViewImg(false);
    }
  };

  const deleteItem = useCallback((i) => {
    const index = [...inputFile].filter((img) => img.id !== i);
    setInputFile(index);
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoad(true);

    const storage = getStorage();

    if (
      title != "" &&
      selectCat != null &&
      selectCitie != null &&
      lat != "" &&
      long != "" &&
      inputDescription != ""
    ) {
      if (inputFile.length > 0) {
        let nb = Math.round(Math.random() * 300000)
        for (let m = 0; m < inputFile.length; m++) {
          var storageRef = ref(
            storage,
            `/lieux/${nb}`
          );
          const u = uploadBytesResumable(storageRef, inputFile[m].item);
          imgStorage.push(nb);
          u.on("state_changed", (snap) => {
            const prog = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            setProgress(prog);
          });
        }
        const datas = {
          title: title,
          categorie_id: selectCat,
          citie_id: selectCitie,
          geopoint: new GeoPoint(lat, long),
          premium: false,
          statut: false,
          created_at: new Date(),
          updated_at: new Date(),
          images: imgStorage,
          user: user,
          description: inputDescription,
        };
        setDoc(doc(collection(db, "lieux")), datas);

        setTimeout(() => {
          setLoad(false);
          window.location.href = "/";
        }, 6000);
      } else {
        setErreur("Le lieux doit contenir au moins 1 image");
      }
    } else {
      setErreur("Les champs ne doivent pas être vide");
    }
  };

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleOpen} style={{ position:'absolute', bottom: '10px', left: '10px' }}>
        <AddIcon />
      </Fab>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Ajouter un lieu
            </Typography>
            <Box sx={{ width: "100%", mt: 4, mb: 4 }}>
              {erreur != null ? (
                <Alert severity="error"> {erreur} </Alert>
              ) : null}
            </Box>
            <div style={{ height: "450px", overflowY: "auto" }}>
              <Box sx={{ mt: 4, mb: 4 }}>
                <TextField
                  id="outlined"
                  sx={{ width: "100%" }}
                  label="Titre"
                  variant="outlined"
                  required
                  value={title}
                  onChange={handleTitle}
                ></TextField>
              </Box>
              <Box sx={{ mt: 4, mb: 4 }}>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Latitude"
                  sx={{ width: "100%" }}
                  variant="standard"
                  onChange={latitute}
                  value={lat}
                  required
                />
              </Box>
              <Box sx={{ mt: 4, mb: 4 }}>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Longitude"
                  sx={{ width: "100%" }}
                  variant="standard"
                  onChange={longitude}
                  value={long}
                  required
                />
              </Box>
              <Box sx={{ mt: 4, mb: 4 }}>
                <TextField
                  id="outlined-select-currency"
                  select
                  sx={{ width: "100%" }}
                  label="Localisation"
                  value={selectCitie}
                  onChange={handleChangeCitie}
                  required
                >
                  {cities.map((options, i) => {
                    return (
                      <MenuItem key={i} value={i}>
                        {options}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
              <Box sx={{ mt: 4, mb: 4 }}>
                <TextField
                  id="outlined-select"
                  select
                  sx={{ width: "100%" }}
                  label="Catégories"
                  value={selectCat}
                  onChange={handleChangeCat}
                  required
                >
                  {categories.map((options, i) => {
                    return (
                      <MenuItem key={i} value={i}>
                        {options}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
              <Box sx={{ mt: 4, mb: 4 }}>
                <label
                  htmlFor="icon-button-file"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    onChange={handleFiles}
                    multiple
                    required
                    type="file"
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                  <Typography color="primary">Ajouter vos photos</Typography>
                </label>
                <Box
                  sx={{ flexGrow: 1, maxWidth: 752 }}
                  style={{ display: viewImg ? "block" : "none" }}
                >
                  <List>
                    {inputFile.map((img, i) => {
                      return (
                        <ListItem
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon onClick={() => deleteItem(img.id)} />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <FolderIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText>{img.item.name}</ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              </Box>
              <Box sx={{ mt: 4, mb: 4 }}>
                <TextField
                  id="outlined-basic"
                  label="Description"
                  sx={{ width: "100%" }}
                  variant="outlined"
                  onChange={handleDescription}
                  multiline={true}
                  minRows={3}
                  value={inputDescription}
                  required
                />
              </Box>
              <Box>
                {progress > 0 && (
                  <Box sx={{ mt: 4, mb: 4 }}>
                    <LinearProgress variant="determinate" value={progress} />
                  </Box>
                )}
                <Button
                  variant="contained"
                  disabled={load ? true : false}
                  onClick={handleSubmit}
                >
                  Créer mon lieu
                </Button>
              </Box>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default function AddLieu() {
  const [watch, setWatch] = useState(false);
  const [lat, setLat] = useState(35.10126565102654);
  const [long, setLong] = useState(129.1183923047988);

  const handleWatch = useCallback(() => {
    setWatch(!watch);
  });

  const hangleLong = (event) => {
    setLong(event.target.value);
  };
  const hangleLat = (event) => {
    setLat(event.target.value);
  };
  return (
    <>
      <MarkerContext.Provider value={{ _lat: lat, _long: long }}>
        <Box>
          <MapView />
          <StreetView visible={watch} />
          <Button
            sx={{ position: "absolute", top: 130, right: 0, zIndex: 100 }}
            variant="contained"
            onClick={handleWatch}
          >
            SEE
          </Button>
        </Box>
        <TransitionsModal
          lat={lat}
          long={long}
          longitude={hangleLong}
          latitute={hangleLat}
        />
      </MarkerContext.Provider>
    </>
  );
}

function StreetView(props) {
  const { _lat, _long } = useContext(MarkerContext);

  const { visible } = props;

  return (
    <Box
      style={RoadviewStyle}
      sx={{
        width: { md: 350, xs: 250 },
        height: { md: 300, xs: 250 },
        display: visible ? "block" : "none",
      }}
    >
      <Roadview // 로드뷰를 표시할 Container
        position={{
          // 지도의 중심좌표
          lat: _lat,
          lng: _long,
          radius: 50,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
}

function MapView() {
  const { _lat, _long } = useContext(MarkerContext);
  return (
    <Map
      id="map"
      center={{
        lat: _lat,
        lng: _long,
      }}
      style={MapViewStyle}
      level={13}
    >
      <MapTypeControl />
      <MapMarker // 마커를 생성합니다
        position={{
          // 마커가 표시될 위치입니다
          lat: _lat,
          lng: _long,
        }}
      />
    </Map>
  );
}
