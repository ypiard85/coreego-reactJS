import React, { useState, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Typography, Avatar, Tabs, Tab, Alert } from "@mui/material";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db, storage } from "../../backend/config";
import {
  ref,
  getDownloadURL,
  listAll,
  uploadBytesResumable,
  getStorage,
  deleteObject,
} from "firebase/storage";
import CustomizedProgressBars from "../../composants/FacebookCircularProgress";
import { LieuService } from "../../Services/LieuService";
import Grid from "@mui/material/Grid";
import CardLieux from "../../composants/CardLieux";
//Icon
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { UserService } from "../../Services/UserService";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Fab from "@mui/material/Fab";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

function reduce(state = false, action) {
  switch (action.type) {
    case "IS_AUTH_PROFIL":
      return (state = true);
      break;
    default:
      return state;
  }
}

const SingleProfil = () => {
  const params = useParams();
  const [lieux, setLieux] = useState([]);
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();
  const [state, dispatch] = useReducer(reduce);

  const getLieux = () => {
    LieuService.getLieuxFromUSer(params.id)
      .then((res) => {
        setLieux(res);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getLieux();
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      if (UserService.singleProfilIsAuthProfil(params.id)) {
        dispatch({ type: "IS_AUTH_PROFIL" });
      }
    }
  });

  useEffect(() => {
    const profilCol = collection(db, "users");
    const getProfil = async () => {
      await getDocs(profilCol).then((snap) => {
        snap.forEach((doc) => {
          if (doc.id == params.id) {
            setUser({ ...doc.data(), id: doc.id });
          }
        });
      });
    };
    getProfil();
  }, []);

  const getAvatar = async () => {
    const refs = ref(storage, "avatar");
    await listAll(refs)
      .then((res) => {
        res.items.forEach((item) => {
          if (user && item.name == user.avatar) {
            getDownloadURL(item).then((url) => {
              setAvatar(url);
            });
          }
        });
      })
      .catch((erreur) => console.log(erreur));
  };

  if (user) {
    getAvatar();
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Container>
        <UserInfo user={user} avatar={avatar} authprofil={state} />
        <BasicTabs lieux={lieux} />
      </Container>
    </Box>
  );
};

function UserInfo(props) {
  const { user, avatar, authprofil } = props;

  const [avatarUpdate, setAvatarUpdate] = useState();
  const [file, setFile] = useState();
  const [fileView, setFileView] = useState();
  const [message, setMessage] = useState(null);

  const handleAvatar = (event) => {
    var preview = document.querySelector("#av");
    var fileimg = document.getElementById("fileimg").files[0];
    setFile(event.target.files[0]);
    setFileView(preview);
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
      },
      false
    );

    if (fileimg) {
      reader.readAsDataURL(fileimg);
    }
  };

  console.log(file);

  const resetFile = () => {
    setFile(null);
  };

  const updateAvatar = () => {
    const nb = Math.round(Math.random() * (300000 * 10)) + auth.currentUser.uid;
    //Upload image
    const thisavatar = ref(storage, `avatar/${user.avatar}`);

    if (file) {
      deleteObject(thisavatar).then((res) => {
        console.log(res);
      });
      var storageRef = ref(storage, `/avatar/${nb}`);
      uploadBytesResumable(storageRef, file);
      const docs = doc(db, "users", auth.currentUser.uid);
      updateDoc(docs, {
        avatar: nb,
      });
      setMessage("Votre photo ?? bien ??t?? mis ?? jour");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const sns = [
    {
      icon: <FacebookIcon title="Facebook" />,
      lien: user && user.facebook != "" ? user.facebook : "",
    },
    {
      icon: <InstagramIcon />,
      lien: user && user.instagram != "" ? user.instagram : "",
    },
    {
      icon: <TwitterIcon color="#005998" />,
      lien: user && user.twitter != "" ? user.twitter : null,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 512 512"
          id="icons"
          fill="#005998"
        >
          <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
        </svg>
      ),
      lien: user && user.tiktok != "" ? user.tiktok : null,
    },
  ];

  return (
    <Box>
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {avatar ? (
          <React.Fragment>
            <Box sx={{ position: "relative", width: 60, height: 60, mr: 3 }}>
              <img
                alt="Remy Sharp"
                id="av"
                src={file ? "" : avatar}
                style={{
                  width: 60,
                  height: 60,
                  mr: 3,
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              {authprofil && (
                <Typography
                  variant="p"
                  sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "50%",
                    background: "rgba(82, 82, 82, 0.555)",
                    borderRadius: "0  0 100px 100px",
                    cursor: "pointer",
                  }}
                >
                  <PhotoCameraIcon sx={{ color: "white" }} />
                  <input
                    id="fileimg"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={handleAvatar}
                    type="file"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      opacity: 0,
                    }}
                  />
                </Typography>
              )}
              {file && (
                <Box sx={{ display: "inline-flex" }}>
                  <Fab color="success" aria-label="add" onClick={updateAvatar}>
                    <DoneIcon />
                  </Fab>
                  <Fab color="error" aria-label="add" onClick={resetFile}>
                    <CloseIcon />
                  </Fab>
                </Box>
              )}
            </Box>
          </React.Fragment>
        ) : (
          <CustomizedProgressBars />
        )}

        <Typography variant="h5" componant="h1">
          {user && user.pseudo}
        </Typography>
      </Box>
      <Box sx={{ my: 5 }}>
        <Sns sns={sns} />
      </Box>
      <Box sx={{ my: 5 }}>
        <Typography variant="div" componant="div">
          {user && user.description != ""
            ? user.description
            : "Pas de description"}
        </Typography>
      </Box>
    </Box>
  );
}

function Sns(props) {
  const { sns } = props;

  return (
    <Typography variant="div" component="div" sx={{ display: "block" }}>
      {sns.map((s, index) => {
        return (
          s.lien != "" && (
            <a
              style={{ color: "#005998", marginRight: "10px" }}
              href={s.lien}
              target="__blank"
              key={index}
            >
              {s.icon}
            </a>
          )
        );
      })}
    </Typography>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function BasicTabs(props) {
  const { lieux } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Lieux partag??s" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          {lieux.length > 0
            ? lieux.map((lieu, index) => {
                return (
                  <Grid item md={4} xs={12} key={index}>
                    <CardLieux
                      lieu={lieu}
                      key={index}
                      images={lieu.images[0]}
                    />
                  </Grid>
                );
              })
            : ""}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}

export default SingleProfil;
